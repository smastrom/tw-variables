import { theme } from 'tailwindcss/stubs/defaultConfig.stub.js'
import twColors from 'tailwindcss/lib/public/colors.js'

const varsMap = new Map()

const configProps = [
   ['blur', 'blur', 'blur'],
   ['borderRadius', 'radius', 'border-radius'],
   ['borderWidth', 'border', 'border-width'],
   ['boxShadow', 'shadow', 'shadow'],
   ['dropShadow', 'drop-shadow', 'drop-shadow'],
   ['fontWeight', 'font', 'font-weight'],
   ['fontFamily', 'family', 'font-family'],
   ['fontSize', 'text', 'font-size'],
   ['letterSpacing', 'tracking', 'letter-spacing'],
   ['lineHeight', 'leading', 'line-height'],
   ['opacity', 'opacity', 'opacity'],
   ['maxWidth', 'width', 'width'],
   ['screens', 'screen', 'screen'],
   ['spacing', 'size', 'size'],
   ['transitionTimingFunction', 'easing', 'easing'],
   ['zIndex', 'z', 'z-index'],
]

// Default Config

for (const prop of configProps) {
   const [srcProp, cssPrefix, fileName] = prop

   const currEntries = Object.entries(getThemeProp(theme[srcProp]))
   const currVars = []

   for (const [variant, value] of currEntries) {
      if (variant.toLowerCase() !== 'default') {
         currVars.push({
            [`--${cssPrefix}-${normalize(variant)}`]: joinOrGetValue(value),
         })
      }
   }

   varsMap.set(fileName, currVars)
}

// Colors

const allColors = []
const deprecatedColors = ['lightBlue', 'trueGray', 'coolGray', 'blueGray', 'warmGray']

const colorEntries = Object.entries(twColors).filter(
   ([colorName]) => !deprecatedColors.includes(colorName)
)

for (const [_colorName, variantColors] of colorEntries) {
   const currColors = []

   if (isObj(variantColors)) {
      // { amber: { 50: value, 100: value, ... }}
      const colorName = normalize(_colorName) // Used as file name as well
      const currVariants = Object.entries(variantColors)

      if (isDeepArr(currVariants)) {
         for (const [numericVariant, value] of currVariants) {
            const _var = {
               [`--${colorName}-${numericVariant}`]: value,
            }

            currColors.push(_var)
            allColors.push(_var)
         }

         varsMap.set(colorName, currColors)
      }
   }
}

// Write JS

const outEntries = Array.from(varsMap.entries()) // [['fileName', [{ '--name', value }, ... ]]]
const allVarsArr = Array.from(varsMap.values()).flat(1 / 0) // [{ '--name': value }, ... ]
const outObj = {}

let outDts = ''

for (const cssVar of allVarsArr) {
   const [varName, varValue] = Object.entries(cssVar).flat(1 / 0)
   outObj[varName] = varValue
   outDts = outDts + `'${varName}': string,`
}

const outJson = JSON.stringify(outObj)

await Bun.write('./dist/index.mjs', `export const twVariables = ${outJson}`)
await Bun.write('./dist/index.js', `module.exports = ${outJson}`)
await Bun.write('./dist/variables.json', outJson)

// Write d.ts

const types = `export declare const twVariables: TwVariables; export type TwVariables = { ${outDts} }`
await Bun.write('./dist/index.d.ts', types)

// Write all vars in a single CSS file in different root blocks:

let rootBlocks = ''

for (const [, cssVars] of outEntries) {
   rootBlocks += getCSS(cssVars)
}

await Bun.write('./dist/variables.css', rootBlocks)

// Write all colors in a single CSS file

await Bun.write('./dist/colors.css', getCSS(allColors))

// Write separated CSS files

for await (const [fileName, cssVars] of outEntries) {
   await Bun.write(`./dist/${fileName}.css`, getCSS(cssVars))
}

// Write preflight CSS file

const pfText = await Bun.file('node_modules/tailwindcss/src/css/preflight.css').text()
await Bun.write('./dist/preflight.css', cleanPreflight(pfText))

// Package.json

const pkgText = await Bun.file('./package.json').text()
await Bun.write('./package-bk.json', pkgText)

const pkgObj = JSON.parse(pkgText)

// --- JS

pkgObj.exports = {}
pkgObj.exports['.'] = { import: './dist/index.mjs', require: './dist/index.js' }

// --- Unified CSS files

pkgObj.exports['./preflight.css'] = {
   import: './dist/preflight.css',
   require: './dist/preflight.css',
}

pkgObj.exports['./variables.css'] = {
   import: './dist/variables.css',
   require: './dist/variables.css',
}

pkgObj.exports['./colors.css'] = {
   import: './dist/colors.css',
   require: './dist/colors.css',
}

// --- Separated CSS files

for (const [fileName] of outEntries) {
   const path = `./dist/${fileName}.css`
   pkgObj.exports[`./${fileName}.css`] = { import: path, require: path }
}

await Bun.write('./package.json', JSON.stringify(pkgObj, undefined, 2))

// Value getters

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
      return joined.slice(0, -1)
   }
   if (isString(values)) {
      return values
   }
   return ''
}

// Write Utils

function getCSS(cssVars) {
   const open = ':root {'
   let strVars = ''
   const close = '}'

   for (const cssVar of cssVars) {
      const [varName, varValue] = Object.entries(cssVar).flat(1 / 0)
      strVars += `${varName}: ${varValue};`
   }

   return open + strVars + close
}

function cleanPreflight(cssText) {
   return cssText
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\b(?:\w+-)*theme\s*\(\s*(?:(?!\)).)*\)/g, '') // Remove properties with theme() fns
      .replace('--tw-content', 'content') // Replace tw-content
      .replace(/[\s\n]+/g, '') // Minify
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
