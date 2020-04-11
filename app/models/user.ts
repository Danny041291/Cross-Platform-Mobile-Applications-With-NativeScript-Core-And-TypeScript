import { Storable } from "~/infrastructure/storable";
import { IBuildable } from "~/infrastructure/interfaces/ibuildable";

export class UserDto implements IBuildable {

    public username: string;
    public token: string;
    public refresh_token: string;
    public rooms: string[];

    build(data: any): void {
        this.username = data.username ? data.username : "";
        this.token = data.token ? data.token : "";
        this.refresh_token = data.refresh_token ? data.refresh_token : "";
        this.rooms = data.rooms ? data.rooms : [];
    }
    
}

export class User extends Storable<User> {

    public username: string;
    public token: string;
    public refreshToken: string;
    public rooms: string[];

    protected load(user?: User) : void {
        this.username = user ? user.username : "";
        this.token = user ? user.token : "";
        this.refreshToken = user ? user.refreshToken : "";
        this.rooms = user && user.rooms ? user.rooms : [];
    }

    public build(user: UserDto) : void {
        this.username = user.username ? user.username : "";
        this.token = user.token ? user.token : "";
        this.refreshToken = user.refresh_token ? user.refresh_token : "";
        this.rooms = user.rooms ? user.rooms : [];
        this.update();
    }

    get isLogged() : boolean {
        return this.token != "";
    }

}