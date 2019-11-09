
export interface IStorage {

    store(key: string, data: any, volatile?: boolean): void;

    load<T>(key: string, volatile?: boolean): T;

    delete(key: string, volatile?: boolean): void;

}