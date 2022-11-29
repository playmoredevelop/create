#!/usr/bin/env node

import * as settings from './settings'
import fs from 'fs-extra'
import path from 'path'

import { Command } from './command'
import { Facade } from './facade'
import { ICommandOptions } from './declarations'

(async () => {

    // all commands list
    const commands: Map<string, Command> = new Map
    // commands hash map (uniq lines)
    const hm_commands: Map<string, Command> = new Map

    /** @todo benchmarks */
    for await (const folder of await fs.opendir(settings.SOURCES_PATH)) {

        const configPath = path.resolve(settings.SOURCES_PATH, folder.name, 'package.json')

        if (await fs.pathExists(configPath)) {

            const config: { [settings.OPTIONS_KEY]: ICommandOptions } = await fs.readJson(configPath, { throws: false })

            if (settings.OPTIONS_KEY in config) {

                const command = new Command(config[settings.OPTIONS_KEY])
                const hm_key = [command.name, command.value, command.hint].join('_')

                commands.set(`${command.language.name}-${command.name}`, command)
                hm_commands.has(hm_key) ? null : hm_commands.set(hm_key, command)
            }
        }
    }

    !fs.existsSync(settings.DESTINATION_PATH) && fs.mkdirSync(settings.DESTINATION_PATH)

    const command = await Facade.select(
        'Select the project structure to install:',
        Array.from(hm_commands.values())
    )

    const language = await Facade.select(
        'Choose a language for this project:',
        [...commands.values()].filter(c => c.name === command.selected).map(c => c.language)
    )

    /** 
     * @todo
     * - запросить правки списка зависимостей
     * - вывести подробный список со всеми зависимостями и дать возможность часть из них отключить
     */

    commands.get(`${language.selected}-${command.selected}`).execute()

})()

export { }