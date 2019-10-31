import { Observable, EventData } from "tns-core-modules/data/observable";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { Injectable } from "~/infrastructure/injectable-decorator";
import { AccelerometerManager } from "~/managers/accelerometer-manager";
import { ObservableProperty } from "~/infrastructure/observable-property-decorator";
import * as Toast from 'nativescript-toast';
import { LocalNotifications } from "nativescript-local-notifications";
import { Color } from "tns-core-modules/color/color";
import { GPSManager } from "~/managers/gps-manager";
import { CameraManager } from "~/managers/camera-manager";
import { Page } from "tns-core-modules/ui/page/page";

export class HomeViewModel extends Observable {

    @Injectable
    accelerometerManager: AccelerometerManager;

    @Injectable
    gpsManager: GPSManager;

    @Injectable
    cameraManager: CameraManager;

    @ObservableProperty() accelerometerData: string;
    @ObservableProperty() currentLocation: string;

    private _page: Page;

    constructor(page: Page) {
        super();
        this._page = page;
    }

    async onTestDialogButtonTap(args: EventData): Promise<void> {
        // More details at: https://docs.nativescript.org/ui/dialogs
        await dialogs.alert({
            title: "Hello!",
            message: "It's dialog here!",
            okButtonText: "OK"
        });
    }

    async onTestToastButtonTap(args: EventData): Promise<void> {
        // More details at: https://github.com/TobiasHennig/nativescript-toast
        Toast.makeText("Hello World").show();
    }

    async onTestNotificationButtonTap(args: EventData): Promise<void> {
        // More details at: https://github.com/EddyVerbruggen/nativescript-local-notifications
        LocalNotifications.hasPermission();
        var scheduled = await LocalNotifications.schedule([{
            id: 1, // generated id if not set
            title: 'The title',
            body: 'Recurs every minute until cancelled',
            ticker: 'The ticker',
            color: new Color("red"),
            badge: 1,
            groupedMessages: ["The first", "Second", "Keep going", "one more..", "OK Stop"], //android only
            groupSummary: "Summary of the grouped messages above", //android only
            ongoing: true, // makes the notification ongoing (Android only)
            icon: 'res://heart',
            image: "https://cdn-images-1.medium.com/max/1200/1*c3cQvYJrVezv_Az0CoDcbA.jpeg",
            thumbnail: true,
            interval: 'minute',
            channel: 'My Channel', // default: 'Channel'
            sound: "customsound-ios.wav", // falls back to the default sound on Android
            at: new Date(new Date().getTime() + (3 * 1000)) // 3 seconds from now
        }]);
    }

    async onTestAccelerometerButtonTap(args: EventData): Promise<void> {
        // More details here: https://github.com/vakrilov/native-script-accelerometer
        this.accelerometerManager.startDataReading((data) => {
            this.accelerometerData = "X: " + data.x + ", Y: " + data.z + ", Z: " + data.z;
        });
    }

    async onTestGPSButtonTap(args: EventData): Promise<void> {
        // More details here: https://github.com/NativeScript/nativescript-geolocation
        var location = await this.gpsManager.getLocation();
        this.currentLocation = "Latitude: " + location.latitude + ", Longitude: " + location.latitude;
    }

    async onTestCameraButtonTap(args: EventData): Promise<void> {
        // More details here: https://github.com/nstudio/nativescript-camera-plus
        this.cameraManager.initCamera(this._page.getViewById('camPlus'));
    }

}