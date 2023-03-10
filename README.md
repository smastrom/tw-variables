# Tailwind Variables

~400 useful CSS variables generated straight from Tailwind source files.

<br />

## Installation

### With a build step

```bash
pnpm install -D tw-variables
```

### In the browser

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tw-variables/variables.css" />
```

<br />

## Import - CSS

Import all variables:

```js
import 'tw-variables/variables.css'
```

Import one or more subsets:

```js
import 'tw-variables/colors.css'
import 'tw-variables/size.css'
```

<br />

## Import - PostCSS

You can use this package in conjunction with [postcss-jit-props](https://github.com/GoogleChromeLabs/postcss-jit-props) to strip unused variables from the final CSS:

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

### Anything besides Nuxt 3

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

| Tailwind Source            | Prefix                   | Import                            | Reference                                                       |
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

## Check also

[Open Props](https://github.com/argyleink/open-props) by _Adam Argyle_

<br />

## License

MIT
