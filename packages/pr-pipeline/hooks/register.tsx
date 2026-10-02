import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Pipeline } from '../types'

type Api = EngineInterface

const pipeline = atom({ plugin: 'pr-pipeline', key: 'pipeline' } as const, null)

const POLL_MS = 45_000
// Commands that can change a PR's state, so the band refreshes right after.
const TOUCHES_PR = /\bgh\s+pr\b|\bgit\s+push\b|\bgit\s+worktree\b/
const PREVIEW = /deploy|netlify|vercel|preview/i

async function sh($: Api, argv: string[], cwd: string) {
  try {
    return await $.process.run(argv, { cwd, timeoutMs: 20_000 })
  } catch {
    return null
  }
}

async function readPipeline($: Api): Promise<Pipeline | null> {
  const cwd = await $.session.cwd()
  const branch = await sh($, ['git', 'rev-parse', '--abbrev-ref', 'HEAD'], cwd)
  if (!branch || branch.exitCode !== 0) return null
  const name = branch.stdout.trim()
  if (name === 'main' || name === 'HEAD') return null

  const pr = await sh($, ['gh', 'pr', 'view', '--json', 'number,title,state,statusCheckRollup'], cwd)
  if (!pr || pr.exitCode !== 0) return null
  const j = JSON.parse(pr.stdout)

  const checks = (j.statusCheckRollup ?? []) as Array<Record<string, string>>
  const state = (c: Record<string, string>) => c.conclusion || c.state || c.status || ''
  const fail = checks.filter(c => /FAIL|ERROR|CANCEL|TIMED/i.test(state(c))).length
  const ok = checks.filter(c => /SUCCESS|NEUTRAL|SKIPPED/i.test(state(c))).length
  const deploy = checks.find(c => PREVIEW.test(`${c.name ?? ''} ${c.context ?? ''}`))
  const preview: Pipeline['preview'] = !deploy
    ? 'none'
    : /FAIL|ERROR|CANCEL|TIMED/i.test(state(deploy))
      ? 'failed'
      : /SUCCESS|NEUTRAL|SKIPPED/i.test(state(deploy))
        ? 'ready'
        : 'building'

  const trees = await sh($, ['git', 'worktree', 'list', '--porcelain'], cwd)
  const worktrees = trees?.exitCode === 0 ? trees.stdout.split('\n').filter(l => l.startsWith('worktree ')).length - 1 : 0

  return {
    branch: name,
    number: j.number,
    title: j.title,
    state: j.state,
    ok,
    fail,
    pending: checks.length - ok - fail,
    preview,
    worktrees,
  }
}

async function refresh($: Api) {
  const before = await read($, pipeline)
  const now = await readPipeline($)
  await update($, pipeline, () => now)
  if (before && now && before.number === now.number && before.state === 'OPEN' && now.state === 'MERGED') {
    const left = now.worktrees > 0 ? `, ${now.worktrees} worktree(s) left to clean` : ''
    $.ui.toast(`#${now.number} merged${left}`)
  }
}

let busy = false

async function safeRefresh($: Api) {
  if (busy) return
  busy = true
  try {
    await refresh($)
  } finally {
    busy = false
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    await safeRefresh($)
    $.clock.every(POLL_MS, () => void safeRefresh($))
    return result
  })

  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    if (!e.agentId) await safeRefresh($)
    return result
  })

  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const result = await next(e)
    if (TOUCHES_PR.test(String(e.command ?? ''))) await safeRefresh($)
    return result
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const p = await read($, pipeline)
    if (e.props.hasSurvey || p === null) return next(e)

    const { Box, Text } = $.ui.resolve(e)
    const stateColor = p.state === 'MERGED' ? 'magenta' : p.state === 'CLOSED' ? 'red' : 'green'
    const total = p.ok + p.fail + p.pending
    const checksColor = p.fail > 0 ? 'red' : p.pending > 0 ? 'yellow' : 'green'
    const previewColor = { none: 'gray', building: 'yellow', ready: 'green', failed: 'red' }[p.preview]
    const narrow = (e.props.bodyColumns ?? 120) < 70

    return (
      <Box paddingX={1}>
        <Text color={stateColor} bold>#{p.number} {p.state.toLowerCase()}</Text>
        <Text color={checksColor}>  checks {p.ok}/{total}{p.fail > 0 ? ` ✗${p.fail}` : p.pending > 0 ? ' …' : ' ✓'}</Text>
        {p.preview !== 'none' && <Text color={previewColor}>  preview {p.preview}</Text>}
        {!narrow && p.state === 'MERGED' && p.worktrees > 0 && (
          <Text dimColor>  {p.worktrees} worktree(s) to clean</Text>
        )}
      </Box>
    )
  })
}
