#!/usr/bin/env node

import { spawn } from 'child_process'

import fs from 'fs-extra'
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

    const struct: { type: string } = await enq.prompt({
        type: 'select',
        name: 'type',
        message: 'Choose the language used during development:',
        choices: [
            { name: 'typescript', message: 'Typescript', hint: 'recomended' },
            { name: 'javascript', message: 'Javascript' },
            { name: 'haxe', message: 'Haxe', disabled: true },
        ],
    })

    const destDir = process.argv.length >= 3 ? path.resolve(process.argv[2]) : '.'

    !fs.existsSync(destDir) && fs.mkdirSync(destDir)

    // copy the basic structure to the destination folder
    fs.copy(`./structure/${struct.type}`, destDir, { recursive: true, overwrite: true })
    
    // copy .gitignore from root to dest
    fs.copyFile(`./.gitignore`, destDir + '/.gitignore')
    // fs.copyFile(`./LICENSE`, destDir)
    // exec npm init

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

        } else setup_confirmed = true

    } while (!setup_confirmed)

    // apply struct extends
    // exec npm i -SD


})()

export { }