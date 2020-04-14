import { LoginService } from "~/services/login-service";
import { Storage } from "~/infrastructure/storage";
import { HttpClient } from "~/infrastructure/http-client";
import { IoCContainer } from "~/infrastructure/ioc-container";
import { Encryptor } from "~/infrastructure/encryptor";
import * as CryptoJS from "crypto-js";
import { UserDto } from "~/models/user";

// More details here: https://docs.nativescript.org/tooling/testing/testing
describe("Login Service", () => {

    let httpClient: HttpClient;
    let storage: Storage;
    let loginService: LoginService;

    beforeEach(() => {
        IoCContainer.bind(Encryptor, new Encryptor(CryptoJS.AES));
        httpClient = new HttpClient();
        IoCContainer.bind(HttpClient, httpClient);
        storage = new Storage();
        IoCContainer.bind(Storage, storage);
        loginService = new LoginService();
    });

    it("Should update the user after the login", async () => {
        var user = new UserDto();
        user.username = "Username";
        user.token  = "4q9jgK66Ex7rbpmSgLah5dSRPL67RsneBTBD";
        user.refresh_token  = "GWazMBLRfPUAfejTkgM8YjJC753yfSwwvXZW";
        spyOn(httpClient, 'post').and.returnValue(Promise.resolve(user));
        await loginService.login("Username", "Password", true);
        expect(loginService.user.username).toEqual("Username");
        expect(loginService.user.isLogged).toEqual(true);
        expect(loginService.user.token).toEqual("4q9jgK66Ex7rbpmSgLah5dSRPL67RsneBTBD");
        expect(loginService.user.refreshToken).toEqual("GWazMBLRfPUAfejTkgM8YjJC753yfSwwvXZW");
    });

    it("Should clean the user after the logout", async () => {
        var user = new UserDto();
        user.username = "Username";
        user.token  = "4q9jgK66Ex7rbpmSgLah5dSRPL67RsneBTBD";
        user.refresh_token  = "GWazMBLRfPUAfejTkgM8YjJC753yfSwwvXZW";
        spyOn(httpClient, 'post').and.returnValue(Promise.resolve(user));
        await loginService.login("Username", "Password", true);
        expect(loginService.user.username).toEqual("Username");
        loginService.logout();
        expect(loginService.user.username).toEqual("");
    });

});  