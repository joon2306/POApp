import { ipcMain } from "electron";
import ICommunicationService from "../ICommunicationService";

let commsService = null;
export default class CommsService implements ICommunicationService {

    constructor() {
        if (commsService === null) {
            commsService = this;
        }
        return commsService;
    }

    getRequest(event: string, callback: (arg: unknown) => unknown): void {
        const sendEvent = `send-${event}`;
        const receivedEvent = `received-${event}`;
        ipcMain.on(sendEvent, (event, input) => {
            const output = callback(input);
            event.reply(receivedEvent, output);
        });
    }

}