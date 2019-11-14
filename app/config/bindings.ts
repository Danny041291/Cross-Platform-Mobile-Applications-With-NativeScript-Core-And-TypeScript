import { HttpClient } from "~/infrastructure/http-client";
import { Storage } from "~/infrastructure/storage";
import { CameraManager } from "~/managers/camera-manager";
import { IoCContainer } from "~/infrastructure/ioc-container";
import { Encryptor } from "~/infrastructure/encryptor";
import * as CryptoJS from "crypto-js";
import { GPSManager } from "~/managers/gps-manager";
import { AccelerometerManager } from "~/managers/accelerometer-manager";
import { SocketManager } from "~/managers/socket-manager";
import { EventDispatcher } from "~/services/event-dispatcher";
import { LoginService } from "~/services/login-service";

export class Bindings {

    public static bind(): void {
        IoCContainer.bind(Encryptor, new Encryptor(CryptoJS.AES));
        IoCContainer.register(EventDispatcher);
        IoCContainer.register(HttpClient);
        IoCContainer.register(Storage);
        IoCContainer.register(CameraManager);
        IoCContainer.register(GPSManager);
        IoCContainer.register(AccelerometerManager);
        IoCContainer.register(SocketManager); 
        IoCContainer.register(LoginService);
    }

}