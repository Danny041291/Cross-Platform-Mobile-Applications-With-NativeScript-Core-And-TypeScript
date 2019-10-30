export class IoCContainer {

    private static _container: Map<string, any> = new Map<string, any>();

    public static register<T>(type: (new () => T)) : void {
        this._container.set(type.name, new type());
    }

    public static bind(type: Function, target: Object) : void {
        this._container.set(type.name, target);
    }

    public static get(type: Function) : any {
        return this._container.get(type.name);
    }

}