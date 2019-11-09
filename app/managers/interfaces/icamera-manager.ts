import { CameraPlus, ICameraOptions } from "@nstudio/nativescript-camera-plus";

export interface ICameraManager {

    isEnabled: boolean;

    initCamera(cam: CameraPlus, options: ICameraOptions) : void;

    startRecordingVideo(saveToGallery: boolean) : Promise<void>;

    stopRecordingVideo() : void;

    toggleFlash() : void;

    toggleCamera() : void;

    takePhoto(saveToGallery: boolean) : Promise<void>;

    dispose(): void;

}