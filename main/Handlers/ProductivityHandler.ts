import CommunicationEvents from "../../renderer/types/CommunicationEvent";
import ICommunicationService from "../service/ICommunicationService";
import IKanbanDbService from "../service/IKanbanDbService";
import IProductivityService from "../service/IProductivityService";
import ITimeTrackerDbService from "../service/ITimeTrackerService";
import ExpiryHandler from "./ExpiryHandler";
import Handler from "./Handler";

let instance: ProductivityHandler = null;
export default class ProductivityHandler implements Handler {
    #productivityService: IProductivityService;
    #commsService: ICommunicationService;
    #kanbanDbService: IKanbanDbService;
    #timeTrackerService: ITimeTrackerDbService;

    constructor(productivityService: IProductivityService, commsService: ICommunicationService,
        kanbanDbService: IKanbanDbService, timeTrackerService: ITimeTrackerDbService) {

        if (instance === null) {
            this.#productivityService = productivityService;
            this.#commsService = commsService;
            this.#kanbanDbService = kanbanDbService;
            this.#timeTrackerService = timeTrackerService;
            instance = this;
        }

        return instance;
    }

    execute(): void {
        this.#commsService.getRequest(CommunicationEvents.getProductivity, () => {
            (new ExpiryHandler(this.#productivityService, this.#kanbanDbService, this.#timeTrackerService)).execute();
            return this.#productivityService.get(this.#kanbanDbService.getUpdatedCards())
        });
    }






}