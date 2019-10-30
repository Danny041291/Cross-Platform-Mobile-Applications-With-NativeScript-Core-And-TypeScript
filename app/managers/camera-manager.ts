import { CameraPlus } from '@nstudio/nativescript-camera-plus';
import { ICameraManager } from './interfaces/icamera-manager';

export class CameraManager implements ICameraManager {

    private _cam: CameraPlus;

    public initCamera(cam: CameraPlus): void {
        this._cam = cam;
    }

    public async startRecordingVideo(saveToGallery: boolean): Promise<void> {
        if (this._cam == null) return;
        await this._cam.requestVideoRecordingPermissions();
        this._cam.record({ saveToGallery: saveToGallery });
    }

    public stopRecordingVideo(): void {
        if (this._cam == null) return;
        this._cam.stop();
    }

    public toggleFlash(): void {
        if (this._cam == null) return;
        this._cam.toggleFlash();
    }

    public toggleCamera(): void {
        if (this._cam == null) return;
        this._cam.toggleCamera();
    }

    public async takePhoto(saveToGallery: boolean): Promise<void> {
        if (this._cam == null) return;
        await this._cam.requestCameraPermissions();
        this._cam.takePicture({ saveToGallery: saveToGallery });
    }

}