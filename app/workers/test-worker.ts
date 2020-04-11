import "globals";

const context: Worker = self as any;

context.onmessage = message => {
    setTimeout(() => {
        (<any>global).postMessage("Message received: " + message.data + "");
    }, 500)
};