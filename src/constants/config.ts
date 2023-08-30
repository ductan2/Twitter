import argv from "minimist"
const envOptions = argv(process.argv.slice(2))
export const isProduction = envOptions.production || false;