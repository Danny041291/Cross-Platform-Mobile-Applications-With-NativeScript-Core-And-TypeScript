import { BackgroundWorker } from "~/infrastructure/background-worker";

export class CounterWorker extends BackgroundWorker<any> {

    protected loop(data?: any): any {
        data.x = data.x + 1;
        return data;
    }

}