import { describe, expect, test } from 'claude-code/testing'

describe('land-guard', () => {
  test('commands that are not merge or cleanup pass untouched', async ($, on) => {
    on('tool.call', () => ({ result: { stdout: '', stderr: '' }, text: 'ok' }) as any)
    on('session.start', ($, e) => ({ cwd: e.cwd }))
    await $.session.start({ surface: 'terminal', isInteractive: true, cwd: '/work' } as any)
    const ran = await $.tool.call({ tool: 'Bash', tool_use_id: 't1', command: 'git status --short' } as any)
    expect((ran as any).deny).toBeUndefined()
  })
})
