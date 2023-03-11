[![](https://data.jsdelivr.com/v1/package/npm/tw-variables/badge)](https://www.jsdelivr.com/package/npm/tw-variables)

# Tailwind Variables

~400 useful CSS variables generated straight from Tailwind source files.

<br />

## Browser

All variables including colors:

```html
<link
   rel="stylesheet"
   href="https://cdn.jsdelivr.net/npm/tw-variables@0.9.0-3.2.7/dist/variables.css"
/>
```

One or more subsets:

```html
<link
   rel="stylesheet"
   href="https://cdn.jsdelivr.net/npm/tw-variables@0.9.0-3.2.7/dist/colors.css"
/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tw-variables@0.9.0-3.2.7/dist/size.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tw-variables@0.9.0-3.2.7/dist/sky.css" />
```

Preflight:

```html
<link
   rel="stylesheet"
   href="https://cdn.jsdelivr.net/npm/tw-variables@0.9.0-3.2.7/dist/preflight.css"
/>
```

Pick any import on jsDelivr: [Link](https://www.jsdelivr.com/package/npm/tw-variables?tab=files&path=dist)

<br />

## Installation

```bash
pnpm install -D tw-variables
```

<br />

## Import - CSS

All variables including colors:

```js
import 'tw-variables/variables.css'
```

One or more subsets:

```js
import 'tw-variables/colors.css'
import 'tw-variables/size.css'
import 'tw-variables/green.css'
```

Preflight:

```js
import 'tw-variables/preflight.css'
```

<br />

## Import - PostCSS

If using PostCSS, you can use this package in conjunction with [postcss-jit-props](https://github.com/GoogleChromeLabs/postcss-jit-props) to strip unused variables from the final CSS:

```bash
pnpm add -D postcss postcss-jit-props
```

### Nuxt 3

**nuxt.config.ts**

```ts
import { twVariables } from 'tw-variables'

export default defineNuxtConfig({
   build: {
      postcss: {
         plugins: {
            'postcss-jit-props': twVariables,
         },
      },
   },
})
```

### Any other framework

**postcss.config.cjs**

```js
const postcssJitProps = require('postcss-jit-props')
const twVariables = require('tw-variables')

module.exports = {
   plugins: [postcssJitProps(twVariables)],
}
```

<br />

## Usage

```css
.my-container {
   width: var(--width-full);
   max-width: var(--width-xl);
   z-index: var(--z-10);
   padding: var(--size-4);
   margin: var(--size-6);
   font-family: var(--family-sans);
   font-size: var(--text-base);
   font-weight: var(--font-medium);
   line-height: var(--leading-normal);
   letter-spacing: var(--tracking-tight);
   color: var(--blue-500);
   background-color: var(--slate-500);
   border: var(--border-2) solid var(--blue-500);
   border-radius: var(--radius-2xl);
   box-shadow: var(--shadow-lg);
}
```

<br />

## Subsets

| Name                       | Prefix                   | Import                            | Reference                                                       |
| -------------------------- | ------------------------ | --------------------------------- | --------------------------------------------------------------- |
| `blur`                     | `--blur-`                | `tw-variables/blur.css`           | [Link](https://tailwindcss.com/docs/blur)                       |
| `borderRadius`             | `--radius-`              | `tw-variables/border-radius.css`  | [Link](https://tailwindcss.com/docs/border-radius)              |
| `borderWidth`              | `--border-`              | `tw-variables/border-width.css`   | [Link](https://tailwindcss.com/docs/border-width)               |
| `boxShadow`                | `--shadow-`              | `tw-variables/box-shadow.css`     | [Link](https://tailwindcss.com/docs/box-shadow)                 |
| `colors`                   | `--blue-`, `--slate-`... | `tw-variables/colors.css`         | [Link](https://tailwindcss.com/docs/customizing-colors)         |
| `dropShadow`               | `--drop-`                | `tw-variables/drop-shadow.css`    | [Link](https://tailwindcss.com/docs/drop-shadow)                |
| `fontWeight`               | `--font-`                | `tw-variables/font-weight.css`    | [Link](https://tailwindcss.com/docs/font-weight)                |
| `fontFamily`               | `--family-`              | `tw-variables/font-family.css`    | [Link](https://tailwindcss.com/docs/font-family)                |
| `fontSize`                 | `--text-`                | `tw-variables/font-size.css`      | [Link](https://tailwindcss.com/docs/font-size)                  |
| `letterSpacing`            | `--tracking-`            | `tw-variables/letter-spacing.css` | [Link](https://tailwindcss.com/docs/letter-spacing)             |
| `lineHeight`               | `--leading-`             | `tw-variables/line-height.css`    | [Link](https://tailwindcss.com/docs/line-height)                |
| `opacity`                  | `--opacity-`             | `tw-variables/opacity.css`        | [Link](https://tailwindcss.com/docs/opacity)                    |
| `maxWidth`                 | `--width-`               | `tw-variables/width.css`          | [Link](https://tailwindcss.com/docs/max-width)                  |
| `screens`                  | `--screen-`              | `tw-variables/screen.css`         | [Link](https://tailwindcss.com/docs/theme#screens)              |
| `spacing`                  | `--size-`                | `tw-variables/size.css`           | [Link](https://tailwindcss.com/docs/padding)                    |
| `transitionTimingFunction` | `--easing-`              | `tw-variables/easing.css`         | [Link](https://tailwindcss.com/docs/transition-timing-function) |
| `zIndex`                   | `--z-`                   | `tw-variables/z-index.css`        | [Link](https://tailwindcss.com/docs/z-index)                    |

<br />

## Colors subsets

Colors reference: [Link](https://tailwindcss.com/docs/customizing-colors)

| Name      | Prefix       | Import                     |
| --------- | ------------ | -------------------------- |
| `amber`   | `--amber-`   | `tw-variables/amber.css`   |
| `blue`    | `--blue-`    | `tw-variables/blue.css`    |
| `cyan`    | `--cyan-`    | `tw-variables/cyan.css`    |
| `emerald` | `--emerald-` | `tw-variables/emerald.css` |
| `fuchsia` | `--fuchsia-` | `tw-variables/fuchsia.css` |
| `gray`    | `--gray-`    | `tw-variables/gray.css`    |
| `green`   | `--green-`   | `tw-variables/green.css`   |
| `indigo`  | `--indigo-`  | `tw-variables/indigo.css`  |
| `lime`    | `--lime-`    | `tw-variables/lime.css`    |
| `neutral` | `--neutral-` | `tw-variables/neutral.css` |
| `orange`  | `--orange-`  | `tw-variables/orange.css`  |
| `pink`    | `--pink-`    | `tw-variables/pink.css`    |
| `purple`  | `--purple-`  | `tw-variables/purple.css`  |
| `red`     | `--red-`     | `tw-variables/red.css`     |
| `rose`    | `--rose-`    | `tw-variables/rose.css`    |
| `slate`   | `--slate-`   | `tw-variables/slate.css`   |
| `sky`     | `--sky-`     | `tw-variables/sky.css`     |
| `teal`    | `--teal-`    | `tw-variables/teal.css`    |
| `violet`  | `--violet-`  | `tw-variables/violet.css`  |
| `yellow`  | `--yellow-`  | `tw-variables/yellow.css`  |
| `zinc`    | `--zinc-`    | `tw-variables/zinc.css`    |

<br />

## Check also

[Open Props](https://github.com/argyleink/open-props) by _Adam Argyle_

<br />

## License

MIT
