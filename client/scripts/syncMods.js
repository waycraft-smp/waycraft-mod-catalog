import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const clientRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = path.resolve(clientRoot, '..', 'AutoMod', 'output', 'mods.json')
const destinationPath = path.join(clientRoot, 'src', 'data', 'mods.json')

try {
  const mods = JSON.parse(await readFile(sourcePath, 'utf8'))
  if (!Array.isArray(mods)) throw new Error('AutoMod output must be a JSON array.')
  await mkdir(path.dirname(destinationPath), { recursive: true })
  await writeFile(destinationPath, JSON.stringify(mods, null, 2) + '\n', 'utf8')
  console.log('Synced ' + mods.length + ' mods from AutoMod.')
} catch (error) {
  console.error('Could not sync AutoMod data: ' + error.message)
  process.exitCode = 1
}
