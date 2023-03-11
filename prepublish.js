const esm = await fetch('https://cdn.jsdelivr.net/npm/tw-variables/+esm')
await Bun.write('./temp/latest.js', esm)
