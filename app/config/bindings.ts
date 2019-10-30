import { HttpClient } from "~/infrastructure/http-client";
import { Storage } from "~/infrastructure/storage";
import { Settings } from "../models/settings";
import { Encryptor } from "~/infrastructure/encryptor";
import * as CryptoJS from "crypto-js";
import { User } from "~/models/user";
import { AccelerometerManager } from "~/managers/accelerometer-manager";
import { CameraManager } from "~/managers/camera-manager";
import { GPSManager } from "~/managers/gps-manager";
import { SocketManager } from "~/managers/socket-manager";
import { IoCContainer } from "~/infrastructure/ioc-container";

const SETTINGS_STORAGE_KEY = "_SETTINGS_";
const USER_STORAGE_KEY = "_USER_";

export class Bindings {

    public static bind(): void {
        IoCContainer.bind(Encryptor, new Encryptor(CryptoJS.AES));
        IoCContainer.register(HttpClient);
        IoCContainer.register(Storage);
        IoCContainer.bind(Settings, new Settings(SETTINGS_STORAGE_KEY));
        IoCContainer.bind(User, new User(USER_STORAGE_KEY));
        IoCContainer.register(AccelerometerManager);
        IoCContainer.register(CameraManager);
        IoCContainer.register(GPSManager); 
        //IoCContainer.register(SocketManager); 
    }

}