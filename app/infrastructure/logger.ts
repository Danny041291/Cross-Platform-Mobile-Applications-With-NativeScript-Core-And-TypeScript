import { ILogger } from './interfaces/ilogger';

export class Logger implements ILogger{

    info(message: any): void {
        console.log(message);
    }

    error(message: any): void {
        console.log(message);
    }

    fatal(message: any): void {
        console.log(message);
    }

    warn(message: any): void {
        console.log(message);
    }

}