import { Observable, EventData } from "tns-core-modules/data/observable";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { Injectable } from "~/infrastructure/injectable-decorator";
import { ObservableProperty } from "~/infrastructure/observable-property-decorator";
import { LocalNotifications } from "nativescript-local-notifications";
import { CameraManager } from "~/managers/camera-manager";
import { Page } from "tns-core-modules/ui/page/page";
import { CounterWorker } from "~/workers/counter-worker";
import { Toasty } from 'nativescript-toasty';
import { GPSManager } from "~/managers/gps-manager";
import { AccelerometerManager } from "~/managers/accelerometer-manager";
import { SocketManager } from "~/managers/socket-manager";
import { File, knownFolders } from "tns-core-modules/file-system";
import { environment } from "~/environments/environment";

export class HomeViewModel extends Observable {

    @Injectable
    cameraManager: CameraManager;

    @Injectable
    counterWorker: CounterWorker;

    @Injectable
    gpsManager: GPSManager;

    @Injectable
    accelerometerManager: AccelerometerManager;

    @Injectable
    socketManager: SocketManager;

    @ObservableProperty() log: string;
    @ObservableProperty() cameraEnabled: boolean;
    @ObservableProperty() cameraHeight: number;

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
        this.accelerometerManager.startDataReading((data) => {
            this.log = "LOG: X: " + Math.round(data.x * 1000) / 1000 + ", Y: " + Math.round(data.y * 1000) / 1000 + ", Z: " + Math.round(data.z * 1000) / 1000;
        });
    }

    @Restart()
    async onTestGPSButtonTap(args: EventData): Promise<void> {
        // More details here: https://github.com/NativeScript/nativescript-geolocation
        var hasPermission = await this.gpsManager.getPermissions();
        if (hasPermission) {
            var location = await this.gpsManager.getLocation();
            this.log = "LOG: Latitude: " + location.latitude + ", Longitude: " + location.latitude;
        } else this.log = "LOG: Error during localization permissions request.";
    }

    @Restart()
    async onTestCameraButtonTap(args: EventData): Promise<void> {
        // More details here: https://github.com/nstudio/nativescript-camera-plus
        var cameraOptions = { height: 400, saveToGallery: false };
        var chooseOptions = { showImages: true, showVideos: true, height: 300 };
        this.cameraEnabled = true;
        this.cameraHeight = cameraOptions.height;
        this.cameraManager.initCamera(this._page.getViewById('camPlus'), cameraOptions, chooseOptions, false);
        var hasCameraPermission = await this.cameraManager.getCameraPermissions().then();
        if (!hasCameraPermission) {
            this.log = "LOG: Error during localization permissions request.";
            return;
        }
        var hasVideoRecordingPermission = await this.cameraManager.getVideoRecordingPermissions();
        if (!hasVideoRecordingPermission) {
            this.log = "LOG: Error during video recording permissions request.";
            return;
        }
        var hasAudioPermission = await this.cameraManager.getAudioPermissions();
        if (!hasAudioPermission) {
            this.log = "LOG: Error during audio permissions request.";
            return;
        }
        var hasStoragePermission = await this.cameraManager.getStoragePermissions();
        if (!hasStoragePermission) {
            this.log = "LOG: Error during storage permissions request.";
            return;
        }
    }

    async startRecordingVideo(args: EventData): Promise<void> {
        this.log = "LOG: Video recording started.";
        return this.cameraManager.startRecordingVideo();
    }

    stopRecordingVideo(args: EventData): void {
        this.cameraManager.stopRecordingVideo();
        this.log = "LOG: Video recording stopped.";
    }

    takePhoto(args: EventData): void {
        this.cameraManager.takePhoto();
        this.log = "LOG: Camera photo taked.";
    }

    toggleFlash(args: EventData): void {
        this.cameraManager.toggleFlash();
        this.log = "LOG: Flash toggled.";
    }

    toggleCamera(args: EventData): void {
        this.cameraManager.toggleCamera();
        this.log = "LOG: Camera toggled.";
    }

    async openGallery(args: EventData): Promise<any> {
        await this.cameraManager.openGallery();
        this.log = "LOG: Element choosed from gallery.";
    }

    @Restart()
    async onTestSocketButtonTap(args: EventData): Promise<void> {
        // More details here: https://github.com/triniwiz/nativescript-socketio
        //var url = "http://192.168.1.5:8080";
        var url = environment.socketUrl;
        this.log = "LOG: Connecting to '" + url + "' ...";
        this.socketManager.onMessage.on((payload) => this.log = `LOG: Message '${payload.content}' received from ${payload.username}.`);
        this.socketManager.onConnect.on((payload) => {
            this.log = "LOG: Connected, sending message..."
            this.socketManager.sendMessage("my self", "Hello!");
        });
        this.socketManager.connect(url);
    }

    @Restart()
    async onTestWorkerButtonTap(args: EventData): Promise<void> {
        /* this.log = "LOG:";
         this.counterWorker.start({ x: 0 },
             result => this.log = this.log + " " + result.x + ";",
             error => this.log = " " + error);*/
        console.log("HERE!!!");
        if (File.exists((knownFolders.currentApp().getFile("workers/grayscaler.js").path))) console.log("EXISTS!!!");
        var x = (knownFolders.currentApp().getFile("workers/grayscaler.js").path);
        console.log(x);
        var worker = new Worker(x);
        worker.postMessage("Ts worker loader executed!");
        // worker.onmessage = m => this.logWorkerMessage(m);
    }

}

function Restart() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            var context = this;
            var args = arguments;
            if (context.accelerometerManager.isRunning)
                context.accelerometerManager.stopDataReading();
            if (context.socketManager.isConnected)
                context.socketManager.disconnect();
            context.cameraEnabled = false;
            context.log = null;
            originalMethod.apply(context, args);
        };
        return descriptor;
    };
}