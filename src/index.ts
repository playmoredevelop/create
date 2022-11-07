#!/usr/bin/env node

import { spawn } from 'child_process'
import { existsSync, mkdirSync } from 'fs'

import enq from 'enquirer'
import path from 'path'

/** @todo retry */
async function child(command: Array<string>, ondata: () => void = console.log): Promise<void> {
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

(async () => {

    let setup_confirmed = false

    const branch: { lang: string } = await enq.prompt({
        type: 'select',
        name: 'lang',
        message: 'Choose the language used during development:',
        choices: [
            { name: 'typescript', message: 'Typescript', hint: 'recomended' },
            { name: 'javascript', message: 'Javascript' },
            { name: 'haxe', message: 'Haxe', disabled: true },
        ],
    })

    do {

        const setup: { comp: Array<string> } = await enq.prompt({
            type: 'multiselect',
            name: 'comp',
            message: 'Choose the project components:',
            choices: [
                { name: 'node', message: 'Node', hint: 'пустой проект без настроек' },
                { name: 'canvas', message: 'Canvas', hint: 'пустой проект без настроек' },
                { name: 'cli', message: 'CLI', hint: 'пустой проект без настроек' },
            ],
        })

        // is project without components, clarify whether it is really without settings
        if (!setup.comp.length) {

            const confirm: { setup_confirmed: boolean } = await enq.prompt({
                type: 'confirm',
                name: 'setup_confirmed',
                message: 'No components selected. Create an empty project?'
            })

            setup_confirmed = confirm.setup_confirmed
            
        } else (setup_confirmed = true)

    } while (!setup_confirmed)


    console.log(branch)

})()

export { }