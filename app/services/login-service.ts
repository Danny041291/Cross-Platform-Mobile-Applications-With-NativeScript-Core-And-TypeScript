import { ILoginService } from "./interfaces/ilogin-service";
import { User } from "~/models/user";
import { environment } from "~/environments/environment";
import { Injectable } from "~/infrastructure/injectable-decorator";
import { USER_STORAGE_KEY } from "~/config/constant";
import { Storage } from "~/infrastructure/storage";
import { HttpClient } from "~/infrastructure/http-client";

export class LoginService implements ILoginService {

  @Injectable
  httpClient: HttpClient;

  @Injectable
  storage: Storage;

  private _user: User;

  constructor() {
    this._user = new User(this.storage, USER_STORAGE_KEY);
  }

  get user() {
    return this._user;
  }

  public async login(username: string, password: string, rememberMe: boolean): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        let body = `username=${username}&password=${password}&clientId=${environment.clientId}`;
        let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
        var user = await this.httpClient.post<User>(`${environment.loginUrl}`, body, headers);
        if (user == null) reject("Login error.");
        this._user = new User(this.storage, USER_STORAGE_KEY, !rememberMe);
        this._user.username = username;
        this._user.token = user.token;
        this._user.refreshToken = user.refreshToken;
        this._user.update();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  public logout(): void {
    this._user.delete();
  }

}