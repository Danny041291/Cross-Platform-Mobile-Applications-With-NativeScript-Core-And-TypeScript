import { IStorage } from "./interfaces/istorage";
import * as appSettings from "tns-core-modules/application-settings";
import { Encryptor } from "./encryptor";
import { Injectable } from "./injectable-decorator";
import { STORAGE_KEYS } from "~/config/enums";

export class Storage implements IStorage {

    @Injectable
    encryptor: Encryptor;

    private volatileStorage: Map<string, any>;

    constructor() {
        this.volatileStorage = new Map<string, any>();
    }

    public store(data: any, storageKey: STORAGE_KEYS, encryptionKey?: string, volatile?: boolean): void {
        if (volatile!) {
            appSettings.setString(storageKey, encryptionKey ? this.encryptor.encrypt(JSON.stringify(data), encryptionKey) : JSON.stringify(data));
            appSettings.flush();
        } else this.volatileStorage.set(storageKey, encryptionKey ? this.encryptor.encrypt(JSON.stringify(data), encryptionKey) : JSON.stringify(data));
    }

    public load(storageKey: STORAGE_KEYS, encryptionKey?: string, volatile?: boolean): any {
        var encryptedString: string;
        if (volatile) encryptedString = this.volatileStorage.get(storageKey);
        else encryptedString = appSettings.getString(storageKey);
        if(!encryptedString) return null;
        return encryptionKey ? JSON.parse(this.encryptor.decrypt(encryptedString, encryptionKey)) : JSON.parse(encryptedString);
    }

    public delete(storageKey: STORAGE_KEYS, volatile?: boolean): void {
        if (volatile) this.volatileStorage.delete(storageKey);
        else {
            appSettings.remove(storageKey);
            appSettings.flush();
        }
    }

}