import Productivity from "../../../main/model/Productivity";
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
        //return await this.#commsService.sendRequest<Productivity>(CommunicationEvents.getProductivity, null);
        const mockProductivity: () => Productivity = () => {
            return {
                completedTasks: [],
                inProgressTasks: [],
                overallProductivity: 0.88,
                taskProductivity: 0.92,
                timeConsumed: 330,
                timeRemaining: 150
            };
        }
        return Promise.resolve(mockProductivity());
    }

}