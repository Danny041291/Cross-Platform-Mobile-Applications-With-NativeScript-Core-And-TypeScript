import { Storable } from "~/infrastructure/storable";

export class Settings extends Storable<Settings> {

    // Define application settings here

    protected load(settings: Settings) : void {
        // Set application settings here
    }

}