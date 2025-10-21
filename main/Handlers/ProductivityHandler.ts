import CommunicationEvents from "../../renderer/types/CommunicationEvent";
import ICommunicationService from "../service/ICommunicationService";
import IProductivityService from "../service/IProductivityService";

let instance: ProductivityHandler = null;
export default class ProductivityHandler {
    #productivityService: IProductivityService;
    #commsService: ICommunicationService;

    constructor(productivityService: IProductivityService, commsService: ICommunicationService) {

        if (instance === null) {
            this.#productivityService = productivityService;
            this.#commsService = commsService;
            this.#getProductivity();
            instance = this;
        }

        return instance;
    }

    #getProductivity(): void {
        const productivity = this.#productivityService.getProductivity();
        this.#commsService.getRequest(CommunicationEvents.getProductivity, () => productivity);
    }






}