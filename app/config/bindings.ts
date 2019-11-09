import { HttpClient } from "~/infrastructure/http-client";
import { Storage } from "~/infrastructure/storage";
import { Encryptor } from "~/infrastructure/encryptor";
import * as CryptoJS from "crypto-js";
import { CameraManager } from "~/managers/camera-manager";
import { IoCContainer } from "~/infrastructure/ioc-container";
import { CounterWorker } from "~/workers/counter-worker";

export class Bindings {

    public static bind(): void {
        IoCContainer.bind(Encryptor, new Encryptor(CryptoJS.AES));
        IoCContainer.register(HttpClient);
        IoCContainer.register(Storage);
        IoCContainer.register(CameraManager);
        //IoCContainer.register(SocketManager); 
        IoCContainer.register(CounterWorker);
    }

}