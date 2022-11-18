#!/usr/bin/env node

import fs from 'fs-extra'
import enq from 'enquirer'
import path from 'path'
import MicroserviceCommand from './commands/microservice'

const commands = [
    new MicroserviceCommand()
];

(async () => {

    const state = {
        confirmed_no_components: false,
        destination_dir: process.argv.length >= 3 ? path.resolve(process.argv[2]) : '.'
    }

    const command: { selected: string } = await enq.prompt({
        type: 'select',
        name: 'type',
        message: 'Select the project structure to install:',
        choices: commands,
        // [
        //     {  },
        //     { name: 'multiplier', message: 'Multiplier server ', hint: '[backend] (express, colyseus, chai)' },
        //     { name: 'webgl-pixi', message: 'WEBGL pixi.js', hint: '[frontend] (pixi, canvas)' },
        //     { name: 'cli', message: 'CLI', hint: '(cli application)', disabled: true },
        // ],
        initial: 0
    })

    const lang: { selected: string } = await enq.prompt({
        type: 'select',
        name: 'name',
        message: 'Choose a language for this project:',
        choices: [
            { name: 'typescript', message: 'TypeScript', hint: '(recomended)' },
            { name: 'javascript', message: 'JavaScript' },
            { name: 'haxe', message: 'Haxe', disabled: true },
            { name: 'nativescript', message: 'NativeScript', disabled: true },
        ],
    })

    !fs.existsSync(state.destination_dir) && fs.mkdirSync(state.destination_dir)

    for (const c of commands) if (c.name === command.selected) {

        // await c.setup(lang.selected)
        await c.execute()

        break
    }

    // copy the basic structure to the destination folder
    fs.copy(`./structure`, state.destination_dir, { overwrite: true })
    // license
    fs.copyFile(`./LICENSE`, state.destination_dir)

    

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

            const no_components: { confirmed: boolean } = await enq.prompt({
                type: 'confirm',
                name: 'confirmed',
                message: 'No components selected. Create an empty project?'
            })

            state.confirmed_no_components = no_components.confirmed

        } else state.confirmed_no_components = true

    } while (!state.confirmed_no_components)

    // apply struct extends
    // exec npm i -SD


})()

export { }