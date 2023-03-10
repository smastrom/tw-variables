import { expect, test } from 'bun:test'
import { twVariables } from './dist/variables'
import pkgJson from './package.json'

const keys = Object.keys(twVariables)

test('No duplicated properties', () => {
   const keysSet = new Set(keys)

   expect(keys.length).toBe(keysSet.size)
})

test('No undefined or empty values', () => {
   for (const value of Object.values(twVariables)) {
      expect(typeof value).toBe('string')
      expect(value).not.toBe('undefined')
      expect(value).not.toBeFalsy()
   }
})

test("Any key starts with '--'", () => {
   for (const key of keys) {
      expect(key.startsWith('--')).toBe(true)
   }
})

test('Any key contains only hypens and letters', () => {
   const keys = Object.keys(twVariables)

   for (const key of keys) {
      expect(/^[a-z0-9\-]+$/.test(key)).toBe(true)
   }
})

const exports = Object.values(pkgJson.exports)

test('No dist in exports key', () => {
   for (const key of Object.keys(pkgJson.exports)) {
      expect(key.startsWith('./dist')).toBe(false)
   }
})

test('Exports import from dist', () => {
   for (const { import: _import, require } of exports) {
      expect(_import.startsWith('./dist')).toBe(true)
      expect(require.startsWith('./dist')).toBe(true)
   }
})

test('Exports exist', async () => {
   for await (const { import: _import, require } of exports) {
      const fileMjs = await Bun.file(_import)
      expect(fileMjs.size > 0).toBe(true)

      const fileCjs = await Bun.file(require)
      expect(fileCjs.size > 0).toBe(true)
   }
})

test('Exports have correct extensions', () => {
   for (const { import: _import, require } of exports) {
      expect(/\.css$|\.mjs$/.test(_import)).toBe(true)
      expect(/\.css$|\.js$/.test(require)).toBe(true)
   }
})
