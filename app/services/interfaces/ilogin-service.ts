import { LiteEvent } from "~/infrastructure/lite-event";

export interface ILoginService {

    onUserLogin : LiteEvent<void>;
    onUserLogout : LiteEvent<void>;

    login(username: string, password: string, rememberMe: boolean): Promise<void>;

    logout(): void;

}