import { IStorable } from "./interfaces/istorable";
import { Storage } from "./storage";

export abstract class Storable<T> implements IStorable {

    private _storage: Storage;
    private _storage_key: string;
    private _volatile: boolean;
    private _encryptKey: string;

    constructor(storage: Storage, storage_key: string, volatile: boolean = false, encryptKey?: string) {
        this._storage = storage;
        this._storage_key = storage_key;
        this._volatile = volatile;
        this._encryptKey = encryptKey;
        var storable = this._storage.load<T>(storage_key, this._volatile, this._encryptKey);
        this.load(storable,);
    }

    protected abstract load(storable: T): void;

    public update() {
        this._storage.store(this._storage_key, this, this._volatile, this._encryptKey);
    }

    public delete() {
        this._storage.delete(this._storage_key, this._volatile);
        this.load(null);
    }

}