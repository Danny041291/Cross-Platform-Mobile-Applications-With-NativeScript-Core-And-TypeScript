import * as geolocation from 'nativescript-geolocation';

export interface IGPSManager {

    hasPermission: boolean;

    getPermissions(): Promise<boolean>;
    
    getLocation() : Promise<geolocation.Location>;

}