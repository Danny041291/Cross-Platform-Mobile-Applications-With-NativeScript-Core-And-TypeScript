import { ThreadFactory, ThreadInfo } from "./thread-factory";

export abstract class BackgroundWorker<T> {

    private _threadInfo: ThreadInfo;

    constructor() {
        this._threadInfo = new ThreadInfo();
    }

    public start(data?: any, onDataAvailable?: (data: T) => void, onError?: (error: string) => void): void {
        ThreadFactory.start<T>(this.loop, data, onDataAvailable, onError, this._threadInfo);
    }

    public stop() {
        if (this._threadInfo.Id == -1) throw Error("Worker not started.");
        ThreadFactory.terminate(this._threadInfo.Id);
        this._threadInfo = new ThreadInfo();
    }

    protected abstract loop(data?: any): T;

}