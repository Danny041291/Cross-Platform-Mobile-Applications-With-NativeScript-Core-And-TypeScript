import { STORAGE_KEYS } from "~/config/enums";

export interface IStorage {

    store(data: any, storageKey: STORAGE_KEYS, encryptionKey?: string, volatile?: boolean): void;

    load(storageKey: STORAGE_KEYS, encryptionKey?: string, volatile?: boolean): any;

    delete(key: STORAGE_KEYS, volatile?: boolean): void;

}