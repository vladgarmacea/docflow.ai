import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const checks: Record<string, { ok: boolean; detail: string }> = {}

  // 1. Environment variables
  const envVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ANTHROPIC_API_KEY',
  ]
  for (const v of envVars) {
    checks[v] = process.env[v]
      ? { ok: true,  detail: 'set' }
      : { ok: false, detail: 'MISSING' }
  }

  // 2. Supabase connection
  try {
    const supabase = createAdminClient()
    const { count, error } = await supabase
      .from('workflows')
      .select('*', { count: 'exact', head: true })
    if (error) throw error
    checks['supabase_db'] = { ok: true, detail: `connected — ${count} workflows` }
  } catch (err: any) {
    checks['supabase_db'] = { ok: false, detail: err.message }
  }

  // 3. Supabase storage buckets
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.storage.listBuckets()
    if (error) throw error
    const buckets = data.map(b => b.name).join(', ')
    checks['supabase_storage'] = { ok: true, detail: `buckets: ${buckets}` }
  } catch (err: any) {
    checks['supabase_storage'] = { ok: false, detail: err.message }
  }

  const allOk = Object.values(checks).every(c => c.ok)

  return NextResponse.json(
    { status: allOk ? 'ok' : 'degraded', checks, timestamp: new Date().toISOString() },
    { status: allOk ? 200 : 500 }
  )
}
