import { IHttpClient } from "./interfaces/ihttp-client";
import { User } from "~/models/user";
import { environment } from "~/environments/environment";
import { Injectable } from "./injectable-decorator";
import { LoginService } from "~/services/login-service";

export class HttpClient implements IHttpClient {

    @Injectable
    loginService: LoginService;

    async put<T>(url: string, content: any, headers?: any): Promise<T> {
        var request = request({
            url: url,
            method: "PUT",
            headers: this.getHeaders(headers),
            content: JSON.stringify(content)
        });
        return this.fetchResponse<T>(request);
    }

    async get<T>(url: string, headers?: any): Promise<T> {
        var request = request({
            url: url,
            method: "GET",
            headers: this.getHeaders(headers),
        });
        return this.fetchResponse<T>(request);
    }

    async post<T>(url: string, content: any, headers?: any): Promise<T> {
        var request = request({
            url: url,
            method: "POST",
            headers: this.getHeaders(headers),
            content: JSON.stringify(content)
        });
        return this.fetchResponse<T>(request);
    }

    async delete(url: string, headers?: any): Promise<void> {
        var request = request({
            url: url,
            method: "DELETE",
            headers: this.getHeaders(headers),
        });
        return this.fetchResponse<void>(request);
    }

    private getHeaders(headers?: any): any {
        headers = headers != null ? headers : { 'Content-Type': 'application/json' };
        if (this.loginService.user.isLogged)
            headers['Authorization'] = `Bearer ${this.loginService.user.token}`;
        return headers;
    }

    private async fetchResponse<T>(request: any): Promise<T> {
        return new Promise(async (resolve, reject) => {
            var response = await request;
            if (response.statusCode == 401) {
                await this.refreshToken();
                response = await request;
                if (response.statusCode == 401)
                    reject("Unauthorized.");
                else resolve(response.content.toJSON());
            } else resolve(response.content.toJSON());
        });
    }

    private async refreshToken(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let body = `refreshToken="${this.loginService.user.refreshToken}"&clientId=${environment.clientId}&clientSecret=${environment.clientSecret}`;
            let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
            var user = await this.post<User>(`${environment.refreshTokenUrl}`, body, this.getHeaders(headers));
            if (user == null) reject();
            this.loginService.user.token = user.token;
            this.loginService.user.refreshToken = user.refreshToken;
            this.loginService.user.update();
            resolve();
        });
    }

}