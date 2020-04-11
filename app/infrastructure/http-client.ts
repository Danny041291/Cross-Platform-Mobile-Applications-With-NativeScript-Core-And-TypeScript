import { IHttpClient } from "./interfaces/ihttp-client";
import environment from "~/environments/environment";
import { UserDto, User } from "~/models/user";
import { request } from "tns-core-modules/http";
import { IBuildable } from "./interfaces/ibuildable";

export class HttpClient implements IHttpClient {

    private user: User;

    public setAuthenticationUser(user: User) : void {
        this.user = user;
    }

    public removeAuthenticationUser() : void {
        this.user = null;
    }

    async put<T extends IBuildable>(type: (new () => T), url: string, content: any, headers?: any): Promise<T> {
        var req = request({
            url: url,
            method: "PUT",
            headers: this.getHeaders(headers),
            content: typeof content === "string" ? content : JSON.stringify(content)
        });
        return this.fetchResponse<T>(type, req);
    }

    async get<T extends IBuildable>(type: (new () => T), url: string, headers?: any): Promise<T> {
        var req = request({
            url: url,
            method: "GET",
            headers: this.getHeaders(headers),
        });
        return this.fetchResponse<T>(type, req);
    }

    async post<T extends IBuildable>(type: (new () => T), url: string, content: any, headers?: any): Promise<T> {
        var req = request({
            url: url,
            method: "POST",
            headers: this.getHeaders(headers),
            content: typeof content === "string" ? content : JSON.stringify(content)
        });
        return this.fetchResponse<T>(type, req);
    }

    async delete(url: string, headers?: any): Promise<void> {
        var request = request({
            url: url,
            method: "DELETE",
            headers: this.getHeaders(headers),
        });
        return this.fetchResponse<any>(null, request);
    }

    private getHeaders(headers?: any): any {
        headers = headers != null ? headers : { 'Content-Type': 'application/json' };
        if (this.user && this.user.isLogged) headers['Authorization'] = `Bearer ${this.user.token}`;
        return headers;
    }

    private async fetchResponse<T extends IBuildable>(type: (new () => T), req: any): Promise<T> {
        return new Promise(async (resolve, reject) => {
            var response = await req;
            if (response.statusCode >= 400) {
                if (response.statusCode == 401) {
                    if(!this.user || !this.user.isLogged) reject("Unauthorized.");
                    else {
                        await this.refreshToken();
                        response = await req;
                        if (response.statusCode == 401) reject("Unauthorized.");
                        else {
                            if(!type) resolve();
                            else {
                                var obj = new type();
                                obj.build(response.content.toJSON());
                                resolve(obj);
                            }
                        }
                    }
                } else reject(response.statusCode);
            } else {
                if(!type) resolve();
                else {
                    var obj = new type();
                    obj.build(response.content.toJSON());
                    resolve(obj);
                }
            }
        });
    }

    private async refreshToken(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let body = `client_id=${environment.current.clientId}&client_secret=${environment.current.clientSecret}&grant_type=refresh_token&refresh_token="${this.user.refreshToken}"`;
            let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            var user = await this.post(UserDto, `${environment.current.tokenEndPoint}`, body, headers);
            if (user == null) reject();
            this.user.build(user);
            resolve();
        });
    }

}