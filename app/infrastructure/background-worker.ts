import { ThreadFactory, ThreadInfo } from "./thread-factory";

export abstract class BackgroundWorker<T> {

    private _threadInfo: ThreadInfo;

    constructor() {
        this._threadInfo = new ThreadInfo();
    }

    public async start(data: any): Promise<T> {
        return ThreadFactory.run<T>(data, this.loop, true, this._threadInfo);
    }

    public stop() {
        // Error if thread info is null
        ThreadFactory.terminate(this._threadInfo.Id);
    }

    public abstract loop(data: any): T;

}