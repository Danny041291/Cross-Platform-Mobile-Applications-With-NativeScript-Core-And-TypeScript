import * as accelerometer from "nativescript-accelerometer";
import { IAccelerometerManager } from "./interfaces/iaccelerometer-manager";

export class AccelerometerManager implements IAccelerometerManager {

    public isRunning: boolean;

    public startDataReading(onDataAvailable: (data: accelerometer.AccelerometerData) => void): void {
        if (this.isRunning) return;
        accelerometer.startAccelerometerUpdates(onDataAvailable);
        this.isRunning = true;
    }

    public stopDataReading(): void {
        if (!this.isRunning) return;
        accelerometer.stopAccelerometerUpdates();
        this.isRunning = false;
    }

}