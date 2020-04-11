import { Storable } from "~/infrastructure/storable";
import { IBuildable } from "~/infrastructure/interfaces/ibuildable";

export class IdentityDto implements IBuildable {

    public username: string;
    public allowed: boolean;
    public roles: string[];

    build(data: any): void {
        this.username = data.username ? data.username : '';
        this.allowed = data.allowed ? data.allowed : false;
        this.roles = data.roles ? data.roles : [];
    }
    
}

export class Identity extends Storable<Identity> {

    public username: string;
    public allowed: boolean;
    public roles: string[];

    protected load(identity?: Identity): void {
        this.username = identity ? identity.username : '';
        this.allowed = identity ? identity.allowed : false;
        this.roles = identity && identity.roles ? identity.roles: [];
    }

    public build(identity : IdentityDto) : void {
        this.username = identity.username ? identity.username : '';
        this.allowed = identity.allowed ? identity.allowed : false;
        this.roles = identity.roles ? identity.roles: [];
        this.update();
    }

}