![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/tailwind-variables/build-and-test.yml?branch=main&label=build) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/smastrom/tailwind-variables/build-and-test.yml?branch=main&label=checks)

# Tailwind Variables

~400 useful CSS variables generated straight from Tailwind source files.

<br />

## Browser

All variables including colors:

```html
<link
   rel="stylesheet"
   href="https://cdn.jsdelivr.net/npm/@smastrom/tailwind-variables/dist/variables.css"
/>
```

One or more subsets:

```html
<link
   rel="stylesheet"
   href="https://cdn.jsdelivr.net/npm/@smastrom/tailwind-variables/dist/colors.css"
/>
<link
   rel="stylesheet"
   href="https://cdn.jsdelivr.net/npm/@smastrom/tailwind-variables/dist/size.css"
/>
<link
   rel="stylesheet"
   href="https://cdn.jsdelivr.net/npm/@smastrom/tailwind-variables/dist/sky.css"
/>
```

Preflight:

```html
<link
   rel="stylesheet"
   href="https://cdn.jsdelivr.net/npm/@smastrom/tailwind-variables/dist/preflight.css"
/>
```

Pick any import on jsDelivr: [Link](https://www.jsdelivr.com/package/npm/@smastrom/tailwind-variables?tab=files&path=dist)

<br />

## Package Manager

### Installation

```bash
pnpm add -D @smastrom/tailwind-variables
```

### Import - CSS

All variables (including colors):

```js
import '@smastrom/tailwind-variables/variables.css'
```

One or more subsets:

```js
import '@smastrom/tailwind-variables/colors.css'
import '@smastrom/tailwind-variables/size.css'
import '@smastrom/tailwind-variables/green.css'
```

Preflight:

```js
import '@smastrom/tailwind-variables/preflight.css'
```

### Import - PostCSS

If using PostCSS, you can use this package in conjunction with [postcss-jit-props](https://github.com/GoogleChromeLabs/postcss-jit-props) to strip any unused variable from the final CSS:

```bash
pnpm add -D postcss postcss-jit-props
```

#### Nuxt 3 - nuxt.config.ts

```ts
import { twVariables } from '@smastrom/tailwind-variables'

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

#### Any other framework - postcss.config.cjs

```js
const postcssJitProps = require('postcss-jit-props')
const twVariables = require('@smastrom/tailwind-variables')

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
   font-family: 'Basier Circle', var(--family-sans);
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

| Name                       | Prefix                   | Import                                            | Reference                                                       |
| -------------------------- | ------------------------ | ------------------------------------------------- | --------------------------------------------------------------- |
| `blur`                     | `--blur-`                | `@smastrom/tailwind-variables/blur.css`           | [Link](https://tailwindcss.com/docs/blur)                       |
| `borderRadius`             | `--radius-`              | `@smastrom/tailwind-variables/border-radius.css`  | [Link](https://tailwindcss.com/docs/border-radius)              |
| `borderWidth`              | `--border-`              | `@smastrom/tailwind-variables/border-width.css`   | [Link](https://tailwindcss.com/docs/border-width)               |
| `boxShadow`                | `--shadow-`              | `@smastrom/tailwind-variables/box-shadow.css`     | [Link](https://tailwindcss.com/docs/box-shadow)                 |
| `colors`                   | `--blue-`, `--slate-`... | `@smastrom/tailwind-variables/colors.css`         | [Link](https://tailwindcss.com/docs/customizing-colors)         |
| `dropShadow`               | `--drop-`                | `@smastrom/tailwind-variables/drop-shadow.css`    | [Link](https://tailwindcss.com/docs/drop-shadow)                |
| `fontWeight`               | `--font-`                | `@smastrom/tailwind-variables/font-weight.css`    | [Link](https://tailwindcss.com/docs/font-weight)                |
| `fontFamily`               | `--family-`              | `@smastrom/tailwind-variables/font-family.css`    | [Link](https://tailwindcss.com/docs/font-family)                |
| `fontSize`                 | `--text-`                | `@smastrom/tailwind-variables/font-size.css`      | [Link](https://tailwindcss.com/docs/font-size)                  |
| `letterSpacing`            | `--tracking-`            | `@smastrom/tailwind-variables/letter-spacing.css` | [Link](https://tailwindcss.com/docs/letter-spacing)             |
| `lineHeight`               | `--leading-`             | `@smastrom/tailwind-variables/line-height.css`    | [Link](https://tailwindcss.com/docs/line-height)                |
| `opacity`                  | `--opacity-`             | `@smastrom/tailwind-variables/opacity.css`        | [Link](https://tailwindcss.com/docs/opacity)                    |
| `maxWidth`                 | `--width-`               | `@smastrom/tailwind-variables/width.css`          | [Link](https://tailwindcss.com/docs/max-width)                  |
| `screens`                  | `--screen-`              | `@smastrom/tailwind-variables/screen.css`         | [Link](https://tailwindcss.com/docs/theme#screens)              |
| `spacing`                  | `--size-`                | `@smastrom/tailwind-variables/size.css`           | [Link](https://tailwindcss.com/docs/padding)                    |
| `transitionTimingFunction` | `--easing-`              | `@smastrom/tailwind-variables/easing.css`         | [Link](https://tailwindcss.com/docs/transition-timing-function) |
| `zIndex`                   | `--z-`                   | `@smastrom/tailwind-variables/z-index.css`        | [Link](https://tailwindcss.com/docs/z-index)                    |

<br />

## Colors subsets

Colors reference: [Link](https://tailwindcss.com/docs/customizing-colors)

| Name      | Prefix       | Import                                     |
| --------- | ------------ | ------------------------------------------ |
| `amber`   | `--amber-`   | `@smastrom/tailwind-variables/amber.css`   |
| `blue`    | `--blue-`    | `@smastrom/tailwind-variables/blue.css`    |
| `cyan`    | `--cyan-`    | `@smastrom/tailwind-variables/cyan.css`    |
| `emerald` | `--emerald-` | `@smastrom/tailwind-variables/emerald.css` |
| `fuchsia` | `--fuchsia-` | `@smastrom/tailwind-variables/fuchsia.css` |
| `gray`    | `--gray-`    | `@smastrom/tailwind-variables/gray.css`    |
| `green`   | `--green-`   | `@smastrom/tailwind-variables/green.css`   |
| `indigo`  | `--indigo-`  | `@smastrom/tailwind-variables/indigo.css`  |
| `lime`    | `--lime-`    | `@smastrom/tailwind-variables/lime.css`    |
| `neutral` | `--neutral-` | `@smastrom/tailwind-variables/neutral.css` |
| `orange`  | `--orange-`  | `@smastrom/tailwind-variables/orange.css`  |
| `pink`    | `--pink-`    | `@smastrom/tailwind-variables/pink.css`    |
| `purple`  | `--purple-`  | `@smastrom/tailwind-variables/purple.css`  |
| `red`     | `--red-`     | `@smastrom/tailwind-variables/red.css`     |
| `rose`    | `--rose-`    | `@smastrom/tailwind-variables/rose.css`    |
| `slate`   | `--slate-`   | `@smastrom/tailwind-variables/slate.css`   |
| `sky`     | `--sky-`     | `@smastrom/tailwind-variables/sky.css`     |
| `teal`    | `--teal-`    | `@smastrom/tailwind-variables/teal.css`    |
| `violet`  | `--violet-`  | `@smastrom/tailwind-variables/violet.css`  |
| `yellow`  | `--yellow-`  | `@smastrom/tailwind-variables/yellow.css`  |
| `zinc`    | `--zinc-`    | `@smastrom/tailwind-variables/zinc.css`    |

<br />

## Updates

Since the output is tested and generated as expected, I consider this package "complete" for now.

I also see no point in updating it everytime Tailwind releases a new version.

Once Tailwind will drop some new tokens that are worth to be added, I'll make sure to include them in a new version of this package.

> Output generated using `tailwindcss v3.2.7`

<br />

## See also

[Open Props](https://github.com/argyleink/open-props) by _Adam Argyle_

<br />

## License

MIT
