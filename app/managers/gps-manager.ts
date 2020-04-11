import * as geolocation from 'nativescript-geolocation';
import { IGPSManager } from './interfaces/igps-manager';

export class GPSManager implements IGPSManager {

    public hasPermission: boolean;

    public async getPermissions(): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await geolocation.enableLocationRequest(false);
            var enabled = await geolocation.isEnabled();
            if (!enabled) reject("Errors during the localization permissions request.");
            else {
                this.hasPermission = true;
                resolve(true);
            }
        });
    }

    public async getLocation(): Promise<geolocation.Location> {
        return new Promise(async (resolve, reject) => {
            if (!this.hasPermission) 
                reject("You need to get the localization permissions before.");
            else {
                var location = await geolocation.getCurrentLocation({});
                resolve(location);
            }
        });
    }

}