import packages from '../packages'
import { AbstractCommand, IExecuteOptions } from "../abstract.command";

export default class MicroserviceCommand extends AbstractCommand {

    public name: 'microservice'
    public message: 'Microservice'
    public hint: '[backend] (express, chai)'
    public value: 'MicroserviceCommand'

    async execute(options: IExecuteOptions): Promise<boolean> {

        this.copySourceFiltered(options, [
            // './sources/src',
            './sources/tsconfig.json',
        ])

        this.packages = packages['microservices']?.[options.language.selected] ?? []
        this.devpackages = packages['microservices']?.[options.language.selected] ?? []

        // await this.run(['npm', 'i -SD', this.packages.concat(this.devpackages).join(' ')])

        return true
    }


}