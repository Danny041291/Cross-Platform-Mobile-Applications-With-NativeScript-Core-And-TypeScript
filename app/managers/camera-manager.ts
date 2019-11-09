import { CameraPlus, ICameraOptions } from '@nstudio/nativescript-camera-plus';
import { ICameraManager } from './interfaces/icamera-manager';
import { LiteEvent } from '~/infrastructure/lite-event';

export class CameraManager implements ICameraManager {

    private _cam: CameraPlus;

    private readonly onError = new LiteEvent<any>();
    private readonly onCameraToggle = new LiteEvent<any>();
    private readonly onPhotoCaptured = new LiteEvent<any>();
    private readonly onImageSelected = new LiteEvent<any>();
    private readonly onVideoRecordingReady = new LiteEvent<any>();
    private readonly onVideoRecordingStarted = new LiteEvent<any>();
    private readonly onVideoRecordingFinished = new LiteEvent<any>();

    public options: ICameraOptions;

    get isEnabled(): boolean {
        return this._cam != null && this._cam.isEnabled;
    }

    set isEnabled(isEnabled: boolean) {
        this._cam.isEnabled = isEnabled;
    }

    public initCamera(cameraView: any, options: ICameraOptions): void {
        this._cam = cameraView as CameraPlus;
        this._cam.on(CameraPlus.errorEvent, this.onError.trigger);
        this._cam.on(CameraPlus.toggleCameraEvent, this.onCameraToggle.trigger);
        this._cam.on(CameraPlus.photoCapturedEvent, this.onPhotoCaptured.trigger);
        this._cam.on(CameraPlus.imagesSelectedEvent, this.onImageSelected.trigger);
        this._cam.on(CameraPlus.videoRecordingReadyEvent, this.onVideoRecordingReady.trigger);
        this._cam.on(CameraPlus.videoRecordingStartedEvent, this.onVideoRecordingStarted.trigger);
        this._cam.on(CameraPlus.videoRecordingFinishedEvent, this.onVideoRecordingFinished.trigger);
        this.options = options;
    }

    public async startRecordingVideo(saveToGallery: boolean): Promise<void> {
        if (this._cam == null) throw Error("Camera not initialized.");
        await this._cam.requestVideoRecordingPermissions();
        this._cam.record({ saveToGallery: saveToGallery });
    }

    public stopRecordingVideo(): void {
        if (this._cam == null) throw Error("Camera not initialized.");
        this._cam.stop();
    }

    public toggleFlash(): void {
        if (this._cam == null) throw Error("Camera not initialized.");
        this._cam.toggleFlash();
    }

    public toggleCamera(): void {
        if (this._cam == null) throw Error("Camera not initialized.");
        this._cam.toggleCamera();
    }

    public async takePhoto(saveToGallery: boolean): Promise<void> {
        if (this._cam == null) throw Error("Camera not initialized.");
        await this._cam.requestCameraPermissions();
        this._cam.takePicture({ saveToGallery: saveToGallery });
    }

    public dispose(): void {
        if (this._cam == null) throw Error("Camera not initialized.");
        this._cam.disposeNativeView();
    }

}