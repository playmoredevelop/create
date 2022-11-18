import { AbstractCommand, child } from "./abstract";

export default class MicroserviceCommand extends AbstractCommand {

    protected packages: Array <string> = [
        'express',
        'mongoose',
        'helmet',
        'pino',

    ]

    public name: 'microservice'
    public message: 'Microservice'
    public hint: '[backend] (express, chai)'
    public value: 'MicroserviceCommand'

    async execute(): Promise <boolean> {

        await child(['npm', 'i -SD', this.packages.join(' ')])

        return true
    }


}