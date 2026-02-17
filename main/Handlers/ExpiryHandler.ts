import IKanbanDbService from "../service/IKanbanDbService";
import IProductivityService from "../service/IProductivityService";
import ITimeTrackerDbService from "../service/ITimeTrackerService";
import getTimeUtils from "../utils/TimeUtils";
import Handler from "./Handler";

let instance: ExpiryHandler = null;
export default class ExpiryHandler implements Handler {

    #productivityService: IProductivityService;
    #kanbanDbService: IKanbanDbService;
    #timeTrackerService: ITimeTrackerDbService;

    constructor(productivityService: IProductivityService,
        kanbanDbService: IKanbanDbService, timeTrackerService: ITimeTrackerDbService) {
        if (instance === null) {
            this.#productivityService = productivityService;
            this.#kanbanDbService = kanbanDbService;
            this.#timeTrackerService = timeTrackerService;
            instance = this;
        }
        return instance;
    }


    execute(): void {

        console.log("timeTracker: ", this.#timeTrackerService);

        if (this.#timeTrackerService.hasTracked()) {
            return;
        }

        this.#productivityService.handleExpired();
        this.#kanbanDbService.resetToDoCards();
        this.#timeTrackerService.track();

    }

}