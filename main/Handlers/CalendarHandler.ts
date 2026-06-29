import CommunicationEvents from "../../renderer/types/CommunicationEvent";
import ICommunicationService from "../service/ICommunicationService";
import ICalendarStatusManager from "../service/ICalendarStatusManager";
import Handler from "./Handler";

export default class CalendarHandler implements Handler {
    constructor(
        private readonly commsService: ICommunicationService,
        private readonly calendarStatusManager: ICalendarStatusManager,
    ) {}

    execute(): void {
        this.commsService.getRequest(
            CommunicationEvents.calendarGetStatus,
            () => this.calendarStatusManager.getLast(),
        );
    }
}
