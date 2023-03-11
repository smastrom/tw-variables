import { test, expect } from 'bun:test'
import { twVariables as nextVersion } from './dist'

const { twVariables: currentVersion } = await import('./temp/latest.js')

test('All next version variables are present in current published version', () => {
   for (const key in currentVersion) {
      expect(nextVersion[key]).toBeDefined()
   }
})
