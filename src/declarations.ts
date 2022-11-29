export interface IChoice {
    name: string
    message?: string
    value?: string
    hint?: string
    disabled?: boolean | string
}

export interface ILangPackages extends IChoice {
    dependencies?: Array<string>
    devDependencies?: Array<string>
}

export interface ICommandOptions extends IChoice {
    folders: Array<string>
    language: ILangPackages
}