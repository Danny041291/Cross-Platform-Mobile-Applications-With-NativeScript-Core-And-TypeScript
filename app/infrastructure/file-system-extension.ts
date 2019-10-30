import { File, Folder } from "tns-core-modules/file-system";
import * as fs from "tns-core-modules/file-system/file-system";

declare module 'tns-core-modules/file-system' {
    export interface File {
        copy(destination: Folder): void;
        toBase64(): string;
    }
    export interface Folder {
        copy(destination: Folder): void;
    }
}

File.prototype.copy = function (this: File, destination: Folder) {
    var file = this.readSync();
    var target = destination.getFile(this.name);
    target.writeSync(file);
};

File.prototype.toBase64 = function (this: File) {
    var file = this.readSync();
    return file.toString('base64');
};

Folder.prototype.copy = async function (this: Folder, destination: Folder) {
    var entities = await this.getEntities();
    entities.forEach(entity => {
        var element: File | Folder;
        if (!fs.Folder.exists(entity.path))
            element = entity as File;
        else element = entity as Folder;
        element.copy(destination);
    });
};