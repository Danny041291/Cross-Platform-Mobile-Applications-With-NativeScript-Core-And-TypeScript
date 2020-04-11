import { IEncryptor } from "./interfaces/iencryptor";
import * as CryptoJS from 'crypto-js';

export class Encryptor implements IEncryptor {

    private encryptor : CryptoJS.CipherHelper;
    
    constructor(encryptor: CryptoJS.CipherHelper) {
        this.encryptor = encryptor;
    }

    public encrypt(value: string, encryptionKey: string): string {
        return this.encryptor.encrypt(value, encryptionKey).toString();
    }

    public decrypt(value: string, encryptionKey: string): string {
        return CryptoJS.enc.Utf8.stringify(this.encryptor.decrypt(value, encryptionKey));
    }

}