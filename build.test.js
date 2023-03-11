import { expect, test } from 'bun:test'
import { twVariables } from './dist'
import pkgJson from './package.json'

// JS

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
   for (const key of keys) {
      expect(/^[a-z0-9\-]+$/.test(key)).toBe(true)
   }
})

// CSS

test('Besides font-family and preflight, any CSS property should not contain quotes', async () => {
   const cssExports = Object.entries(pkgJson.exports).filter(
      ([exportKey]) =>
         exportKey.endsWith('.css') &&
         !exportKey.includes('font-family') &&
         !exportKey.includes('variables') &&
         !exportKey.includes('preflight')
   )

   for await (const [, exportPath] of cssExports) {
      const cssFile = Bun.file(exportPath)
      const cssText = await cssFile.text()

      expect(cssText).not.toContain('"')
      expect(cssText).not.toContain("'")
      expect(cssText).not.toContain('undefined')
   }
})

const exports = Object.values(pkgJson.exports)

// Exports

test('No dist in exports key', () => {
   for (const key in pkgJson.exports) {
      expect(key.startsWith('./dist')).toBe(false)
   }
})

test('All exports import from dist', () => {
   for (const _export of exports) {
      if (typeof _export === 'string') {
         expect(_export.startsWith('./dist')).toBe(true)
      } else {
         expect(_export.import.startsWith('./dist')).toBe(true)
         expect(_export.require.startsWith('./dist')).toBe(true)
      }
   }
})

test('All exports have correct extensions', () => {
   for (const _export of exports) {
      if (typeof _export === 'string') {
         expect(/\.css$|\.json$/.test(_export)).toBe(true)
      } else {
         expect(/\.mjs$/.test(_export.import)).toBe(true)
         expect(/\.js$/.test(_export.require)).toBe(true)
      }
   }
})

test('All exports exist', () => {
   for (const _export of exports) {
      if (typeof _export === 'string') {
         const file = Bun.file(_export)
         expect(file.size > 0).toBe(true)
      } else {
         const fileMjs = Bun.file(_export.import)
         expect(fileMjs.size > 0).toBe(true)

         const fileCjs = Bun.file(_export.require)
         expect(fileCjs.size > 0).toBe(true)
      }
   }
})
