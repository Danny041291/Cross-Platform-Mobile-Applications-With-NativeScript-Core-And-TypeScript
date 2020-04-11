export interface ILogger {

    info(message: any): void;

    error(message: any): void;

    fatal(message: any): void;

    warn(message: any): void;
    
}