import { LiteEvent } from "~/infrastructure/lite-event";

export interface IIdentitySrvice {

    onIdentityLoaded : LiteEvent<void>;
    onIdentityUnloaded : LiteEvent<void>;

    loadIdentity(volatile: boolean, storageEncryptionKey : string): Promise<void>;

    unloadIdentity() : void;

}