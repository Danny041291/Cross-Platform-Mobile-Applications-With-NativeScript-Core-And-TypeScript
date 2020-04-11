import { HttpClient } from "~/infrastructure/http-client";
import { Storage } from "~/infrastructure/storage";
import { CameraManager } from "~/managers/camera-manager";
import { IoCContainer } from "~/infrastructure/ioc-container";
import { Encryptor } from "~/infrastructure/encryptor";
import * as CryptoJS from "crypto-js";
import { GPSManager } from "~/managers/gps-manager";
import { AccelerometerManager } from "~/managers/accelerometer-manager";
import { SocketManager } from "~/managers/socket-manager";
import { GlobalEventsDispatcher } from "~/infrastructure/global-events-dispatcher";
import { LoginService } from "~/services/login-service";
import { Logger } from "~/infrastructure/logger";
import { EVENTS } from "./enums";
import { IdentityService } from "~/services/identity-service";

export class Bindings {

    public static bind(): void {
        IoCContainer.register(Logger);
        IoCContainer.bind(Encryptor, new Encryptor(CryptoJS.AES));
        IoCContainer.bind(GlobalEventsDispatcher, this.GetGlobalEventsDispatcher());
        IoCContainer.register(HttpClient);
        IoCContainer.register(Storage);
        IoCContainer.register(CameraManager);
        IoCContainer.register(GPSManager);
        IoCContainer.register(AccelerometerManager);
        IoCContainer.register(LoginService);
        IoCContainer.register(SocketManager); 
        IoCContainer.register(IdentityService);
    }

    /* Register here your globals events */
    private static GetGlobalEventsDispatcher() : GlobalEventsDispatcher {
        var globalsEventsDispather = new GlobalEventsDispatcher();
        globalsEventsDispather.addEvent(EVENTS.TOGGLE_MENU);
        return globalsEventsDispather;
    }

}