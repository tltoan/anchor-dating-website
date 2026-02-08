import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/** Normalize to digits only (for fallback lookup). */
function digitsOnly(phone: string) {
  return phone.replace(/\D/g, '').trim()
}

/** Keep E.164 for storage/lookup (match mobile app auth.user.phone). */
function normalizePhoneForStorage(raw: string) {
  const s = raw.trim()
  if (!s) return null
  if (s.startsWith('+')) return s
  const d = digitsOnly(s)
  if (d.length < 10) return null
  if (d.length === 10) return `+1${d}`
  return `+${d}`
}

/** Map main app users row to events-auth user shape (id, name, email, phone, is_admin) */
function mapProfileToUser(profile: {
  id: string
  first_name?: string | null
  last_name?: string | null
  email?: string | null
  phone_number?: string | null
  is_admin?: boolean | null
}) {
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim() || null
  return {
    id: profile.id,
    name,
    email: profile.email ?? null,
    phone: profile.phone_number ?? null,
    is_admin: Boolean(profile.is_admin),
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { email, phone: rawPhone, auth_user_id: authUserId, name: nameFromBody, access_token: accessToken } = body
    // Phone: accept E.164 from client (match mobile app); normalize for storage/lookup
    const phoneE164 = rawPhone ? normalizePhoneForStorage(String(rawPhone)) : null
    const phoneDigits = rawPhone ? digitsOnly(String(rawPhone)) : null
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // Phone flow: find existing user first (RLS blocks anon – use access_token or service role), then create if missing
    if (phoneE164 || authUserId) {
      // 1) With access_token we can read the user's own row (RLS: auth.uid() = auth_user_id) – finds existing user on re-login
      if (authUserId && accessToken) {
        const authClient = createClient(supabaseUrl, supabaseKey, {
          global: { headers: { Authorization: `Bearer ${accessToken}` } },
        })
        const { data: profileByAuth, error: authErr } = await authClient
          .from('users')
          .select('id, first_name, last_name, email, phone_number, is_admin')
          .eq('auth_user_id', authUserId)
          .single()

        if (!authErr && profileByAuth) {
          return NextResponse.json({
            success: true,
            user: mapProfileToUser(profileByAuth),
            isNewUser: false,
          })
        }
      }

      // 2) With service role, find by auth_user_id or phone (bypass RLS) – no token or anon couldn't read
      if (serviceRoleKey) {
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
        if (authUserId) {
          const { data: profileByAuth, error: authErr } = await supabaseAdmin
            .from('users')
            .select('id, first_name, last_name, email, phone_number, is_admin')
            .eq('auth_user_id', authUserId)
            .maybeSingle()
          if (!authErr && profileByAuth) {
            return NextResponse.json({
              success: true,
              user: mapProfileToUser(profileByAuth),
              isNewUser: false,
            })
          }
        }
        if (phoneE164 || phoneDigits) {
          const phones = [phoneE164, phoneDigits].filter(Boolean) as string[]
          const { data: byPhone } = await supabaseAdmin
            .from('users')
            .select('id, first_name, last_name, email, phone_number, is_admin')
            .in('phone_number', phones)
            .limit(1)
            .maybeSingle()
          if (byPhone) {
            return NextResponse.json({
              success: true,
              user: mapProfileToUser(byPhone),
              isNewUser: false,
            })
          }
        }
      }

      // Not found: create user (OTP verified). New users must provide a name.
      if (authUserId && phoneE164) {
        const firstName = typeof nameFromBody === 'string' && nameFromBody.trim() ? nameFromBody.trim() : ''
        if (!firstName) {
          return NextResponse.json(
            { success: false, need_name: true, message: 'Please enter your name to complete sign up.' },
            { status: 400 }
          )
        }

        let client
        if (accessToken) {
          client = createClient(supabaseUrl, supabaseKey, {
            global: { headers: { Authorization: `Bearer ${accessToken}` } },
          })
        } else {
          if (!serviceRoleKey) {
            return NextResponse.json(
              { error: 'Server misconfigured. Set SUPABASE_SERVICE_ROLE_KEY in env.' },
              { status: 503 }
            )
          }
          client = createClient(supabaseUrl, serviceRoleKey)
        }

        const now = Math.floor(Date.now() / 1000)
        const { data: newProfile, error: insertErr } = await client
          .from('users')
          .insert({
            auth_user_id: authUserId,
            phone_number: phoneE164,
            email: null,
            verified_phone: true,
            verified_email: false,
            first_name: firstName,
            last_name: '',
            birth_date: '',
            gender: '',
            created_at: now,
            last_active_at: now,
          })
          .select('id, first_name, last_name, email, phone_number, is_admin')
          .single()

        if (!insertErr && newProfile) {
          return NextResponse.json({
            success: true,
            user: mapProfileToUser(newProfile),
            isNewUser: true,
          })
        }
        // Duplicate phone_number: user already exists. Return existing user (service role can read any row).
        if (insertErr?.code === '23505' && insertErr?.message?.includes('users_phone_number_key')) {
          if (serviceRoleKey) {
            const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
            const phones = [phoneE164, phoneDigits].filter(Boolean) as string[]
            const { data: existing } = await supabaseAdmin
              .from('users')
              .select('id, first_name, last_name, email, phone_number, is_admin')
              .in('phone_number', phones)
              .limit(1)
              .maybeSingle()
            if (existing) {
              return NextResponse.json({
                success: true,
                user: mapProfileToUser(existing),
                isNewUser: false,
              })
            }
          }
          return NextResponse.json(
            { error: 'An account with this phone number already exists. Please log in.' },
            { status: 409 }
          )
        }
        console.error('Error creating profile:', insertErr)
        return NextResponse.json(
          { error: 'Failed to create account', details: insertErr?.message },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { error: 'User not found. Sign up in the app first, then log in here with your phone.' },
        { status: 404 }
      )
    }

    // Email flow: lookup by email (anon may be blocked by RLS – use service role if available)
    if (!email) {
      return NextResponse.json(
        { error: 'Phone or email is required' },
        { status: 400 }
      )
    }

    const supabaseEmail = serviceRoleKey
      ? createClient(supabaseUrl, serviceRoleKey)
      : createClient(supabaseUrl, supabaseKey)
    const { data: profileByEmail, error: emailErr } = await supabaseEmail
      .from('users')
      .select('id, first_name, last_name, email, phone_number, is_admin')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle()

    if (emailErr) {
      console.error('Error checking user by email:', emailErr)
      return NextResponse.json(
        { error: 'Failed to check user', details: emailErr.message },
        { status: 500 }
      )
    }

    if (profileByEmail) {
      return NextResponse.json({
        success: true,
        user: mapProfileToUser(profileByEmail),
        isNewUser: false,
      })
    }

    return NextResponse.json(
      { error: 'User not found. Sign up in the app first.' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Events auth error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to authenticate'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
