import Productivity, { CompletedTask, Task } from "../../../main/model/Productivity";
import CommunicationEvents from "../../types/CommunicationEvent";
import ICommsService from "../ICommsService";
import IProductivityService from "../IProductivityService";

let instance: ProductivityService = null;
export default class ProductivityService implements IProductivityService {

    #commsService: ICommsService;

    constructor(commsService: ICommsService) {
        if (instance === null) {
            this.#commsService = commsService;
            instance = this;
        }
        return instance;
    }

    async getProductivity(): Promise<Productivity> {
        return await this.#commsService.sendRequest<Productivity>(CommunicationEvents.getProductivity, null);
    }

}