import enq from 'enquirer'
import { IChoice } from './declarations'

export type TSelected = { selected: string }
export type TConfirm = { confirmed: boolean }

export class Facade {

    static async select(message: string, choices: Array <IChoice>, initial: number = 0): Promise <TSelected> {

        return await enq.prompt({
            type: 'select',
            name: 'selected',
            message,
            choices,
            initial
        })
    }

    static async confirm(message: string): Promise <TConfirm> {

        return await enq.prompt({
            type: 'confirm',
            name: 'confirmed',
            message
        })
    }
}