const required = ['JOB_ID', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'DIFY_INTELLIGENCE_API_KEY']
for (const name of required) if (!process.env[name]) throw new Error(`Missing secret: ${name}`)

const jobId = process.env.JOB_ID
const supabaseUrl = process.env.SUPABASE_URL.replace(/\/$/, '')
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const difyBase = (process.env.DIFY_INTELLIGENCE_API_URL || 'https://api.dify.ai/v1').replace(/\/$/, '')
const restHeaders = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' }

async function updateJob(values) {
  const response = await fetch(`${supabaseUrl}/rest/v1/intelligence_jobs?id=eq.${jobId}`, { method: 'PATCH', headers: { ...restHeaders, Prefer: 'return=minimal' }, body: JSON.stringify(values) })
  if (!response.ok) throw new Error(`Supabase update failed (${response.status}): ${await response.text()}`)
}

function object(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value
  if (typeof value === 'string') { try { return object(JSON.parse(value)) } catch {} }
  return {}
}

function findReport(outputs) {
  for (const key of ['report', 'text', 'output', 'result', 'answer', 'final_output', 'content']) {
    const value = outputs[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
    const nested = object(value)
    if (Object.keys(nested).length) { const found = findReport(nested); if (found) return found }
  }
  const excluded = new Set(['topic', 'time_range', 'target_market', 'source_language', 'source_records_json'])
  return Object.entries(outputs).filter(([key, value]) => !excluded.has(key) && typeof value === 'string' && value.trim().length >= 80).map(([, value]) => value.trim()).sort((a, b) => b.length - a.length)[0] || ''
}

function parseSources(value) {
  let rows = value
  if (typeof rows === 'string') { try { rows = JSON.parse(rows) } catch { return [] } }
  if (!Array.isArray(rows)) return []
  return rows.slice(0, 30).map((row, index) => {
    row = object(row)
    let url = ''
    try { const parsed = new URL(String(row.url || '')); if (['http:', 'https:'].includes(parsed.protocol)) url = parsed.toString() } catch {}
    return { source_id: Number(row.source_id || index + 1), title: String(row.title || '未命名来源').slice(0, 300), url, domain: String(row.domain || '').slice(0, 200), estimated_date: String(row.estimated_date || '').slice(0, 50) }
  }).filter(row => row.url)
}

try {
  const jobResponse = await fetch(`${supabaseUrl}/rest/v1/intelligence_jobs?id=eq.${jobId}&select=*`, { headers: restHeaders })
  if (!jobResponse.ok) throw new Error(`Cannot load job (${jobResponse.status})`)
  const [job] = await jobResponse.json()
  if (!job) throw new Error('Job not found')
  await updateJob({ status: 'running', started_at: new Date().toISOString(), error_message: null })
  const response = await fetch(`${difyBase}/workflows/run`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.DIFY_INTELLIGENCE_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputs: { topic: job.topic, time_range: job.time_range, target_market: job.target_market, source_language: job.source_language }, response_mode: 'blocking', user: job.user_id }),
    signal: AbortSignal.timeout(25 * 60 * 1000),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`Dify failed (${response.status}): ${String(data.message || 'unknown error').slice(0, 500)}`)
  const outputs = object(data.data?.outputs ?? data.outputs)
  const report = findReport(outputs)
  if (!report) throw new Error(`Dify completed without a report. Output keys: ${Object.keys(outputs).join(', ')}`)
  const sources = parseSources(outputs.source_records_json ?? outputs.source_records ?? outputs.source_re ?? outputs.source_urls ?? outputs.source_ur)
  const count = Number(outputs.valid_source_count ?? outputs.source_count ?? outputs.source_co ?? sources.length) || 0
  await updateJob({ status: 'completed', report, sources, valid_source_count: count, completed_at: new Date().toISOString() })
  console.log(`Intelligence job ${jobId} completed.`)
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  try { await updateJob({ status: 'failed', error_message: message.slice(0, 1000), completed_at: new Date().toISOString() }) } catch (updateError) { console.error(updateError) }
  process.exitCode = 1
}
