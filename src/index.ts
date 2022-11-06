#!/usr/bin/env node

import { spawn } from 'child_process'
import { existsSync, mkdirSync } from 'fs'

import enq from 'enquirer'
import path from 'path'

(async () => {

    /** @todo retry */
    async function child(command: Array<string>, ondata: () => void = () => console.log){
        return new Promise(resolve => {
            const spawner = spawn(command.shift(), command)
            try {
                spawner.stdout.on('data', ondata)
                spawner.stderr.on('data', () => console.error)
                spawner.on('close', () => resolve(true))
            } catch {
                spawner.kill()
            }
        })
    }

    const lang = await enq.prompt({
        type: 'select',
        name: 'lang',
        message: 'Choose the language used during development:',
        choices: ['Typescript', 'Javascript'],
    })

    console.log(lang)
    
})()

export {}