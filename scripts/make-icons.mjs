// Regenerates the PWA PNGs from the master SVG (public/icons/icon.svg) using
// macOS QuickLook (qlmanage) — no image-tooling npm dependency.
// Run: node scripts/make-icons.mjs   (macOS only)
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ICONS = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons')
const tmp = mkdtempSync(join(tmpdir(), 'prephub-icons-'))
const master = join(ICONS, 'icon.svg')

const ql = (svg, size) => {
  execFileSync('qlmanage', ['-t', '-s', String(size), '-o', tmp, svg], { stdio: 'ignore' })
  return join(tmp, `${svg.split('/').pop()}.png`)
}

copyFileSync(ql(master, 512), join(ICONS, 'icon-512.png'))
copyFileSync(ql(master, 192), join(ICONS, 'icon-192.png'))

// maskable: shrink the mark into the 80% safe zone
const maskSvg = join(tmp, 'icon-mask.svg')
writeFileSync(maskSvg, readFileSync(master, 'utf8').replace('scale(.78)', 'scale(.58)'))
copyFileSync(ql(maskSvg, 512), join(ICONS, 'icon-512-maskable.png'))

console.log('icons regenerated in', ICONS)
