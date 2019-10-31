import { CameraPlus } from "@nstudio/nativescript-camera-plus";

export interface ICameraManager {

    initCamera(cam: CameraPlus) : void;

    startRecordingVideo(saveToGallery: boolean) : Promise<void>;

    stopRecordingVideo() : void;

    toggleFlash() : void;

    toggleCamera() : void;

    takePhoto(saveToGallery: boolean) : Promise<void>;

    dispose(): void;

}