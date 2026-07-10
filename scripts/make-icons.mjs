// Generates placeholder PWA icons (solid ink background, amber cross) as PNGs
// using only Node built-ins, so there is no image-tooling dependency.
// Run: node scripts/make-icons.mjs
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons')
mkdirSync(OUT, { recursive: true })

const BG = [0x0b, 0x12, 0x20] // ink
const FG = [0xfb, 0xbf, 0x24] // amber

function crc32(buf) {
  let c, crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    c = (crc ^ buf[i]) & 0xff
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    crc = (crc >>> 8) ^ c
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const t = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])))
  return Buffer.concat([len, t, data, crc])
}

function png(size, crossScale) {
  // cross arms: width = size*0.22, length = size*crossScale, centered
  const arm = Math.round(size * 0.22)
  const span = Math.round(size * crossScale)
  const c = size / 2
  const inCross = (x, y) =>
    (Math.abs(x - c) < arm / 2 && Math.abs(y - c) < span / 2) ||
    (Math.abs(y - c) < arm / 2 && Math.abs(x - c) < span / 2)

  const raw = Buffer.alloc(size * (1 + size * 3))
  for (let y = 0; y < size; y++) {
    const row = y * (1 + size * 3)
    raw[row] = 0 // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b] = inCross(x, y) ? FG : BG
      const p = row + 1 + x * 3
      raw[p] = r; raw[p + 1] = g; raw[p + 2] = b
    }
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 2  // color type: truecolor
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

writeFileSync(join(OUT, 'icon-192.png'), png(192, 0.62))
writeFileSync(join(OUT, 'icon-512.png'), png(512, 0.62))
// maskable: keep the mark inside the 80% safe zone
writeFileSync(join(OUT, 'icon-512-maskable.png'), png(512, 0.5))
console.log('icons written to', OUT)
