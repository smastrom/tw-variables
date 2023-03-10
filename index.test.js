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

// CSS Files

test('Besides font-family and preflight, any CSS property should not contain quotes or undefined', async () => {
   const cssImports = exports.filter(
      ({ import: _import }) =>
         _import.endsWith('.css') &&
         !_import.includes('font-family') &&
         !_import.includes('variables') &&
         !_import.includes('preflight')
   )

   for await (const cssImport of cssImports) {
      const cssFile = await Bun.file(cssImport.import)
      const cssText = await cssFile.text()

      expect(cssText).not.toContain('"')
      expect(cssText).not.toContain("'")
      expect(cssText).not.toContain('undefined')
   }
})

// PKG JSON

const exports = Object.values(pkgJson.exports)

test('No dist in exports key', () => {
   for (const key of Object.keys(pkgJson.exports)) {
      expect(key.startsWith('./dist')).toBe(false)
   }
})

test('All exports import from dist', () => {
   for (const { import: _import, require: _require } of exports) {
      expect(_import.startsWith('./dist')).toBe(true)
      expect(_require.startsWith('./dist')).toBe(true)
   }
})

test('All exports exist', async () => {
   for await (const { import: _import, require: _require } of exports) {
      const fileMjs = await Bun.file(_import)
      expect(fileMjs.size > 0).toBe(true)

      const fileCjs = await Bun.file(_require)
      expect(fileCjs.size > 0).toBe(true)
   }
})

test('All exports have correct extensions', () => {
   for (const { import: _import, require: _require } of exports) {
      expect(/\.css$|\.mjs$/.test(_import)).toBe(true)
      expect(/\.css$|\.js$/.test(_require)).toBe(true)
   }
})
