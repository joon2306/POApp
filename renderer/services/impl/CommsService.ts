import ICommsService from "../ICommsService";

let commsService = null;
export default class CommsService implements ICommsService {

    constructor() {
        if (commsService === null) {
            commsService = this;
        }
        return commsService;
    }

    sendRequest<R>(event: string, ...args: any[]): Promise<R> {
        const sendEvent = `send-${event}`;
        const receivedEvent = `received-${event}`;
        window.ipc.send(sendEvent, args);
        return new Promise((resolve, reject) => {
            window.ipc.on(receivedEvent, (arg: R) => {
                resolve(arg);
            });

            setTimeout(() => reject("Request timed out"), 300000);
        });

    }

}