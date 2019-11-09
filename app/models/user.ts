import { Storable } from "~/infrastructure/storable";

export class User extends Storable<User> {

    public username: string;
    public token: string;
    public refreshToken: string;

    get isLogged() {
        return this.token != "";
    }

    protected load(user: User) : void {
        this.username = user != null ? user.username : "";
        this.token = user != null ? user.token : "";
        this.refreshToken = user != null ? user.refreshToken : "";
    }

}