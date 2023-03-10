import { theme } from 'tailwindcss/stubs/defaultConfig.stub.js'
import twColors from 'tailwindcss/lib/public/colors.js'

const outVars = new Map()

const PROPS = [
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

// Default Theme

for (const PROP of PROPS) {
   const [srcProp, cssPrefix, fileName] = PROP
   const currProps = []

   const currEntries = Object.entries(getThemeProp(theme[srcProp]))

   for (const [variant, value] of currEntries) {
      if (variant.toLowerCase() !== 'default') {
         currProps.push({
            [`--${cssPrefix}-${normalize(variant)}`]: joinOrGetValue(value),
         })
      }
   }

   outVars.set(fileName, currProps)
}

// Colors

const allColors = []
const deprecatedColors = ['lightBlue', 'trueGray', 'coolGray', 'blueGray', 'warmGray']

const colorEntries = Object.entries(twColors).filter(
   ([colorName]) => !deprecatedColors.includes(colorName)
)

for (const [colorName, colorValue] of colorEntries) {
   const currColors = []

   if (isObj(colorValue)) {
      // { amber: { 50: value, 100: value, ... }}
      const currName = normalize(colorName) // Used as file name as well
      const currObj = Object.entries(colorValue)

      if (isDeepArr(currObj)) {
         for (const [numericVariant, variantValue] of currObj) {
            const _var = {
               [`--${currName}-${numericVariant}`]: variantValue,
            }

            currColors.push(_var)
            allColors.push(_var)
         }

         outVars.set(currName, currColors)
      }
   }
}

// Write JS / D.TS

const outEntries = Array.from(outVars.entries()) // [['fileName', [{ '--name', value }, ... ]]]
const outArr = Array.from(outVars.values()).flat(1 / 0) // [{ '--name': value }, ... ]
const outObj = {}

let outDts = ''

for (const cssVar of outArr) {
   const [varName, varValue] = Object.entries(cssVar).flat(1 / 0)
   outObj[varName] = varValue
   outDts = outDts + `'${varName}': string,`
}

const outJson = JSON.stringify(outObj)

await Bun.write('./dist/index.mjs', `export const twVariables = ${outJson}`)
await Bun.write('./dist/index.js', `module.exports = ${outJson}`)
await Bun.write('./dist/variables.json', outJson)

const types = `export declare const twVariables: TwVariables; export type TwVariables = { ${outDts} }`
await Bun.write('./dist/index.d.ts', types)

// Write all variables in one file in different root blocks:

let rootBlocks = ''

for (const [, cssVars] of outEntries) {
   rootBlocks += getCSS(cssVars)
}

await Bun.write('./dist/variables.css', rootBlocks)

// Write all colors in one file:

await Bun.write('./dist/colors.css', getCSS(allColors))

// Write single CSS files

for await (const [fileName, cssVars] of outEntries) {
   await Bun.write(`./dist/${fileName}.css`, getCSS(cssVars))
}

// PKG JSON

const pkgJson = await Bun.file('./package.json')
const pkgText = await pkgJson.text()
const pkgObj = JSON.parse(pkgText)

await Bun.write('./package-bk.json', pkgText)

// - JS

pkgObj.exports = {}
pkgObj.exports['.'] = { import: './dist/index.mjs', require: './dist/index.js' }

// - Unified CSS files

pkgObj.exports['./variables.css'] = {
   import: './dist/variables.css',
   require: './dist/variables.css',
}

pkgObj.exports['./colors.css'] = {
   import: './dist/colors.css',
   require: './dist/colors.css',
}

// - Single CSS files

for (const [fileName] of outEntries) {
   const path = `./dist/${fileName}.css`
   pkgObj.exports[`./${fileName}.css`] = { import: path, require: path }
}

await Bun.write('./package.json', JSON.stringify(pkgObj, undefined, 2))

// Utils - Write

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
