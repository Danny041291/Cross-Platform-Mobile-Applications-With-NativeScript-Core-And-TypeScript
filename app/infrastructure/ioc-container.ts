export class IoCContainer {

    private static container: Map<string, any> = new Map<string, any>();

    public static register<T>(type: (new () => T)) : void {
        this.container.set(type.name, new type());
    }

    public static bind(type: Function, target: Object) : void {
        this.container.set(type.name, target);
    }

    public static get(type: Function) : any {
        return this.container.get(type.name);
    }

}