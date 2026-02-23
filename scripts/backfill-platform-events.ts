/**
 * Backfill: Sync existing live Anchor org events from platform_sponsored_events to website events.
 * Run once after deploying the sync trigger, to sync events that were already "live" before the trigger existed.
 *
 * Usage: npx tsx scripts/backfill-platform-events.ts
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Parse .env manually (same as seed-events.ts)
const envPath = resolve(process.cwd(), '.env')
const envContent = readFileSync(envPath, 'utf-8')
const envVars: Record<string, string> = {}
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) envVars[match[1].trim()] = match[2].trim()
}

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const serviceRoleKey = envVars['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function backfill() {
  // Find Anchor org(s): slug = 'anchor' or name ILIKE 'Anchor' (matches "Anchor", "Anchor Dating")
  const { data: anchorOrgs, error: orgError } = await supabase
    .from('organizations')
    .select('id')
    .or('slug.eq.anchor,name.ilike.Anchor')

  if (orgError) {
    console.error('Failed to fetch organizations:', orgError.message)
    process.exit(1)
  }

  if (!anchorOrgs?.length) {
    console.log('No Anchor organization found. Skipping backfill.')
    return
  }

  const anchorOrgIds = anchorOrgs.map((o) => o.id)

  // Fetch live platform events from Anchor org(s)
  const { data: platformEvents, error: eventsError } = await supabase
    .from('platform_sponsored_events')
    .select('*')
    .in('organization_id', anchorOrgIds)
    .eq('status', 'live')
    .is('deleted_at', null)

  if (eventsError) {
    console.error('Failed to fetch platform events:', eventsError.message)
    process.exit(1)
  }

  if (!platformEvents?.length) {
    console.log('No live Anchor events found in platform. Nothing to backfill.')
    return
  }

  console.log(`Found ${platformEvents.length} live Anchor event(s) to sync.`)

  for (const p of platformEvents) {
    const location = [p.venue_name, p.city].filter(Boolean).join(', ') || p.venue_address || 'TBD'

    const { error: upsertError } = await supabase.from('events').upsert(
      {
        title: p.event_title,
        description: p.event_description,
        date: p.event_datetime,
        location,
        image_url: p.image_url,
        price: 0,
        created_by: null,
        platform_sponsored_event_id: p.id,
        is_hidden: false,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'platform_sponsored_event_id',
      }
    )

    if (upsertError) {
      console.error(`Failed to sync event ${p.id} (${p.event_title}):`, upsertError.message)
    } else {
      console.log(`  ✓ Synced: ${p.event_title}`)
    }
  }

  console.log('✅ Backfill complete.')
}

backfill()
