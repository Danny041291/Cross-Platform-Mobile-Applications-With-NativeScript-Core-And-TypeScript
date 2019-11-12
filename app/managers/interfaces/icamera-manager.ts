import { CameraPlus, ICameraOptions, IChooseOptions } from "@nstudio/nativescript-camera-plus";
import { LiteEvent } from "~/infrastructure/lite-event";

export interface ICameraManager {

    onError: LiteEvent<any>;
    onCameraToggle: LiteEvent<any>;
    onPhotoCaptured: LiteEvent<any>;
    onImageSelected: LiteEvent<any>;
    onVideoRecordingReady: LiteEvent<any>;
    onVideoRecordingStarted: LiteEvent<any>;
    onVideoRecordingFinished: LiteEvent<any>;

    hasVideoRecordingPermission: boolean;
    hasCameraPermission: boolean;
    hasAudioPermission: boolean;
    hasStoragePermissions: boolean;
    isEnabled: boolean;

    getVideoRecordingPermissions(): Promise<boolean>;

    getCameraPermissions(): Promise<boolean>;

    getStoragePermissions(): Promise<boolean>;
    
    getAudioPermissions(): Promise<boolean>;

    initCamera(cam: CameraPlus, camerOptions: ICameraOptions, chooseOptions: IChooseOptions, showInsetIcons: boolean): void;

    startRecordingVideo(): Promise<void>;

    stopRecordingVideo(): void;

    toggleFlash(): void;

    toggleCamera(): void;

    takePhoto(): void;

    openGallery(): Promise<any>;

    dispose(): void;

}