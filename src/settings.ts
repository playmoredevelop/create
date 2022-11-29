import path from "path"

export const OPTIONS_KEY = '@playmore'
export const SOURCES_PATH = path.resolve('./boilerplates')
export const DESTINATION_PATH = path.resolve(process.argv[2] ?? '.')
