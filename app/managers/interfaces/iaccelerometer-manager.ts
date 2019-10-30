import * as accelerometer from "nativescript-accelerometer";

export interface IAccelerometerManager {

    startDataReading(onDataAvailable: (data: accelerometer.AccelerometerData) => void): void;

    stopDataReading(): void;

}