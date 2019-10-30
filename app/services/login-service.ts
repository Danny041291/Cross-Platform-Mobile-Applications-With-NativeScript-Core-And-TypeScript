import { HttpClient } from "~/infrastructure/http-client";
import { ILoginService } from "./interfaces/ilogin-service";
import { User } from "~/models/user";
import { environment } from "~/environments/environment";
import { Injectable } from "~/infrastructure/injectable-decorator";

export class LoginService implements ILoginService {

  @Injectable
  httpClient: HttpClient;

  @Injectable
  user: User;

  public async login(username: string, password: string, rememberMe: boolean): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        let body = `username=${username}&password=${password}&clientId=${environment.clientId}`;
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        var user = await this.httpClient.post<User>(`${environment.loginUrl}`, body, headers);
        if (user == null) reject("Login error.");
        this.user.setStorageMode(!rememberMe);
        this.user.username = username;
        this.user.token = user.token;
        this.user.refreshToken = user.refreshToken;
        this.user.update();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  public logout(): void {
    this.user.delete();
  }

}