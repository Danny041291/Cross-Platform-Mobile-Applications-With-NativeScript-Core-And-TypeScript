import { Observable, EventData } from "tns-core-modules/data/observable";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { Injectable } from "~/infrastructure/injectable-decorator";
import { ObservableProperty } from "~/infrastructure/observable-property-decorator";
import { LocalNotifications } from "nativescript-local-notifications";
import { CameraManager } from "~/managers/camera-manager";
import { Page } from "tns-core-modules/ui/page/page";
import * as TestWorker from "nativescript-worker-loader!../../workers/test-worker";
import { Toasty } from 'nativescript-toasty';
import { GPSManager } from "~/managers/gps-manager";
import { AccelerometerManager } from "~/managers/accelerometer-manager";
import { SocketManager } from "~/managers/socket-manager";
import environment from "~/environments/environment";

export class HomeViewModel extends Observable {

    @Injectable
    cameraManager: CameraManager;

    @Injectable
    gpsManager: GPSManager;

    @Injectable
    accelerometerManager: AccelerometerManager;

    @Injectable
    socketManager: SocketManager;

    @ObservableProperty() out: string;
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
        this.out = "Dialog closed."
    }

    @Restart()
    onTestToastButtonTap(args: EventData): void {
        // More details at: https://github.com/triniwiz/nativescript-toasty
        const toast = new Toasty({ text: 'Toast message' });
        toast.show();
        this.out = "Toast shown."
    }

    @Restart()
    async onTestNotificationButtonTap(args: EventData): Promise<void> {
        // More details at: https://github.com/EddyVerbruggen/nativescript-local-notifications
        var hasPermission = await LocalNotifications.hasPermission();
        if (!hasPermission) throw Error("No permissions for local notifications");
        var scheduled = await LocalNotifications.schedule([{
            id: 1,
            title: 'Title',
            body: 'Body',
            groupedMessages: ["First", "Second..."],
            groupSummary: "Group summary"
        }]);
        this.out = "Notification '" + scheduled[0] + "' shown.";
    }

    @Restart()
    async onTestAccelerometerButtonTap(args: EventData): Promise<void> {
        // More details at: https://github.com/vakrilov/native-script-accelerometer
        this.accelerometerManager.startDataReading((data) => {
            this.out = "X: " + Math.round(data.x * 1000) / 1000 + ", Y: " + Math.round(data.y * 1000) / 1000 + ", Z: " + Math.round(data.z * 1000) / 1000;
        });
    }

    @Restart()
    async onTestGPSButtonTap(args: EventData): Promise<void> {
        // More details at: https://github.com/NativeScript/nativescript-geolocation
        var hasPermission = await this.gpsManager.getPermissions();
        if (hasPermission) {
            var location = await this.gpsManager.getLocation();
            this.out = "Latitude: " + location.latitude + ", Longitude: " + location.latitude;
        } else this.out = "Error during the localization permissions request.";
    }

    @Restart()
    async onTestCameraButtonTap(args: EventData): Promise<void> {
        // More details at: https://github.com/nstudio/nativescript-camera-plus
        var cameraOptions = { height: 400, saveToGallery: false };
        var chooseOptions = { showImages: true, showVideos: true, height: 300 };
        this.cameraEnabled = true;
        this.cameraHeight = cameraOptions.height;
        this.cameraManager.initCamera(this._page.getViewById('camPlus'), cameraOptions, chooseOptions, false);
        var hasCameraPermission = await this.cameraManager.getCameraPermissions();
        if (!hasCameraPermission) {
            this.out = "Error during the camera permissions request.";
            return;
        }
        var hasVideoRecordingPermission = await this.cameraManager.getVideoRecordingPermissions();
        if (!hasVideoRecordingPermission) {
            this.out = "Error during the video recording permissions request.";
            return;
        }
        var hasAudioPermission = await this.cameraManager.getAudioPermissions();
        if (!hasAudioPermission) {
            this.out = "Error during the audio permissions request.";
            return;
        }
        var hasStoragePermission = await this.cameraManager.getStoragePermissions();
        if (!hasStoragePermission) {
            this.out = "Error during the storage permissions request.";
            return;
        }
    }

    async startRecordingVideo(args: EventData): Promise<void> {
        this.out = "Video recording started.";
        return this.cameraManager.startRecordingVideo();
    }

    stopRecordingVideo(args: EventData): void {
        this.cameraManager.stopRecordingVideo();
        this.out = "Video recording stopped.";
    }

    takePhoto(args: EventData): void {
        this.cameraManager.takePhoto();
        this.out = "Camera photo taken.";
    }

    toggleFlash(args: EventData): void {
        this.cameraManager.toggleFlash();
        this.out = "Flash toggled.";
    }

    toggleCamera(args: EventData): void {
        this.cameraManager.toggleCamera();
        this.out = "Camera toggled.";
    }

    async openGallery(args: EventData): Promise<any> {
        await this.cameraManager.openGallery();
        this.out = "Element chosen from gallery.";
    }

    @Restart()
    async onTestSocketButtonTap(args: EventData): Promise<void> {
        // More details at: https://github.com/triniwiz/nativescript-socketio
        this.out = "Connecting to socket...";
        this.socketManager.onMessage.on((payload) => {
            var from = this.socketManager.users.find(u => u.socketId == payload.from);
            this.out = `Message '${payload.message}' received from '${from ? from.username : 'undefined'}'.`;
        });
        this.socketManager.onConnect.on((payload) => this.out = "Connected!");
        this.socketManager.onUsersList.on((users) => {
            this.out = "Sending message..."
            this.socketManager.sendMessage(users[0].socketId, "Hello!");
        });
        this.socketManager.connect(environment.current.socketURL);
    }

    @Restart()
    async onTestWorkerButtonTap(args: EventData): Promise<void> {
        // More details at: https://github.com/NativeScript/worker-loader
        const worker = new TestWorker();
        worker.postMessage("Hello from Worker!");
        worker.onmessage = message => this.out = message.data;
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