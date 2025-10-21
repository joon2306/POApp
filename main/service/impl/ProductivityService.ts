import { KanbanDbItem } from "../../model/KanbanItem";
import Productivity, { CompletedTask, Task } from "../../model/Productivity";
import ProductivityDbItem from "../../model/ProductivityDbItem";
import getTimeUtils from "../../utils/TimeUtils";
import IKanbanDbService from "../IKanbanDbService";
import IProductivityDbService from "../IProductivityDbService";
import IProductivityService from "../IProductivityService";

let instance: ProductivityService = null;
export default class ProductivityService implements IProductivityService {

    #productivityDbService: IProductivityDbService = null;
    #kanbanDbService: IKanbanDbService = null;

    constructor(productivityDbService: IProductivityDbService, kanbanDbService: IKanbanDbService) {
        if (instance === null) {
            this.#productivityDbService = productivityDbService;
            this.#kanbanDbService = kanbanDbService;
            instance = this;
        }
        return instance;
    }

    #getTaskProductivity(dbItem: KanbanDbItem | ProductivityDbItem) {
        return dbItem.time / dbItem.duration;
    }

    #getTimeSpent(): Pick<Productivity, "timeRemaining" | "timeConsumed"> {
        const now = Date.now();
        const { startOfDay, lunchTime, toMinutes} = getTimeUtils();
        const isMorning = now < lunchTime;
        let timeConsumed = toMinutes(now - startOfDay);
        if (!isMorning) {
            timeConsumed = timeConsumed - 60;
        }
        return { timeConsumed, timeRemaining: (7 * 60) - timeConsumed };
    }

    #calculateProductivity(completedTasks: CompletedTask[], timeConsumed: number): Pick<Productivity, "taskProductivity" | "overallProductivity"> {
        const [sumTimePlanned, sumTimeSpent] = completedTasks.reduce((accumulator, completedTask) => {
            const timePlanned = completedTask.time;
            const timeSpent = completedTask.duration;
            return [accumulator[0] + timePlanned, accumulator[1] + timeSpent];
        }, [0, 0]);

        const taskProductivity = sumTimePlanned / sumTimeSpent;

        const overallProductivity = timeConsumed / sumTimeSpent;

        return { taskProductivity, overallProductivity };


    }

    getProductivity(): Productivity {
        const inProgressStatus = 2;
        const { error: productivityErr, data: productivityItems } = this.#productivityDbService.getAll();
        const { error: kanbanErr, data: kanbanItems } = this.#kanbanDbService.getAll();

        const inProgressTasks: Task[] = !kanbanErr ? kanbanItems.filter(item => item.status === inProgressStatus)
            .map(item => {
                return { duration: item.duration, productivity: this.#getTaskProductivity(item), start: item.start, title: item.title };
            }) : [];

        const completedTasks: CompletedTask[] = !productivityErr ? productivityItems.map(item => {
            return {
                duration: item.duration, productivity: this.#getTaskProductivity(item), start: item.start, title: item.title,
                completed: item.deleted, time: item.time
            };
        }) : [];

        const { timeConsumed, timeRemaining } = this.#getTimeSpent();
        const { taskProductivity, overallProductivity } = this.#calculateProductivity(completedTasks, timeConsumed);

        return {
            completedTasks,
            inProgressTasks,
            overallProductivity,
            taskProductivity,
            timeConsumed,
            timeRemaining
        }
    }

}