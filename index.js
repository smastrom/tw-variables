import { theme } from 'tailwindcss/stubs/defaultConfig.stub.js'
import twColors from 'tailwindcss/lib/public/colors.js'

const outVars = new Map()

const PROPS = [
   ['blur', 'blur'],
   ['borderRadius', 'radius'],
   ['borderWidth', 'border'],
   ['boxShadow', 'shadow'],
   ['dropShadow', 'drop-shadow'],
   ['fontWeight', 'font'],
   ['fontFamily', 'family'],
   ['fontSize', 'text'],
   ['letterSpacing', 'tracking'],
   ['lineHeight', 'leading'],
   ['opacity', 'opacity'],
   ['maxWidth', 'max-w'],
   ['screens', 'screen'],
   ['spacing', 'size'],
   ['transitionTimingFunction', 'easing'],
   ['zIndex', 'z'],
]

// Default Theme

for (const PROP of PROPS) {
   const [jsProp, twProp] = PROP
   const outTheme = []

   const propEntries = Object.entries(getThemeProp(theme[jsProp]))

   for (const [variant, value] of propEntries) {
      if (variant.toLowerCase() !== 'default') {
         outTheme.push({
            [`--${normalize(twProp)}-${normalize(variant)}`]: joinOrGetValue(value),
         })
      }
   }

   outVars.set(normalize(jsProp), outTheme)
}

// Colors

const outColors = []

const renameMap = new Map()
   .set('lightBlue', 'sky')
   .set('trueGray', 'neutral')
   .set('coolGray', 'gray')
   .set('blueGray', 'slate')
   .set('warmGray', 'stone')

for (const [colorName, colorValue] of Object.entries(twColors)) {
   if (isObj(colorValue)) {
      const colorObj = Object.entries(colorValue)

      if (isDeepArr(colorObj)) {
         for (const [numericVariant, variantValue] of colorObj) {
            outColors.push({
               [`--${renameColor(colorName)}-${numericVariant}`]: variantValue,
            })
         }
      }
   }
}

outVars.set('colors', outColors)

// Write JS / JSON

const outEntries = Array.from(outVars.entries())
const outArr = Array.from(outVars.values()).flat(1 / 0) // {'--name': 'value', '--name': 'value', ...}
const outObj = {}

for (const cssVar of outArr) {
   const [varName, varValue] = Object.entries(cssVar).flat(1 / 0)
   outObj[varName] = varValue
}

await Bun.write(`./dist/variables.js`, `export const twVariables = ${JSON.stringify(outObj)}`)
await Bun.write(`./dist/variables.json`, JSON.stringify(outObj))

// Write one CSS file with a single :root block

await Bun.write(`./dist/all.css`, getCSS(outArr))

// Write one CSS file with separate :root blocks

let _rootBlocks = ''

for (const [, cssVars] of outEntries) {
   _rootBlocks += getCSS(cssVars)
}

await Bun.write(`./dist/variables.css`, _rootBlocks)

// Write single files

for await (const [groupName, cssVars] of outEntries) {
   await Bun.write(`./dist/${groupName}.css`, getCSS(cssVars))
}

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

// Colors - Utils

function renameColor(colorName) {
   const newName = renameMap.get(colorName)

   if (newName) {
      return normalize(newName)
   }
   return normalize(colorName)
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
