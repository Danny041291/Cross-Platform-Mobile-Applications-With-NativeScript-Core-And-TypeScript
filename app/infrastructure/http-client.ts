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
        var options = {
            url: url,
            method: "PUT",
            headers: this.getHeaders(headers),
            content: typeof content === "string" ? content : JSON.stringify(content)
        };
        var req = request(options);
        return this.fetchResponse<T>(type, req, options);
    }

    async get<T extends IBuildable>(type: (new () => T), url: string, headers?: any): Promise<T> {
        var options = {
            url: url,
            method: "GET",
            headers: this.getHeaders(headers),
        };
        var req = request(options);
        return this.fetchResponse<T>(type, req, options);
    }

    async post<T extends IBuildable>(type: (new () => T), url: string, content: any, headers?: any): Promise<T> {
        var options = {
            url: url,
            method: "POST",
            headers: this.getHeaders(headers),
            content: typeof content === "string" ? content : JSON.stringify(content)
        };
        var req = request(options);
        return this.fetchResponse<T>(type, req, options);
    }

    async delete(url: string, headers?: any): Promise<void> {
        var options = {
            url: url,
            method: "DELETE",
            headers: this.getHeaders(headers),
        };
        var req = request(options);
        return this.fetchResponse<any>(null, req, options);
    }

    private getHeaders(headers?: any): any {
        headers = headers != null ? headers : { 'Content-Type': 'application/json' };
        if (this.user && this.user.isLogged) headers['Authorization'] = `Bearer ${this.user.token}`;
        return headers;
    }

    private async fetchResponse<T extends IBuildable>(type: (new () => T), req: any, opts: any): Promise<T> {
        return new Promise(async (resolve, reject) => {
            var res = await req;
            if (res.statusCode < 400) {
                if(!type) resolve();
                else {
                    var obj = new type();
                    obj.build(res.content.toJSON());
                    resolve(obj);
                }
            } else {
                if (res.statusCode != 401) reject(res.statusCode);
                else {
                    if(!this.user || !this.user.isLogged) reject("Unauthorized.");
                    else {
                        await this.refreshToken();
                        res = await request({
                            url: opts.url,
                            method: opts.method,
                            headers: this.getHeaders(opts.headers),
                            content: opts.content
                        });
                        if (res.statusCode >= 400) 
                            reject(res.statusCode == 401 ? "Unauthorized." : res.statusCode);
                        else {
                            if(!type) resolve();
                            else {
                                var obj = new type();
                                obj.build(res.content.toJSON());
                                resolve(obj);
                            }
                        }
                    }
                }
            }
        });
    }

    private async refreshToken(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let body = `client_id=${environment.current.clientId}&client_secret=${environment.current.clientSecret}&grant_type=refresh_token&refresh_token=${this.user.refreshToken}`;
            let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            var user = await this.post(UserDto, `${environment.current.tokenEndPoint}`, body, headers);
            if (user == null) reject();
            else {
                this.user.build(user);
                resolve();
            }
        });
    }

}