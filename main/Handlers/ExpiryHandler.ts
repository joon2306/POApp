import IKanbanDbService from "../service/IKanbanDbService";
import IProductivityService from "../service/IProductivityService";
import getTimeUtils from "../utils/TimeUtils";
import Handler from "./Handler";

let instance: ExpiryHandler = null;
export default class ExpiryHandler implements Handler {

    #expired: { cleared: boolean, timestamp: number | null };
    #productivityService: IProductivityService;
    #kanbanDbService: IKanbanDbService;

    constructor(productivityService: IProductivityService, kanbanDbService: IKanbanDbService) {
        if (instance === null) {
            this.#expired = { cleared: false, timestamp: null };
            this.#productivityService = productivityService;
            this.#kanbanDbService = kanbanDbService;
            instance = this;
        }
        return instance;
    }


    execute(): void {
        const startOfDay = getTimeUtils().startOfDay;
        if (this.#expired.cleared && this.#expired.timestamp > startOfDay) {
            console.log("expired items have already been handled.");
            return;
        }

        this.#productivityService.handleExpired();
        this.#kanbanDbService.resetToDoCards();

        this.#expired.cleared = true;
        this.#expired.timestamp = Date.now();

    }

}