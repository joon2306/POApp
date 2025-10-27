import CommunicationEvents from "../../renderer/types/CommunicationEvent";
import ICommunicationService from "../service/ICommunicationService";
import IKanbanDbService from "../service/IKanbanDbService";
import IProductivityService from "../service/IProductivityService";
import Handler from "./Handler";

let instance: ProductivityHandler = null;
export default class ProductivityHandler implements Handler {
    #productivityService: IProductivityService;
    #commsService: ICommunicationService;
    #kanbanDbService: IKanbanDbService;

    constructor(productivityService: IProductivityService, commsService: ICommunicationService, kanbanDbService: IKanbanDbService) {

        if (instance === null) {
            this.#productivityService = productivityService;
            this.#commsService = commsService;
            this.#kanbanDbService = kanbanDbService;
            instance = this;
        }

        return instance;
    }

    execute(): void {
        this.#commsService.getRequest(CommunicationEvents.getProductivity, () => {
            this.#productivityService.handleExpired();
            return this.#productivityService.get(this.#kanbanDbService.getInProgressCards())
    });
    }






}