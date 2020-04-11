import { IStorable } from "./interfaces/istorable";
import { Storage } from "./storage";
import { STORAGE_KEYS } from "~/config/enums";

export abstract class Storable<T> implements IStorable {

    private storage: Storage;
    private storageKey: STORAGE_KEYS;
    private encryptionKey: string;
    private volatile: boolean;

    constructor(storage: Storage, storageKey: STORAGE_KEYS, encryptionKey?: string, volatile?: boolean) {
        this.storage = storage;
        this.storageKey = storageKey;
        this.encryptionKey = encryptionKey;
        this.volatile = volatile;
        this.load(this.storage.load(storageKey, encryptionKey, volatile));
    }

    protected abstract load(storable?: any): void;

    public update() {
        this.storage.store(this, this.storageKey, this.encryptionKey, this.volatile);
    }

    public delete() {
        this.storage.delete(this.storageKey, this.volatile);
        this.load();
    }

}