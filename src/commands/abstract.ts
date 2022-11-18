import { spawn } from 'child_process'

/** @todo retry */
export async function child(command: Array<string>, ondata: () => void = console.log): Promise<void> {
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

export interface IChoice {
    name: string
    message?: string
    value?: string
    hint?: string
    disabled?: boolean | string
}

export abstract class AbstractCommand implements IChoice {

    public name: string = 'Unknown command'
    public message: string = null
    public value: string = null
    public hint: string = '()'
    public disabled: boolean = false

    // копируем структуру с фильтром файлов под команду
    // налету добавляем зависимости если выбран язык кроме js
    // копируем файлы в src на базе языка
    // устанавливаем все пакеты
    public abstract execute(): Promise<boolean>

}