
export interface IStorage {

    store(key: string, data: any, volatile?: boolean, encryptKey?: string): void;

    load<T>(key: string, volatile?: boolean, encryptKey?: string): T;

    delete(key: string, volatile?: boolean): void;

}