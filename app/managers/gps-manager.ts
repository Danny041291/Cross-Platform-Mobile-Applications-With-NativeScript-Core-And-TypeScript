import * as geolocation from 'nativescript-geolocation';
import { IGPSManager } from './interfaces/igps-manager';

export class GPSManager implements IGPSManager {

    public async getLocation(): Promise<geolocation.Location> {
        return new Promise(async (resolve, reject) => {
            try {
                await geolocation.enableLocationRequest(false);
                var enabled = await geolocation.isEnabled();
                if(!enabled) reject();
                var location = await geolocation.getCurrentLocation({});
                resolve(location);
            } catch (error) {
                reject(error);
            }
        });
    }

}