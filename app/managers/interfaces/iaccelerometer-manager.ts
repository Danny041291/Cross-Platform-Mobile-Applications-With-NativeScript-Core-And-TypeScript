import * as accelerometer from "nativescript-accelerometer";

export interface IAccelerometerManager {

    isRunning: boolean;

    startDataReading(onDataAvailable: (data: accelerometer.AccelerometerData) => void): void;

    stopDataReading(): void;

}