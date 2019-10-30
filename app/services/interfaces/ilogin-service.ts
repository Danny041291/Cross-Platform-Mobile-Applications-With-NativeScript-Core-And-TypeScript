
export interface ILoginService {

    login(username: string, password: string, rememberMe: boolean): Promise<void>;

    logout(): void;

}