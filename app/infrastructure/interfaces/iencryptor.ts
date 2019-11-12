export interface IEncryptor {

    encrypt(value: string, encryptKey: string): string;
    
    decrypt(value: string, encryptKey: string): string;

}