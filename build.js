import { theme } from 'tailwindcss/stubs/defaultConfig.stub.js'
import twColors from 'tailwindcss/lib/public/colors.js'

const varsMap = new Map()

const configProps = [
   ['blur', 'blur', 'blur'],
   ['borderRadius', 'radius', 'border-radius'],
   ['borderWidth', 'border', 'border-width'],
   ['boxShadow', 'shadow', 'box-shadow'],
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

   for (const [variant, _value] of currEntries) {
      if (variant.toLowerCase() !== 'default') {
         const value = joinOrGetValue(_value)

         if (value) {
            currVars.push({
               [`--${cssPrefix}-${normalize(variant)}`]: value,
            })
         }
      }
   }

   varsMap.set(fileName, currVars)
}

// Colors

const allColors = []
const noColors = ['inherit', 'transparent', 'current', 'black', 'white']
const deprecatedColors = ['lightBlue', 'trueGray', 'coolGray', 'blueGray', 'warmGray']

const colorEntries = Object.entries(twColors).filter(
   ([colorName]) => ![...deprecatedColors, ...noColors].includes(colorName)
)

for (const [_colorName, variantColors] of colorEntries) {
   const currColors = []

   const colorName = normalize(_colorName) // Used also as file name
   const currVariants = Object.entries(variantColors)

   if (isColorArr(currVariants)) {
      for (const [numericVariant, value] of currVariants) {
         const cssVar = {
            [`--${colorName}-${numericVariant}`]: value,
         }

         currColors.push(cssVar)
         allColors.push(cssVar)
      }

      varsMap.set(colorName, currColors)
   }
}

// Write JS / JSON

const outEntries = Array.from(varsMap.entries()) // [['fileName', [{ '--name', value }, ... ]]]
const allVarsArr = flatDeep(Array.from(varsMap.values())) // [{ '--name': value }, ... ]
const outObj = {}

let outDts = ''

for (const cssVar of allVarsArr) {
   const [varName, varValue] = flatDeep(Object.entries(cssVar))
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

// Write all vars in a single CSS file in different root blocks

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

const pfText = await Bun.file('preflight.css').text()
await Bun.write('./dist/preflight.css', pfText.replace(/[\s\n]+/g, '')) /* Minify */

// Package.json

const pkgText = await Bun.file('./package.json').text()
await Bun.write('./package-bk.json', pkgText)

const pkgObj = JSON.parse(pkgText)

pkgObj.exports = {}

// --- JS / JSON

pkgObj.exports['.'] = { import: './dist/index.mjs', require: './dist/index.js' }

pkgObj.exports['./variables.json'] = './dist/variables.json'

// --- Unified CSS files

pkgObj.exports['./preflight.css'] = './dist/preflight.css'
pkgObj.exports['./variables.css'] = './dist/variables.css'
pkgObj.exports['./colors.css'] = './dist/colors.css'

// --- Separated CSS files

for (const [fileName] of outEntries) {
   pkgObj.exports[`./${fileName}.css`] = `./dist/${fileName}.css`
}

await Bun.write('./package.json', JSON.stringify(pkgObj, undefined, 3))

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
   let strVars = ''

   for (const cssVar of cssVars) {
      const [varName, varValue] = flatDeep(Object.entries(cssVar))
      strVars += `${varName}: ${varValue};`
   }

   return `:root { ${strVars} }`
}

// Misc

function normalize(value) {
   return camelToKebab(value).toLowerCase().replaceAll('.', '')
}

function camelToKebab(string) {
   return string.replace(/[A-Z]/g, (match) => '-' + match)
}

function isColorArr(array) {
   return Array.isArray(array) && array.every((item) => Array.isArray(item) && item.every(isString))
}

function isString(value) {
   return typeof value === 'string'
}

function isObj(value) {
   return typeof value === 'object' && value != null && !Array.isArray(value)
}

function flatDeep(array) {
   return array.flat(1 / 0)
}
