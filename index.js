import { theme } from 'tailwindcss/stubs/defaultConfig.stub.js'
import twColors from 'tailwindcss/lib/public/colors.js'

const outVars = new Map()

const PROPS = [
   ['blur', 'blur', 'blur'],
   ['borderRadius', 'radius', 'radius'],
   ['borderWidth', 'border', 'border'],
   ['boxShadow', 'shadow', 'shadow'],
   ['dropShadow', 'drop-shadow', 'drop-shadow'],
   ['fontWeight', 'font', 'font-weight'],
   ['fontFamily', 'family', 'font-family'],
   ['fontSize', 'text', 'font-size'],
   ['letterSpacing', 'tracking', 'letter-spacing'],
   ['lineHeight', 'leading', 'line-height'],
   ['opacity', 'opacity', 'opacity'],
   ['maxWidth', 'width', 'widths'],
   ['screens', 'screen', 'screens'],
   ['spacing', 'size', 'sizes'],
   ['transitionTimingFunction', 'easing', 'easings'],
   ['zIndex', 'z', 'z-index'],
]

// Default Theme

for (const PROP of PROPS) {
   const [srcProp, cssPrefix, fileName] = PROP
   const outTheme = []

   const propEntries = Object.entries(getThemeProp(theme[srcProp]))

   for (const [variant, value] of propEntries) {
      if (variant.toLowerCase() !== 'default') {
         outTheme.push({
            [`--${cssPrefix}-${normalize(variant)}`]: joinOrGetValue(value),
         })
      }
   }

   outVars.set(fileName, outTheme)
}

// Colors

const outColors = []
const deprecatedColors = ['lightBlue', 'trueGray', 'coolGray', 'blueGray', 'warmGray']

const colorEntries = Object.entries(twColors).filter(
   ([colorName]) => !deprecatedColors.includes(colorName)
)

for (const [colorName, colorValue] of colorEntries) {
   if (isObj(colorValue)) {
      // { amber: { 50: value, 100: value, ... }}
      const colorObj = Object.entries(colorValue)

      if (isDeepArr(colorObj)) {
         for (const [numericVariant, variantValue] of colorObj) {
            outColors.push({
               [`--${normalize(colorName)}-${numericVariant}`]: variantValue,
            })
         }
      }
   }
}

outVars.set('colors', outColors)

// Write JS / D.TS

const outEntries = Array.from(outVars.entries()) // [['fileName', [{ '--name', value} ... ]]]
const outArr = Array.from(outVars.values()).flat(1 / 0) // [{ '--name': value, ... }]
const outObj = {}

let outType = ''

for (const cssVar of outArr) {
   const [varName, varValue] = Object.entries(cssVar).flat(1 / 0)
   outObj[varName] = varValue
   outType = outType + `'${varName}': string,`
}

await Bun.write('./dist/variables.mjs', `export const twVariables = ${JSON.stringify(outObj)}`)
await Bun.write('./dist/variables.js', `module.exports = ${JSON.stringify(outObj)}`)
await Bun.write('./dist/variables.json', JSON.stringify(outObj))

const types = `export declare const twVariables: TwVariables; export type TwVariables = { ${outType} }`
await Bun.write('./dist/variables.d.ts', types)

// Write one CSS file with separate :root blocks

let _rootBlocks = ''

for (const [, cssVars] of outEntries) {
   _rootBlocks += getCSS(cssVars)
}

await Bun.write('./dist/variables.css', _rootBlocks)

// Write single CSS files

for await (const [fileName, cssVars] of outEntries) {
   await Bun.write(`./dist/${fileName}.css`, getCSS(cssVars))
}

// Write PKG JSON

const pkgJson = await Bun.file('./package.json')
const pkgText = await pkgJson.text()
const pkgObj = JSON.parse(pkgText)

await Bun.write('./package-bk.json', pkgText)

pkgObj.version = ''
pkgObj.version = require('tailwindcss/package.json').version

pkgObj.exports = {}
pkgObj.exports['.'] = { import: './dist/variables.mjs', require: './dist/variables.js' }
pkgObj.exports['./variables.css'] = {
   import: './dist/variables.css',
   require: './dist/variables.css',
}

for (const [fileName] of outEntries) {
   const path = `./dist/${fileName}.css`
   pkgObj.exports[`./${fileName}.css`] = { import: path, require: path }
}

await Bun.write('./package.json', JSON.stringify(pkgObj, undefined, 2))

// Utils - Write

function getCSS(cssVars) {
   const open = ':root {'
   let _cssVars = ''
   const close = '}'

   for (const _cssVar of cssVars) {
      const [varName, varValue] = Object.entries(_cssVar).flat(1 / 0)
      _cssVars += `${varName}: ${varValue};`
   }

   return open + _cssVars + close
}

// Utils - Default Theme

function getThemeProp(prop) {
   if (typeof prop === 'function') {
      return prop({
         theme: () => {},
         breakpoints: () => {},
      })
   }
   if (isObj(prop)) {
      return prop
   }
   return {}
}

function joinOrGetValue(values) {
   if (Array.isArray(values)) {
      let joined = ''
      for (const value of values) {
         if (isString(value)) {
            joined += value + ','
         }
      }
      return joined
   }
   if (isString(values)) {
      return values
   }
   return ''
}

// Misc

function normalize(value) {
   return camelToKebab(value).toLowerCase().replaceAll('.', '')
}

function camelToKebab(string) {
   return string.replace(/[A-Z]/g, (match) => '-' + match)
}

function isDeepArr(array) {
   return Array.isArray(array) && array.every((item) => Array.isArray(item))
}

function isString(value) {
   return typeof value === 'string'
}

function isObj(value) {
   return typeof value === 'object' && value !== null
}
