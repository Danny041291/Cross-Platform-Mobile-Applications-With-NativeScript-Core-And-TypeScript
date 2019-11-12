import { IStorage } from "./interfaces/istorage";
import * as appSettings from "tns-core-modules/application-settings";
import { Encryptor } from "./encryptor";
import { Injectable } from "./injectable-decorator";

export class Storage implements IStorage {

    @Injectable
    encryptor: Encryptor;

    private _volatileStorage: Map<string, any>;

    constructor() {
        this._volatileStorage = new Map<string, any>();
    }

    public store(key: string, data: any, volatile?: boolean, encryptKey?: string): void {
        if (volatile) {
            this._volatileStorage.set(key, this.encryptor.encrypt(JSON.stringify(data), encryptKey));
            return;
        }
        appSettings.setString(key, this.encryptor.encrypt(JSON.stringify(data), encryptKey));
        appSettings.flush();
    }

    public load<T>(key: string, volatile?: boolean, encryptKey?: string): T {
        var encryptedString: string;
        if (volatile)
            encryptedString = this._volatileStorage.get(key);
        else encryptedString = appSettings.getString(key);
        return encryptedString != null ? JSON.parse(this.encryptor.decrypt(encryptedString, encryptKey)) : null;
    }

    public delete(key: string, volatile?: boolean): void {
        if (volatile)
            this._volatileStorage.delete(key);
        else {
            appSettings.remove(key);
            appSettings.flush();
        }
    }

}