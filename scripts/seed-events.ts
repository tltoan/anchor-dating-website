import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Parse .env manually
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

const events = [
  {
    title: "Anchor's First Event @ one40.social",
    description:
      "We hope you're as excited for our first event as we are with @one40.social!\n\nCome join us to celebrate Anchor's first event at @one40.social at 7PM this Thursday.\n\nMake sure to download Anchor before coming! P.S, come early... you might just get free drinks on us 👀",
    date: new Date('2026-02-12T19:00:00-05:00').toISOString(), // Thu Feb 12, 7PM EST
    location: 'one40.social, NYC',
    price: 0,
    image_url: null,
  },
]

async function seed() {
  console.log('Deleting all existing events...')
  const { error: deleteError } = await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (deleteError) {
    console.error('Delete error:', deleteError.message)
    // Continue anyway — table might be empty
  }

  console.log('Inserting 1 event...')
  const { data, error } = await supabase.from('events').insert(events).select()

  if (error) {
    console.error('Insert error:', error.message)
    process.exit(1)
  }

  console.log('✅ Seeded events:')
  for (const e of data!) {
    console.log(`  - ${e.title} (id: ${e.id})`)
  }
}

seed()
