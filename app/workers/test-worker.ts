import "globals";

const context: Worker = self as any;

context.onmessage = message => {
    setTimeout(() => {
        (<any>global).postMessage("Hello from a worker, " + message.data + " !");
    }, 500)
};