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
        //return await this.#commsService.sendRequest<Productivity>(CommunicationEvents.getProductivity, null);
        const mockProductivity: () => Productivity = () => {
            return {
                completedTasks: [
                    {
                        title: "Fix Login Bug",
                        start: 0,
                        duration: 90,
                        productivity:0,
                        time: 120,
                        completed: 0
                    },
                    {
                        title: "Database Migration",
                        start: 0,
                        duration: 180,
                        productivity:0,
                        time: 150,
                        completed: 0
                    },
                    {
                        title: "Team StandUp",
                        start: 0,
                        duration: 30,
                        productivity:0,
                        time: 15,
                        completed: 0
                    }

                ] as CompletedTask[],
                inProgressTasks: [
                    {
                        title: "Design API endpoints",
                        start: 0,
                        duration: 150,
                        productivity:0,
                        time: 120
                    }, {
                        title: "Code review PR #234",
                        start: 0,
                        duration: 30,
                        productivity:0,
                        time: 60
                    }, {
                        title: "Update documentation",
                        start: 0,
                        duration: 90,
                        productivity:0,
                        time: 180
                    }
                ] as Task[],
                overallProductivity: 0.88,
                taskProductivity: 0.92,
                timeConsumed: 330,
                timeRemaining: 150
            };
        }
        return Promise.resolve(mockProductivity());
    }

}