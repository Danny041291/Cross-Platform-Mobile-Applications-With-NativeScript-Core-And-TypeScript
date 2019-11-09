import { knownFolders } from "tns-core-modules/file-system";
import { onMessage } from "~/worker_template.js";

export class ThreadInfo {
    public Id: number = -1;
}

// Warning: only self-contained JavaScript functions are allowed
export class ThreadFactory {

    public static ActiveThreads: Map<number, Worker> = new Map<number, Worker>();

    private static _ids: number = 0;

    public static async run<T>(func: (data: any) => T, data?: any, threadInfo?: ThreadInfo): Promise<T> {
        var id = this._ids++;
        if (data == null) data = {};
        data['id'] = id;
        data['execution'] = 'once';
        if (threadInfo != null) threadInfo.Id = id;
        await this.createWorker(id, func);
        return new Promise(async (resolve, reject) => {
            var worker = new Worker(knownFolders.currentApp().getFile("worker_" + id + ".js").path);
            this.ActiveThreads.set(id, worker);
            worker.postMessage(data);
            worker.onmessage = (message: any) => {
                this._ids--;
                worker.terminate();
                this.ActiveThreads.delete(id);
                this.deleteWorker(id);
                resolve(message.data);
            };
            worker.onerror = (error) => {
                this._ids--;
                worker.terminate();
                this.ActiveThreads.delete(id);
                this.deleteWorker(id);
                reject(error.error);
            };
        });
    }

    public static start<T>(func: (data: any) => T, data?: any, onDataAvailable?: (data: T) => void, onError?: (error: string) => void, threadInfo?: ThreadInfo): void {
        var id = this._ids++;
        if (data == null) data = {};
        data['id'] = id;
        data['execution'] = 'loop';
        if (threadInfo != null) threadInfo.Id = id;
        this.createWorker(id, func).then(() => {
            var worker = new Worker(knownFolders.currentApp().getFile("worker_" + id + ".js").path);
            this.ActiveThreads.set(id, worker);
            worker.postMessage(data);
            worker.onmessage = (message: any) => {
                if (!message || !message.data) {
                    this._ids--;
                    worker.terminate();
                    this.ActiveThreads.delete(id);
                    this.deleteWorker(id);
                } else if (onDataAvailable) {
                    onDataAvailable(message.data);
                }
            };
            worker.onerror = (error) => {
                this._ids--;
                worker.terminate();
                this.ActiveThreads.delete(id);
                this.deleteWorker(id);
                onError(error.error);
            };
        }).catch(error => {
            if (onError) onError(error);
        });
    }

    public static terminate(id: number) {
        var worker = this.ActiveThreads.get(id);
        if (worker == null) return Error("Worker '" + id + "' not found.");
        worker.terminate();
        this.ActiveThreads.delete(id);
        this.deleteWorker(id);
    }

    private static async createWorker(id: number, func: Function) {
        var funcBody = func.toString();
        funcBody = funcBody.slice(funcBody.indexOf("{") + 1, funcBody.lastIndexOf("}"));
        funcBody = "function run(data){" + funcBody + "}";
        var template = "require('globals');" + onMessage.toString() + ";" + funcBody + ";global.onmessage=onMessage;";
        var worker = knownFolders.currentApp().getFile('worker_' + id + '.js');
        await worker.writeText(template);
    }

    private static async deleteWorker(id: number) {
        var worker = knownFolders.currentApp().getFile('worker_' + id + '.js');
        await worker.remove();
    }

}