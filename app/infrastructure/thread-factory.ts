import { knownFolders, File } from "tns-core-modules/file-system";
import WorkerScript from "nativescript-worker-loader";

export class ThreadFactory {

    private static _ids: number = 0;
    private static worker_template: File = knownFolders.currentApp().getFile('worker_template.js');

    public static async run<T>(data: any, func: (data: any) => T): Promise<T> {
        var t_id = this._ids++;
        data['t_id'] = t_id;
        await this.createWorker(t_id, func);
        return new Promise(async (resolve, reject) => {
            var worker = new WorkerScript(knownFolders.currentApp() + "/worker_" + t_id + ".js");
            worker.postMessage(data);
            worker.onmessage = (result: T) => {
                this._ids--;
                worker.terminate();
                this.deleteWorker(t_id);
                resolve(result);
            };
            worker.onerror = (err) => {
                this._ids--;
                worker.terminate();
                this.deleteWorker(t_id);
                reject(err);
            };
        });
    }

    private static async createWorker(threadId: number, func: Function) {
        var funcBody = func.toString();
        funcBody = funcBody.slice(funcBody.indexOf("{") + 1, funcBody.lastIndexOf("}"));
        var template = (await this.worker_template.readText()) + '\n\r' + funcBody;
        var new_worker = knownFolders.currentApp().getFile('worker_' + threadId + '.js');
        await new_worker.writeText(template);
    }

    private static async deleteWorker(threadId: number) {
        var worker = knownFolders.currentApp().getFile('worker_' + threadId + '.js');
        await worker.remove();
    }

}