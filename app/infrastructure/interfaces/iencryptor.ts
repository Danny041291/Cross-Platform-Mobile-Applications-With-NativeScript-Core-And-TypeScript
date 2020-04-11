export interface IEncryptor {

    encrypt(value: string, encryptionKey: string): string;
    
    decrypt(value: string, encryptionKey: string): string;

}