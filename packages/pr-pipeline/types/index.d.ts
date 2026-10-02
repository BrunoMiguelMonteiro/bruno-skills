export type Pipeline = {
  branch: string
  number: number
  title: string
  state: 'OPEN' | 'MERGED' | 'CLOSED'
  ok: number
  fail: number
  pending: number
  preview: 'none' | 'building' | 'ready' | 'failed'
  worktrees: number
}

declare module 'claude-code' {
  interface PluginState {
    'pr-pipeline': { pipeline: Pipeline | null }
  }
}
