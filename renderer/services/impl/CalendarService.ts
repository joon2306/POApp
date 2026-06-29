import CommunicationEvents from "../../types/CommunicationEvent";
import { CalendarUpdate } from "../../types/CalendarTypes";
import CommsService from "./CommsService";

export default class CalendarService {
    private readonly commsService = new CommsService();

    getStatus(): Promise<CalendarUpdate | null> {
        return this.commsService.sendRequest<CalendarUpdate | null>(CommunicationEvents.calendarGetStatus, null);
    }

    subscribe(callback: (update: CalendarUpdate) => void): () => void {
        return window.ipc.on(CommunicationEvents.calendarUpdate, callback);
    }
}
