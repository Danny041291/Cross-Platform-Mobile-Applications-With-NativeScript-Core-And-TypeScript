import { Injectable } from "~/infrastructure/injectable-decorator";
import { Settings } from "~/models/settings";
import { STORAGE_KEYS } from "~/config/enums";
import { Storage } from "~/infrastructure/storage";
import environment from "~/environments/environment";
import { ISettingsService } from "./interfaces/isettings-service";

// Use this service to acces to the application settings
export class SettingsService implements ISettingsService {

    @Injectable
    storage: Storage;
  
    public settings: Settings;
  
    constructor() {
      this.settings = new Settings(this.storage, STORAGE_KEYS.SETTINGS, environment.current.clientSecret, false);
    }

    public save() : void {
      this.settings.update();
    }

}