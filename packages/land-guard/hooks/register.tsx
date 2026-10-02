import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Finding, Held } from '../types'

const PANE = 'land-guard'
const held = atom({ plugin: 'land-guard', key: 'held' } as const, null)

type Api = EngineInterface

// Commands that merge a PR or delete a branch or worktree.
const RISKY =
  /\bgh\s+pr\s+merge\b|\bgit\s+worktree\s+remove\b|\bgit\s+branch\s+-D\b|\bgit\s+push\b[^;&|]*(--delete|\s:\S)/

const COLOR = { ok: 'green', warn: 'yellow', bad: 'red' } as const
const MARK = { ok: '✓', warn: '!', bad: '✗' } as const

async function sh($: Api, argv: string[], cwd: string) {
  try {
    return await $.process.run(argv, { cwd })
  } catch {
    return null
  }
}

// `cd /some/path && ...` at the start of a command moves where the rest runs.
function baseDir(command: string, cwd: string) {
  const m = command.match(/^\s*cd\s+("([^"]+)"|'([^']+)'|(\S+))\s*(&&|;)/)
  const dir = m?.[2] ?? m?.[3] ?? m?.[4]
  return dir && dir.startsWith('/') ? dir : cwd
}

async function measure($: Api, command: string, cwd: string): Promise<Finding[]> {
  const out: Finding[] = []
  const dir = baseDir(command, cwd)

  const pr = command.match(/gh\s+pr\s+merge\s+(\d+)/)
  if (pr) {
    const r = await sh(
      $,
      ['gh', 'pr', 'view', pr[1], '--json', 'title,state,mergeable,statusCheckRollup'],
      dir,
    )
    if (!r || r.exitCode !== 0) {
      out.push({ label: `PR #${pr[1]}`, detail: 'could not read it with gh', level: 'warn' })
    } else {
      const j = JSON.parse(r.stdout)
      const checks = (j.statusCheckRollup ?? []) as Array<Record<string, string>>
      const state = (c: Record<string, string>) => c.conclusion || c.state || c.status || ''
      const fail = checks.filter(c => /FAIL|ERROR|CANCEL|TIMED/i.test(state(c))).length
      const ok = checks.filter(c => /SUCCESS|NEUTRAL|SKIPPED/i.test(state(c))).length
      const pending = checks.length - fail - ok
      const bad = j.state !== 'OPEN' || j.mergeable === 'CONFLICTING' || fail > 0
      const warn = pending > 0 || j.mergeable === 'UNKNOWN'
      out.push({
        label: `PR #${pr[1]} ${j.title}`,
        detail: `${j.state.toLowerCase()}, ${j.mergeable.toLowerCase()}, checks ${ok}✓ ${fail}✗ ${pending}…`,
        level: bad ? 'bad' : warn ? 'warn' : 'ok',
      })
    }
  }

  for (const m of command.matchAll(/git\s+worktree\s+remove((?:\s+(?:--force|-f))*)\s+("[^"]+"|'[^']+'|[^\s;&|]+)/g)) {
    const path = m[2].replace(/^["']|["']$/g, '')
    const files = await sh($, ['git', '-C', path, 'status', '--short'], dir)
    const ahead = await sh($, ['git', '-C', path, 'rev-list', '--count', '@{u}..HEAD'], dir)
    const n = files && files.exitCode === 0 ? files.stdout.split('\n').filter(Boolean).length : -1
    const a = ahead && ahead.exitCode === 0 ? Number(ahead.stdout.trim()) : -1
    const forced = m[1].trim() !== ''
    out.push({
      label: `worktree ${path}${forced ? ' (--force)' : ''}`,
      detail:
        n < 0
          ? 'could not read it'
          : `${n} uncommitted file(s), ${a < 0 ? 'no upstream' : `${a} unpushed commit(s)`}`,
      level: n > 0 || a > 0 ? 'bad' : n < 0 || forced ? 'warn' : 'ok',
    })
  }

  for (const m of command.matchAll(/git\s+branch\s+-D\s+([^;&|]+)/g)) {
    for (const b of m[1].trim().split(/\s+/).filter(x => !x.startsWith('-'))) {
      const merged = await sh($, ['gh', 'pr', 'list', '--head', b, '--state', 'merged', '--json', 'number', '--limit', '1'], dir)
      const hit = merged?.exitCode === 0 ? (JSON.parse(merged.stdout) as unknown[]) : []
      if (hit.length > 0) {
        out.push({ label: `branch ${b}`, detail: 'its PR is merged', level: 'ok' })
        continue
      }
      const ahead = await sh($, ['git', 'rev-list', '--count', `${b}@{u}..${b}`], dir)
      const a = ahead?.exitCode === 0 ? Number(ahead.stdout.trim()) : -1
      out.push({
        label: `branch ${b}`,
        detail: a > 0 ? `${a} unpushed commit(s), no merged PR` : a === 0 ? 'pushed, but no merged PR found' : 'no upstream and no merged PR found',
        level: a > 0 ? 'bad' : 'warn',
      })
    }
  }

  for (const m of command.matchAll(/git\s+push\s+\S+\s+(?:--delete\s+(\S+)|:(\S+))/g)) {
    out.push({ label: `remote branch ${m[1] ?? m[2]}`, detail: 'will be deleted on origin', level: 'warn' })
  }
  return out
}

function summary(findings: Finding[]) {
  return findings.map(f => `${MARK[f.level]} ${f.label}: ${f.detail}`).join('; ')
}

function view($: Api, e: Parameters<Api['ui']['resolve']>[0], h: Held) {
  const { Box, Text, Button } = $.ui.resolve(e)
  return (
    <Box flexDirection="column" paddingX={1}>
      <Text bold>Land Guard holds: {h.command.replace(/\s+/g, ' ').slice(0, 100)}</Text>
      {h.findings.map(f => (
        <Text color={COLOR[f.level]}>
          {MARK[f.level]} {f.label}: {f.detail}
        </Text>
      ))}
      <Box>
        <Button
          key="go"
          label="Proceed"
          hotkey="1"
          onPress={() => update($, held, x => (x ? { ...x, decision: 'proceed' } : x))}
        />
        <Button
          key="no"
          label="Cancel"
          hotkey="2"
          onPress={() => update($, held, x => (x ? { ...x, decision: 'cancel' } : x))}
        />
      </Box>
    </Box>
  )
}

export const register: Register = on => {
  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    const command = String(e.command ?? '')
    if (!RISKY.test(command)) return next(e)

    const findings = await measure($, command, await $.session.cwd())
    // Everything green: let it through, as /land does.
    if (findings.every(f => f.level === 'ok')) {
      $.ui.toast(`land-guard: ok. ${summary(findings)}`.slice(0, 160))
      return next(e)
    }

    await update($, held, () => ({ command, findings, decision: null }) as Held)
    const opened = await $.ui.open({ id: PANE, title: 'Land Guard', focus: true })
    void opened

    // Waiting inside a `$` call does not use the hook's own time budget.
    let canWait = true
    while ((await read($, held))?.decision === null && !next.signal.aborted) {
      const r = await sh($, ['sleep', '0.25'], await $.session.cwd())
      if (r === null) {
        canWait = false
        break
      }
    }
    const decision = (await read($, held))?.decision ?? null
    await update($, held, () => null)
    await $.ui.close({ id: PANE })

    if (decision === 'proceed') return next(e)
    if (!canWait) {
      return {
        deny: `Land Guard could not wait for a keypress here. Findings: ${summary(findings)}. Show them to the user and ask in chat before retrying.`,
      }
    }
    return { deny: `Land Guard held this command and the user pressed Cancel. Findings: ${summary(findings)}.` }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e, next) => {
    const h = await read($, held)
    return h ? view($, e, h) : next(e)
  })

  // Too narrow for a pane: draw the same report above the prompt.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const h = await read($, held)
    return h && !e.props.hasSurvey ? view($, e, h) : next(e)
  })
}
