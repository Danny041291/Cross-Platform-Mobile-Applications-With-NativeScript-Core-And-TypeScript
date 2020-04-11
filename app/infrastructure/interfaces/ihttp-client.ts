import { User } from "~/models/user";
import { IBuildable } from "./ibuildable";

export interface IHttpClient {

    setAuthenticationUser(user: User) : void;

    removeAuthenticationUser() : void;

    put<T extends IBuildable>(type: (new () => T), url: string, content: any, headers?: any): Promise<T>;

    get<T extends IBuildable>(type: (new () => T), url: string, headers?: any): Promise<T>;

    post<T extends IBuildable>(type: (new () => T), url: string, content: any, headers?: any): Promise<T>;

    delete(url: string, headers?: any): Promise<void>;

}