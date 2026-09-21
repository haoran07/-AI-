// 情报工作站 API：只负责登录鉴权、创建任务和查询结果。
// 长时间运行的 Dify 工作流由 GitHub Actions 免费运行器执行，避免 Edge Function 超时。
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': 'https://haoxixi.com.cn',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const jsonHeaders = { ...cors, 'Content-Type': 'application/json; charset=utf-8' }
const allowedTimeRanges = new Set(['最近24小时', '最近一周', '最近一个月', '最近三个月', '时间不限'])
const allowedMarkets = new Set(['全球', '美国', '加拿大', '英国', '欧洲', '日本', '韩国', '东南亚', '中东', '拉丁美洲'])
const allowedLanguages = new Set(['自动判断', '英文', '日文', '韩文', '西班牙文', '不限'])

function jsonError(status: number, code: string, message: string, retryable = false) {
  return Response.json({ success: false, status: 'failed', code, message, retryable }, { status, headers: jsonHeaders })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return jsonError(405, 'METHOD_NOT_ALLOWED', 'Method not allowed')
  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return jsonError(401, 'AUTHENTICATION_REQUIRED', '请注册或登录后使用情报工作站。')

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !anonKey || !serviceKey) return jsonError(503, 'SERVER_CONFIG_ERROR', '登录服务配置异常，请稍后再试。', true)
  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } } })
  const adminClient = createClient(supabaseUrl, serviceKey)
  const { data: { user }, error: authError } = await userClient.auth.getUser()
  if (authError || !user) return jsonError(401, 'AUTHENTICATION_EXPIRED', '登录状态已失效，请重新登录。')

  const { data: access } = await adminClient.from('intelligence_authorized_users').select('user_id').eq('user_id', user.id).maybeSingle()
  if (!access) return jsonError(403, 'ACCESS_DENIED', '情报工作站目前仅对管理员账号开放。')

  let payload: Record<string, unknown>
  try { payload = await req.json() } catch { return jsonError(400, 'INVALID_REQUEST', '请求内容格式不正确。') }
  const action = String(payload.action || 'start')

  if (action === 'status') {
    const jobId = String(payload.jobId || '').trim()
    if (!/^[0-9a-f-]{36}$/i.test(jobId)) return jsonError(400, 'INVALID_JOB_ID', '任务编号无效。')
    const { data: job, error } = await userClient.from('intelligence_jobs').select('id,status,report,sources,valid_source_count,error_message,created_at,completed_at').eq('id', jobId).single()
    if (error || !job) return jsonError(404, 'JOB_NOT_FOUND', '没有找到这个任务。')
    if (job.status === 'failed') return jsonError(502, 'WORKFLOW_FAILED', job.error_message || 'Dify 工作流执行失败，请查看运行记录。', true)
    if (job.status !== 'completed') return Response.json({ success: true, status: job.status, jobId }, { headers: jsonHeaders })
    return Response.json({ success: true, status: 'completed', jobId, report: job.report, sources: job.sources || [], validSourceCount: job.valid_source_count || 0, createdAt: job.completed_at || job.created_at }, { headers: jsonHeaders })
  }

  const topic = String(payload.topic || '').trim()
  const timeRange = String(payload.timeRange || '').trim()
  const targetMarket = String(payload.targetMarket || '').trim()
  const sourceLanguage = String(payload.sourceLanguage || '').trim()
  if (topic.length < 2 || topic.length > 100) return jsonError(400, 'INVALID_TOPIC', '关注主题需要填写 2—100 个字符。')
  if (!allowedTimeRanges.has(timeRange)) return jsonError(400, 'INVALID_TIME_RANGE', '请选择有效的时间范围。')
  if (!allowedMarkets.has(targetMarket)) return jsonError(400, 'INVALID_MARKET', '请选择有效的目标地区。')
  if (!allowedLanguages.has(sourceLanguage)) return jsonError(400, 'INVALID_LANGUAGE', '请选择有效的来源语言。')

  const { data: job, error: insertError } = await userClient.from('intelligence_jobs').insert({ user_id: user.id, topic, time_range: timeRange, target_market: targetMarket, source_language: sourceLanguage }).select('id,status').single()
  if (insertError || !job) {
    console.error(JSON.stringify({ stage: 'create_job', error: insertError?.message }))
    return jsonError(503, 'JOB_CREATE_FAILED', '暂时无法创建情报任务，请稍后重试。', true)
  }

  const githubToken = Deno.env.get('GITHUB_ACTIONS_TOKEN')
  const githubRepo = Deno.env.get('GITHUB_REPOSITORY') || 'haoran07/-AI-'
  const workflowFile = Deno.env.get('GITHUB_WORKFLOW_FILE') || 'intelligence-worker.yml'
  if (!githubToken) {
    await adminClient.from('intelligence_jobs').update({ status: 'failed', error_message: '后台运行器尚未配置。' }).eq('id', job.id)
    return jsonError(503, 'WORKER_NOT_CONFIGURED', '后台运行器尚未配置，请联系管理员。')
  }
  const dispatch = await fetch(`https://api.github.com/repos/${githubRepo}/actions/workflows/${workflowFile}/dispatches`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'haoran-intelligence-station' },
    body: JSON.stringify({ ref: 'main', inputs: { job_id: job.id } }),
  })
  if (!dispatch.ok) {
    const detail = await dispatch.text()
    console.error(JSON.stringify({ stage: 'dispatch', status: dispatch.status, detail: detail.slice(0, 300) }))
    await adminClient.from('intelligence_jobs').update({ status: 'failed', error_message: '后台任务启动失败。' }).eq('id', job.id)
    return jsonError(502, 'WORKER_START_FAILED', '后台任务启动失败，请稍后重试。', true)
  }
  return Response.json({ success: true, status: 'queued', jobId: job.id }, { status: 202, headers: jsonHeaders })
})
