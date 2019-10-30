import { IoCContainer } from "./ioc-container";
import "reflect-metadata";

export function Injectable(target: any, propertyKey: string) {
    var type = Reflect.getMetadata("design:type", target, propertyKey);
    Object.defineProperty(target, propertyKey, {
        get() {
            if (this["_" + propertyKey] == null)
                this["_" + propertyKey] = IoCContainer.get(type);
            return this["_" + propertyKey];
        }
    });
}