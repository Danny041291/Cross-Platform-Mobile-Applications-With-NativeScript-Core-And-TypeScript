import { Identity, IdentityDto } from "~/models/identity";
import { Injectable } from "~/infrastructure/injectable-decorator";
import { HttpClient } from "~/infrastructure/http-client";
import { STORAGE_KEYS } from "~/config/enums";
import { Storage } from "~/infrastructure/storage";
import environment from "~/environments/environment";
import { LiteEvent } from "~/infrastructure/lite-event";
import { LoginService } from "./login-service";
import { IIdentitySrvice } from "./interfaces/iidentity-service";

export class IdentityService implements IIdentitySrvice {

  @Injectable
  httpClient: HttpClient;

  @Injectable
  storage: Storage;

  @Injectable
  loginService: LoginService;

  public readonly onIdentityLoaded = new LiteEvent<void>();
  public readonly onIdentityUnloaded = new LiteEvent<void>();

  public identity: Identity;

  constructor() {
    this.identity = new Identity(this.storage, STORAGE_KEYS.IDENTITY, environment.current.clientSecret, false);
  }

  public async loadIdentity(rememberMe: boolean): Promise<void> {
    return new Promise(async (resolve, reject) => {
      var identity = await this.httpClient.get(IdentityDto, environment.current.apiPath + '/v1/users/me');
      if (identity == null || !identity.allowed) reject("Forbidden.");
      this.identity = new Identity(this.storage, STORAGE_KEYS.IDENTITY, environment.current.clientSecret, !rememberMe);
      this.identity.build(identity);
      this.onIdentityLoaded.trigger();
      resolve();
    });
  }

  public unloadIdentity(): void {
    this.identity.delete();
    this.onIdentityUnloaded.trigger();
  }

}
