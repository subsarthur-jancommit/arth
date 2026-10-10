/**
 * Starts a browser MCP server from `.mcp.json`, adding the flags a Claude Code
 * cloud session needs and nothing anywhere else.
 *
 * Measured in a cloud session on 2026-10-09: both servers, started bare, look
 * for Google Chrome at /opt/google/chrome/chrome, which the container does not
 * have, and chrome-devtools-mcp also refuses to launch Chrome as root. The
 * container ships Playwright's Chromium at /opt/pw-browsers/chromium, has no
 * display, and runs as root — so in the cloud each server is pointed at that
 * Chromium, headless, unsandboxed, with an in-memory profile. With these flags
 * both navigated to the live site.
 *
 * Off the cloud (a laptop, the desktop app on a local checkout) the server is
 * started exactly as before, with no added flags.
 *
 * Usage: node tools/mcp/launch.mjs <playwright|chrome-devtools> [extra args]
 */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'

const CLOUD_CHROMIUM = '/opt/pw-browsers/chromium'

const SERVERS = {
  playwright: {
    pkg: '@playwright/mcp@latest',
    cloudArgs: [
      '--browser',
      'chromium',
      '--executable-path',
      CLOUD_CHROMIUM,
      '--headless',
      '--no-sandbox',
      '--isolated',
    ],
  },
  'chrome-devtools': {
    pkg: 'chrome-devtools-mcp@latest',
    cloudArgs: [
      '--executablePath',
      CLOUD_CHROMIUM,
      '--headless',
      '--isolated',
      '--chromeArg=--no-sandbox',
    ],
  },
}

const name = process.argv[2] ?? ''
const server = Object.hasOwn(SERVERS, name) ? SERVERS[name] : undefined

if (!server) {
  console.error(
    `tools/mcp/launch.mjs: unknown server "${name}" (expected ${Object.keys(SERVERS).join(' or ')})`
  )
  process.exit(1)
}

const inCloud =
  process.env.CLAUDE_CODE_REMOTE === 'true' && existsSync(CLOUD_CHROMIUM)

const child = spawn(
  'npx',
  [
    '-y',
    server.pkg,
    ...(inCloud ? server.cloudArgs : []),
    ...process.argv.slice(3),
  ],
  { stdio: 'inherit', shell: process.platform === 'win32' }
)

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal))
}

child.on('exit', (code, signal) => process.exit(code ?? (signal ? 1 : 0)))
