import * as settings from './settings'
import fs from 'fs-extra'
import path from 'path'
import { spawn } from 'child_process'
import { IChoice, ICommandOptions, ILangPackages } from './declarations'

export class Command implements IChoice {

    readonly name: string = 'unknown'
    readonly message: string = null
    readonly value: string = null
    readonly hint: string = '()'
    readonly disabled: boolean = false
    readonly language: ILangPackages = { name: 'javascript' }
    readonly folder: string
    readonly from: string

    constructor(options: ICommandOptions) {
        Object.assign(this, options)
        this.folder = `${this.language.name}-${this.name}`
        this.from = path.resolve(settings.SOURCES_PATH, this.folder)
    }

    // налету добавляем зависимости если выбран язык кроме js
    // копируем файлы в src на базе языка
    // устанавливаем все пакеты
    public async execute(): Promise<boolean> {

        // copy the basic structure to the destination folder
        fs.copy(this.from, settings.DESTINATION_PATH, {
            overwrite: true,
            recursive: false
        })

        // license
        fs.copyFile('./LICENSE', path.resolve(settings.DESTINATION_PATH, './LICENSE'))

        /** 
         * @todo
         * - компиляция списка зависимостей
         * - run npm i -SD
         * - параллельно запросить настройки репозитория
         * - старт проекта в dev режиме
         */

        return true
    }

    protected async run(command: Array<string>, ondata: () => void = console.log): Promise<void> {

        /** @todo retry */
        return new Promise((rs, rj) => {
            const spawner = spawn(command.shift(), command)
            try {
                spawner.stdout.on('data', ondata)
                spawner.stderr.on('data', console.error)
                spawner.on('close', rs)
            } catch {
                spawner.kill() && rj()
            }
        })
    }

    // protected copyDependencies(support: Record<string, Partial<ILangPackages>>): this {

    //     const dependencies = support[this.language.selected]?.dependencies ?? []
    //     const devDependencies = support[options.language.selected]?.devDependencies ?? []

    //     // compiling a list of dependencies with @latest prefix
    //     // this.packages = dependencies.map(v => v + '@latest')
    //     // this.devpackages = devDependencies.map(v => v + '@latest')

    //     return this
    // }

}
