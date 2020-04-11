import { Storable } from "~/infrastructure/storable";

export class Settings extends Storable<Settings> {

    /* Define your application settings here */

    protected load(settings?: Settings) : void {
        // Set the application settings values here
    }

}