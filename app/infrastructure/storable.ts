import { Storage } from "~/infrastructure/storage";
import { IStorable } from "./interfaces/istorable";
import { Injectable } from "./injectable-decorator";

export abstract class Storable<T> implements IStorable {

    @Injectable
    storage: Storage;

    private _storage_key: string;
    private _volatile: boolean = false;

    constructor(storage_key: string) {
        this._storage_key = storage_key;
        var storable = this.storage.load<T>(storage_key, this._volatile);
        this.load(storable);
    }

    protected abstract load(storable: T): void;

    public setStorageMode(volatile: boolean) {
        if (this._volatile == volatile) return;
        this.storage.delete(this._storage_key, this._volatile);
        this._volatile = volatile;
        this.storage.store(this._storage_key, this._volatile);
    }

    public update() {
        this.storage.store(this._storage_key, this, this._volatile);
    }

    public delete() {
        this.storage.delete(this._storage_key, this._volatile);
        this.load(null);
    }

}