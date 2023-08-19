import argv from "minimist"
const envOptions = argv(process.argv.slice(2))
console.log("🚀 ~ file: config.ts:3 ~ envOptions:", envOptions)
export const isProduction = envOptions.production || false;