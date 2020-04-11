import { ILoginService } from "./interfaces/ilogin-service";
import { User, UserDto } from "~/models/user";
import { Injectable } from "~/infrastructure/injectable-decorator";
import { Storage } from "~/infrastructure/storage";
import { HttpClient } from "~/infrastructure/http-client";
import { LiteEvent } from "~/infrastructure/lite-event";
import { STORAGE_KEYS } from "~/config/enums";
import environment from "~/environments/environment";

export class LoginService implements ILoginService {

  @Injectable
  httpClient: HttpClient;

  @Injectable
  storage: Storage;

  public readonly onUserLogin = new LiteEvent<void>();
  public readonly onUserLogout = new LiteEvent<void>();

  public user: User;

  constructor() {
    this.user = new User(this.storage, STORAGE_KEYS.USER, environment.current.clientSecret, false);
  }

  public async login(username: string, password: string, rememberMe: boolean) : Promise<void> {
    return new Promise(async (resolve, reject) => {
      var body = `username=${username}&password=${password}&client_id=${environment.current.clientId}&grant_type=auth_token`;
      var headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      var user : UserDto;
      try {
        user = await this.httpClient.post(UserDto, `${environment.current.tokenEndPoint}`, body, headers);
      } catch(error) {
        reject(error);
        return;
      }
      this.user = new User(this.storage, STORAGE_KEYS.USER, environment.current.clientSecret, !rememberMe);
      this.user.build(user);
      this.httpClient.setAuthenticationUser(this.user);
      this.onUserLogin.trigger();
      resolve();
    });
    
  }

  public logout(): void {
    this.user.delete();
    this.httpClient.removeAuthenticationUser();
    this.onUserLogout.trigger();
  }

}