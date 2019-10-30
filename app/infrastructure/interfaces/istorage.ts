
export interface IStorage {

    store(key: string, data: any, volatile?: boolean): void;

    load<T>(key: string): T;

    delete(key: string): void;

}