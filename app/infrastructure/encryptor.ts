import { IEncryptor } from "./interfaces/iencryptor";
import * as CryptoJS from 'crypto-js';

export class Encryptor implements IEncryptor {

    private _encryptor : CryptoJS.CipherHelper;
    
    constructor(encryptor: CryptoJS.CipherHelper) {
        this._encryptor = encryptor;
    }

    public encrypt(value: string, encryptKey: string): string {
        return this._encryptor.encrypt(value, encryptKey).toString();
    }

    public decrypt(value: string, encryptKey: string): string {
        return this._encryptor.decrypt(value, encryptKey).toString();
    }

}