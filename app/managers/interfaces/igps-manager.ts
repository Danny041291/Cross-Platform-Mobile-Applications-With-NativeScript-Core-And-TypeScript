import * as geolocation from 'nativescript-geolocation';

export interface IGPSManager {

    getLocation() : Promise<geolocation.Location>;

}