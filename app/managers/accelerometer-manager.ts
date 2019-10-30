import * as accelerometer from "nativescript-accelerometer";
import { IAccelerometerManager } from "./interfaces/iaccelerometer-manager";

export class AccelerometerManager implements IAccelerometerManager {

    public startDataReading(onDataAvailable: (data : accelerometer.AccelerometerData) => void) : void {
        accelerometer.startAccelerometerUpdates(onDataAvailable);
    }

    public stopDataReading() : void {
        accelerometer.stopAccelerometerUpdates();
    }

}