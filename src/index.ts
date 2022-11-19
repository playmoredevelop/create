#!/usr/bin/env node

import fs from 'fs-extra'
import enq from 'enquirer'
import path from 'path'

import { IExecuteOptions } from './abstract.command';
import MicroserviceCommand from './commands/microservice'

(async () => {

    const commands = [
        new MicroserviceCommand()
    ]

    const options: IExecuteOptions = {
        dir: path.resolve(process.argv[2] ?? '.'),
        no_components: false,
        command: await enq.prompt({
            type: 'select',
            name: 'type',
            message: 'Select the project structure to install:',
            choices: commands,
            initial: 0
        }),
        language: await enq.prompt({
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
    }

    !fs.existsSync(options.dir) && fs.mkdirSync(options.dir)

    for (const c of commands) if (c.name === options.command.selected) {

        await c.execute(options)

        break
    }

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

            options.no_components = no_components.confirmed

        } else options.no_components = true

    } while (!options.no_components)

    // apply struct extends
    // exec npm i -SD


})()

export { }