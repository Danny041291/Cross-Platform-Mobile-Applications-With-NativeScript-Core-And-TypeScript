import { CameraPlus, ICameraOptions, IChooseOptions } from '@nstudio/nativescript-camera-plus';
import { ICameraManager } from './interfaces/icamera-manager';
import { LiteEvent } from '~/infrastructure/lite-event';

export class CameraManager implements ICameraManager {

    private _cam: CameraPlus;
    private _cameraOptions: ICameraOptions;
    private _chooseOptions: IChooseOptions;
    private _isRecordingVideo: boolean;

    public readonly onError = new LiteEvent<any>();
    public readonly onCameraToggle = new LiteEvent<any>();
    public readonly onPhotoCaptured = new LiteEvent<any>();
    public readonly onImageSelected = new LiteEvent<any>();
    public readonly onVideoRecordingReady = new LiteEvent<any>();
    public readonly onVideoRecordingStarted = new LiteEvent<any>();
    public readonly onVideoRecordingFinished = new LiteEvent<any>();

    get hasVideoRecordingPermission(): boolean {
        return this._cam != null && this._cam.hasVideoRecordingPermissions();
    }

    get hasCameraPermission(): boolean {
        return this._cam != null && this._cam.hasCameraPermission();
    }

    get hasAudioPermission(): boolean {
        return this._cam != null && this._cam.hasAudioPermission();
    }

    get hasStoragePermissions(): boolean {
        return this._cam != null && this._cam.hasStoragePermissions();
    }

    get isEnabled(): boolean {
        return this._cam != null && this._cam.isEnabled;
    }

    set isEnabled(isEnabled: boolean) {
        this._cam.isEnabled = isEnabled;
    }

    public initCamera(cameraView: any, cameraOptions: ICameraOptions, chooseOptions: IChooseOptions, showInsetIcons: boolean = false): void {
        this._cam = cameraView as CameraPlus;
        this._cam.showCaptureIcon = showInsetIcons;
        this._cam.showFlashIcon = showInsetIcons;
        this._cam.showToggleIcon = showInsetIcons;
        this._cam.showGalleryIcon = showInsetIcons;
        this._cam.on(CameraPlus.errorEvent, (payload) => this.onError.trigger(payload));
        this._cam.on(CameraPlus.toggleCameraEvent, (payload) => this.onCameraToggle.trigger(payload));
        this._cam.on(CameraPlus.photoCapturedEvent, (payload) => this.onPhotoCaptured.trigger(payload));
        this._cam.on(CameraPlus.imagesSelectedEvent, (payload) => this.onImageSelected.trigger(payload));
        this._cam.on(CameraPlus.videoRecordingReadyEvent, (payload) => this.onVideoRecordingReady.trigger(payload));
        this._cam.on(CameraPlus.videoRecordingStartedEvent, (payload) => this.onVideoRecordingStarted.trigger(payload));
        this._cam.on(CameraPlus.videoRecordingFinishedEvent, (payload) => this.onVideoRecordingFinished.trigger(payload));
        this._cameraOptions = cameraOptions;
        this._chooseOptions = chooseOptions;
    }

    public async getVideoRecordingPermissions(): Promise<boolean> {
        return this._cam.requestVideoRecordingPermissions();
    }

    public async getCameraPermissions(): Promise<boolean> {
        return this._cam.requestCameraPermissions();
    }

    public async getStoragePermissions(): Promise<boolean> {
        return this._cam.requestStoragePermissions();
    }

    public async getAudioPermissions(): Promise<boolean> {
        return this._cam.requestAudioPermissions();
    }

    public async startRecordingVideo(): Promise<void> {
        if (this._cam == null) throw Error("Camera not initialized.");
        if (!this.hasVideoRecordingPermission) throw Error("You need to get the video recording permissions before.");
        if (!this.hasAudioPermission) throw Error("You need to get the audio permissions before.");
        if (!this.hasStoragePermissions) throw Error("You need to get the storage permissions before.");
        if (this._isRecordingVideo) throw Error("Video recording alreay started");
        this._isRecordingVideo = true;
        return this._cam.record(this._cameraOptions);
    }

    public stopRecordingVideo(): void {
        if (this._cam == null) throw Error("Camera not initialized.");
        if (!this._isRecordingVideo) throw Error("No video recording started.");
        this._cam.stop();
        this._isRecordingVideo = false;
    }

    public toggleFlash(): void {
        if (this._cam == null) throw Error("Camera not initialized.");
        this._cam.toggleFlash();
    }

    public toggleCamera(): void {
        if (this._cam == null) throw Error("Camera not initialized.");
        this._cam.toggleCamera();
    }

    public takePhoto(): void {
        if (this._cam == null) throw Error("Camera not initialized.");
        if (!this.hasCameraPermission) throw Error("You need to get the camera permissions before.");
        if (!this.hasStoragePermissions) throw Error("You need to get the storage permissions before.");
        this._cam.takePicture(this._cameraOptions);
    }

    public async openGallery(): Promise<any> {
        if (this._cam == null) throw Error("Camera not initialized.");
        if (!this.hasStoragePermissions) throw Error("You need to get the storage permissions before.");
        return this._cam.chooseFromLibrary(this._chooseOptions);
    }

    public dispose(): void {
        if (this._cam == null) throw Error("Camera not initialized.");
        this._cam.disposeNativeView();
    }

}