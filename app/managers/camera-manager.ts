import { CameraPlus, ICameraOptions, IChooseOptions } from '@nstudio/nativescript-camera-plus';
import { ICameraManager } from './interfaces/icamera-manager';
import { LiteEvent } from '~/infrastructure/lite-event';

export class CameraManager implements ICameraManager {

    private cam: CameraPlus;
    private cameraOptions: ICameraOptions;
    private chooseOptions: IChooseOptions;
    private isRecordingVideo: boolean;

    public readonly onError = new LiteEvent<any>();
    public readonly onCameraToggle = new LiteEvent<any>();
    public readonly onPhotoCaptured = new LiteEvent<any>();
    public readonly onImageSelected = new LiteEvent<any>();
    public readonly onVideoRecordingReady = new LiteEvent<any>();
    public readonly onVideoRecordingStarted = new LiteEvent<any>();
    public readonly onVideoRecordingFinished = new LiteEvent<any>();

    get hasVideoRecordingPermission(): boolean {
        return this.cam != null && this.cam.hasVideoRecordingPermissions();
    }

    get hasCameraPermission(): boolean {
        return this.cam != null && this.cam.hasCameraPermission();
    }

    get hasAudioPermission(): boolean {
        return this.cam != null && this.cam.hasAudioPermission();
    }

    get hasStoragePermissions(): boolean {
        return this.cam != null && this.cam.hasStoragePermissions();
    }

    get isEnabled(): boolean {
        return this.cam != null && this.cam.isEnabled;
    }

    set isEnabled(isEnabled: boolean) {
        this.cam.isEnabled = isEnabled;
    }

    public initCamera(cameraView: any, cameraOptions: ICameraOptions, chooseOptions: IChooseOptions, showInsetIcons: boolean = false): void {
        this.cam = cameraView as CameraPlus;
        this.cam.showCaptureIcon = showInsetIcons;
        this.cam.showFlashIcon = showInsetIcons;
        this.cam.showToggleIcon = showInsetIcons;
        this.cam.showGalleryIcon = showInsetIcons;
        this.cam.on(CameraPlus.errorEvent, (payload) => this.onError.trigger(payload));
        this.cam.on(CameraPlus.toggleCameraEvent, (payload) => this.onCameraToggle.trigger(payload));
        this.cam.on(CameraPlus.photoCapturedEvent, (payload) => this.onPhotoCaptured.trigger(payload));
        this.cam.on(CameraPlus.imagesSelectedEvent, (payload) => this.onImageSelected.trigger(payload));
        this.cam.on(CameraPlus.videoRecordingReadyEvent, (payload) => this.onVideoRecordingReady.trigger(payload));
        this.cam.on(CameraPlus.videoRecordingStartedEvent, (payload) => this.onVideoRecordingStarted.trigger(payload));
        this.cam.on(CameraPlus.videoRecordingFinishedEvent, (payload) => this.onVideoRecordingFinished.trigger(payload));
        this.cameraOptions = cameraOptions;
        this.chooseOptions = chooseOptions;
    }

    public async getVideoRecordingPermissions(): Promise<boolean> {
        return this.cam.requestVideoRecordingPermissions();
    }

    public async getCameraPermissions(): Promise<boolean> {
        return this.cam.requestCameraPermissions();
    }

    public async getStoragePermissions(): Promise<boolean> {
        return this.cam.requestStoragePermissions();
    }

    public async getAudioPermissions(): Promise<boolean> {
        return this.cam.requestAudioPermissions();
    }

    public async startRecordingVideo(): Promise<void> {
        if (this.cam == null) throw Error("Camera not initialized.");
        if (!this.hasVideoRecordingPermission) throw Error("You need to get the video recording permissions before.");
        if (!this.hasAudioPermission) throw Error("You need to get the audio permissions before.");
        if (!this.hasStoragePermissions) throw Error("You need to get the storage permissions before.");
        if (this.isRecordingVideo) throw Error("Video recording alreay started");
        this.isRecordingVideo = true;
        return this.cam.record(this.cameraOptions);
    }

    public stopRecordingVideo(): void {
        if (this.cam == null) throw Error("Camera not initialized.");
        if (!this.isRecordingVideo) throw Error("No video recording started.");
        this.cam.stop();
        this.isRecordingVideo = false;
    }

    public toggleFlash(): void {
        if (this.cam == null) throw Error("Camera not initialized.");
        if(this.cam.hasFlash()) this.cam.toggleFlash();
    }

    public toggleCamera(): void {
        if (this.cam == null) throw Error("Camera not initialized.");
        this.cam.toggleCamera();
    }

    public takePhoto(): void {
        if (this.cam == null) throw Error("Camera not initialized.");
        if (!this.hasCameraPermission) throw Error("You need to get the camera permissions before.");
        if (!this.hasStoragePermissions) throw Error("You need to get the storage permissions before.");
        this.cam.takePicture(this.cameraOptions);
    }

    public async openGallery(): Promise<any> {
        if (this.cam == null) throw Error("Camera not initialized.");
        if (!this.hasStoragePermissions) throw Error("You need to get the storage permissions before.");
        return this.cam.chooseFromLibrary(this.chooseOptions);
    }

    public dispose(): void {
        if (this.cam == null) throw Error("Camera not initialized.");
        this.cam.disposeNativeView();
    }

}