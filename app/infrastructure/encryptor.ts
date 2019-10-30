import { IEncryptor } from "./interfaces/iencryptor";
import * as CryptoJS from 'crypto-js';
import { environment } from "~/environments/environment";

export class Encryptor implements IEncryptor {

    private _encryptor : CryptoJS.CipherHelper;

    constructor(encryptor: CryptoJS.CipherHelper) {
        this._encryptor = encryptor;
    }

    public encrypt(value: string): string {
        return this._encryptor.encrypt(value, environment.encryptKey).toString();
    }

    public decrypt(value: string): string {
        return this._encryptor.decrypt(value, environment.encryptKey).toString();
    }

}