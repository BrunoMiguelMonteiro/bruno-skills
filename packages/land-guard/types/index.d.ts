export type Finding = { label: string; detail: string; level: 'ok' | 'warn' | 'bad' }
export type Held = {
  command: string
  findings: Finding[]
  decision: 'proceed' | 'cancel' | null
}

declare module 'claude-code' {
  interface PluginState {
    'land-guard': { held: Held | null }
  }
}
