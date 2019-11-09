import { File, Folder } from "tns-core-modules/file-system";

declare module 'tns-core-modules/file-system' {
    export interface File {
        copy(name?: string, destination?: Folder): File;
    }
}

File.prototype.copy = function (this: File, name?: string, destination?: Folder): File {
    var text = this.readTextSync();
    if (name == null) name = this.name + ' (Copy)' + this.extension;
    if (destination == null) destination = this.parent;
    var target = destination.getFile(name);
    target.writeTextSync(text);
    return target;
};