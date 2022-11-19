import fs from 'fs-extra'
import { spawn } from 'child_process'

export interface IChoice {
    name: string
    message?: string
    value?: string
    hint?: string
    disabled?: boolean | string
}

export interface IExecuteOptions {
    dir: string
    no_components: boolean
    command: { selected: string }
    language: { selected: string }
}

export abstract class AbstractCommand implements IChoice {

    public name: string = 'Unknown command'
    public message: string = null
    public value: string = null
    public hint: string = '()'
    public disabled: boolean = false

    protected packages: Array<string> = []
    protected devpackages: Array<string> = []

    // налету добавляем зависимости если выбран язык кроме js
    // копируем файлы в src на базе языка
    // устанавливаем все пакеты
    public abstract execute(options: IExecuteOptions): Promise<boolean>

    protected copySourceFiltered(options: IExecuteOptions, paths: Array<string>): this {

        // copy the basic structure to the destination folder
        fs.copy(`./sources`, options.dir, {
            overwrite: true,
            filter: path => paths.includes(path)
        })
        // license
        fs.copyFile(`./LICENSE`, options.dir)

        return this
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

}