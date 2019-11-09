import { Observable, EventData } from "tns-core-modules/data/observable";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { Injectable } from "~/infrastructure/injectable-decorator";
import { ObservableProperty } from "~/infrastructure/observable-property-decorator";
import { LocalNotifications } from "nativescript-local-notifications";
import { CameraManager } from "~/managers/camera-manager";
import { Page } from "tns-core-modules/ui/page/page";
import * as accelerometer from "nativescript-accelerometer";
import * as geolocation from 'nativescript-geolocation';
import { CounterWorker } from "~/workers/counter-worker";
import { Toasty } from 'nativescript-toasty';

export class HomeViewModel extends Observable {

    @Injectable
    cameraManager: CameraManager;

    @Injectable
    counterWorker: CounterWorker;

    @ObservableProperty() log: string;
    @ObservableProperty() cameraEnabled: boolean;

    private _page: Page;

    constructor(page: Page) {
        super();
        this._page = page;
    }

    @Restart()
    async onTestDialogButtonTap(args: EventData): Promise<void> {
        // More details at: https://docs.nativescript.org/ui/dialogs
        await dialogs.alert({
            title: "Hello!",
            message: "It's dialog here!",
            okButtonText: "OK"
        });
        this.log = "LOG: Dialog closed."
    }

    @Restart()
    onTestToastButtonTap(args: EventData): void {
        // More details at: https://github.com/triniwiz/nativescript-toasty
        const toast = new Toasty({ text: 'Toast message' });
        toast.show();
        this.log = "LOG: Toast showed."
    }

    @Restart()
    async onTestNotificationButtonTap(args: EventData): Promise<void> {
        // More details at: https://github.com/EddyVerbruggen/nativescript-local-notifications
        var hasPermission = await LocalNotifications.hasPermission();
        if (!hasPermission) throw Error("No permission for local notifications");
        var scheduled = await LocalNotifications.schedule([{
            id: 1,
            title: 'Title',
            body: 'Body',
            groupedMessages: ["First", "Second..."],
            groupSummary: "Group summary"
        }]);
        this.log = "LOG: Notification '" + scheduled[0] + "' showed.";
    }

    @Restart()
    async onTestAccelerometerButtonTap(args: EventData): Promise<void> {
        // More details here: https://github.com/vakrilov/native-script-accelerometer
        accelerometer.startAccelerometerUpdates((data) => {
            this.log = "LOG: X: " + Math.round(data.x * 1000) / 1000 + ", Y: " + Math.round(data.y * 1000) / 1000 + ", Z: " + Math.round(data.z * 1000) / 1000;
        });
    }

    @Restart()
    async onTestGPSButtonTap(args: EventData): Promise<void> {
        // More details here: https://github.com/NativeScript/nativescript-geolocation
        await geolocation.enableLocationRequest(true);
        var enabled = await geolocation.isEnabled();
        if (!enabled) throw Error("GPS not enabled.");
        var location = await geolocation.getCurrentLocation({});
        this.log = "LOG: Latitude: " + location.latitude + ", Longitude: " + location.latitude;
    }

    @Restart()
    async onTestCameraButtonTap(args: EventData): Promise<void> {
        // More details here: https://github.com/nstudio/nativescript-camera-plus
        this.cameraEnabled = true;
        var cam = this._page.getViewById('camPlus');
        if(cam == null)
        {
            this.log = "NUUUUUUUUUUUUUUUUUUUL";
        }
        this.cameraManager.initCamera(cam, { height: 100 });
    }

    @Restart()
    async onTestSocketButtonTap(args: EventData): Promise<void> {
        // TODO: Fix socket issue
    }

    @Restart()
    async onTestWorkerButtonTap(args: EventData): Promise<void> {
        this.log = "LOG:";
        this.counterWorker.start({ x: 0 },
            result => this.log = this.log + " " + result.x + ";",
            error => this.log = " " + error);
    }

}

function Restart() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var context = this;
            var args = arguments;
            try {
                accelerometer.stopAccelerometerUpdates();
            } catch (error) { }
            context.log = null;
            context.cameraEnabled = false;
            // Dispose camera
            originalMethod.apply(context, args);
        };
        return descriptor;
    };
}