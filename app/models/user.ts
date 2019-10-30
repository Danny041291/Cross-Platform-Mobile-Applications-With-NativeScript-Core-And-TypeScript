import { Storable } from "~/infrastructure/storable";

export class User extends Storable<User> {

    // Define user properties here
    public username: string;
    public token: string;
    public refreshToken: string;
    public logged: boolean;

    protected load(user: User) : void {
        this.username = user != null ? user.username : "";
        this.token = user != null ? user.token : "";
        this.refreshToken = user != null ? user.refreshToken : "";
        this.logged = user != null;
    }

}