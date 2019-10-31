import { knownFolders, File } from "tns-core-modules/file-system";
import WorkerScript from "nativescript-worker-loader";

export class ThreadInfo {
    public Id: number;
}

export class ThreadFactory {

    public static ActiveThreads: Map<number, Worker> = new Map<number, Worker>();

    private static _ids: number = 0;
    private static _worker_template: File = knownFolders.currentApp().getFile('worker_template.js');

    public static async run<T>(data: any, func: (data: any) => T, loop: boolean = false, threadInfo?: ThreadInfo): Promise<T> {
        var id = this._ids++;
        data['id'] = id;
        data['execution'] = loop ? 'loop' : 'once';
        if (threadInfo != null) threadInfo.Id = id;
        await this.createWorker(id, func);
        return new Promise(async (resolve, reject) => {
            var worker = new WorkerScript(knownFolders.currentApp() + "/worker_" + id + ".js");
            this.ActiveThreads.set(id, worker);
            worker.postMessage(data);
            worker.onmessage = (result: T) => {
                this._ids--;
                worker.terminate();
                this.ActiveThreads.delete(id);
                this.deleteWorker(id);
                resolve(result);
            };
            worker.onerror = (err) => {
                this._ids--;
                worker.terminate();
                this.ActiveThreads.delete(id);
                this.deleteWorker(id);
                reject(err);
            };
        });
    }

    public static terminate(id: number) {
        var worker = this.ActiveThreads.get(id);
        if (worker == null) return;
        worker.terminate();
        this.ActiveThreads.delete(id);
        this.deleteWorker(id);
    }

    private static async createWorker(id: number, func: Function) {
        var funcBody = func.toString();
        funcBody = funcBody.slice(funcBody.indexOf("{") + 1, funcBody.lastIndexOf("}"));
        funcBody = "function run(data){" + funcBody + "}";
        var template = (await this._worker_template.readText()) + funcBody;
        var new_worker = knownFolders.currentApp().getFile('worker_' + id + '.js');
        await new_worker.writeText(template);
    }

    private static async deleteWorker(id: number) {
        var worker = knownFolders.currentApp().getFile('worker_' + id + '.js');
        await worker.remove();
    }

}