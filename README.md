# Tailwind Variables

Uses Tailwind source files to generates 410 useful CSS variables.

<br />

## Installation

### With a build step

Install this package in your _dev_ dependencies:

```bash
pnpm install -D tw-variables
```

### In the browser

Or import the CSS directly from the CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tw-variables/variables.css" />
```

<br />

## Usage - CSS

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

## Usage - PostCSS

You can use this package in conjunction with `postcss-jit-props` to strip unused variables from the final CSS.

### Nuxt 3

```ts
// nuxt.config.ts
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

### Any other setup

**postcss.config.cjs**

```js
module.exports = {
   plugins: {
      'postcss-jit-props': {
         variables: require('tw-variables/dist/tw-variables.json'),
      },
   },
}
```

## Subsets

| Subset                     | Prefix        | Import                                               |
| -------------------------- | ------------- | ---------------------------------------------------- |
| `blur`                     | `--blur-`     | `import tw-variables/blur.css`                       |
| `borderRadius`             | `--radius-`   | `import tw-variables/border-radius.css`              |
| `borderWidth`              | `--border-`   | `import tw-variables/border-width.css`               |
| `boxShadow`                | `--shadow-`   | `import tw-variables/box-shadow.css`                 |
| `dropShadow`               | `--drop-`     | `import tw-variables/drop-shadow.css`                |
| `fontWeight`               | `--font-`     | `import tw-variables/font-weight.css`                |
| `fontFamily`               | `--family-`   | `import tw-variables/font-family.css`                |
| `fontSize`                 | `--text-`     | `import tw-variables/font-size.css`                  |
| `letterSpacing`            | `--tracking-` | `import tw-variables/letter-spacing.css`             |
| `lineHeight`               | `--leading-`  | `import tw-variables/line-height.css`                |
| `opacity`                  | `--opacity-`  | `import tw-variables/opacity.css`                    |
| `maxWidth`                 | `--max-w-`    | `import tw-variables/max-width.css`                  |
| `screens`                  | `--screen-`   | `import tw-variables/screens.css`                    |
| `spacing`                  | `--size-`     | `import tw-variables/spacing.css`                    |
| `transitionTimingFunction` | `--easing-`   | `import tw-variables/transition-timing-function.css` |
| `zIndex`                   | `--z-`        | `import tw-variables/z-index.css`                    |
| `colors`                   | See below     | `import tw-variables/colors.css`                     |

Colors:

```js
import 'tw-variables/colors.css'
```

```css
.MyClass {
   color: var(--blue-500);
   background: var(--slate-50);
}
```

<br />

## Check also

[Open Props](https://openprops.dev) by _Adam Argyle_
