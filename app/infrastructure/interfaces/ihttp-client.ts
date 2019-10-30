export interface IHttpClient {

    put<T>(url: string, content: any, headers?: any): Promise<T>;

    get<T>(url: string, headers?: any): Promise<T>;

    post<T>(url: string, content: any, headers?: any): Promise<T>;

    delete(url: string, headers?: any): Promise<void>;

}