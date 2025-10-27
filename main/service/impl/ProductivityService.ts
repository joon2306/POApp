import { KanbanDbItem } from "../../model/KanbanItem";
import Productivity, { CompletedTask, Task } from "../../model/Productivity";
import ProductivityDbItem from "../../model/ProductivityDbItem";
import NumberUtils from "../../utils/NumberUtils";
import getTimeUtils from "../../utils/TimeUtils";
import IKanbanDbService from "../IKanbanDbService";
import IProductivityDbService from "../IProductivityDbService";
import IProductivityService from "../IProductivityService";

let instance: ProductivityService = null;
export default class ProductivityService implements IProductivityService {

    #productivityDbService: IProductivityDbService = null;

    constructor(productivityDbService: IProductivityDbService) {
        if (instance === null) {
            this.#productivityDbService = productivityDbService;
            instance = this;
        }
        return instance;
    }


    #getTaskProductivity(dbItem: KanbanDbItem | ProductivityDbItem) {
        return isNaN(dbItem.time / dbItem.duration) ? 0 : dbItem.time / dbItem.duration;
    }

    #getTimeSpent(): Pick<Productivity, "timeRemaining" | "timeConsumed"> {
        const now = Date.now();
        const { startOfWork, lunchTime, toMinutes } = getTimeUtils();
        const isMorning = now < lunchTime;
        let timeConsumed = toMinutes(now - startOfWork);
        console.log("timeConsumed: ", timeConsumed);
        const fullDay = 7 * 60;
        if (timeConsumed > fullDay) {
            // out of working hours
            return { timeConsumed: fullDay, timeRemaining: 0 }
        }
        if (!isMorning) {
            timeConsumed = timeConsumed - 60;
        }
        return { timeConsumed, timeRemaining: (7 * 60) - timeConsumed };
    }

    #calculateDuration(initialTime: number) {
        const { toMinutes } = getTimeUtils();
        const now = Date.now();
        const duration = now - initialTime;
        return toMinutes(duration);
    }

    #calculateProductivity(completedTasks: CompletedTask[], timeConsumed: number): Pick<Productivity, "taskProductivity" | "overallProductivity"> {
        const [sumTimePlanned, sumTimeSpent] = completedTasks.reduce((accumulator, completedTask) => {
            const timePlanned = completedTask.time;
            const timeSpent = completedTask.duration;
            return [accumulator[0] + timePlanned, accumulator[1] + timeSpent];
        }, [0, 0]);
        if (sumTimePlanned === 0 || sumTimeSpent === 0) {
            return { taskProductivity: 0, overallProductivity: 0 };
        }

        const taskProductivity = isNaN(sumTimePlanned / sumTimeSpent)
            ? 0
            : sumTimePlanned / sumTimeSpent;

        const overallProductivity = isNaN(sumTimeSpent / timeConsumed)
            ? 0
            : sumTimeSpent / timeConsumed;

        return { taskProductivity: NumberUtils.of(taskProductivity).toFixed(2), overallProductivity: NumberUtils.of(overallProductivity).toFixed(2) };


    }

    get(inProgressCards: KanbanDbItem[]): Productivity {
        const { error: productivityErr, data: productivityItems } = this.#productivityDbService.getAll();

        const inProgressTasks: Task[] = inProgressCards
            .map(item => {
                return { duration: this.#calculateDuration(item.start), productivity: this.#getTaskProductivity(item), start: item.start, title: item.title, time: item.time };
            });

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

    add(deletedCard: KanbanDbItem): void {
        const productivityItem: ProductivityDbItem = {
            title: deletedCard.title,
            time: deletedCard.time,
            priority: deletedCard.priority,
            duration: deletedCard.duration,
            deleted: Date.now(),
            status: deletedCard.status,
            start: deletedCard.start
        };
        this.#productivityDbService.create(productivityItem);
    }

    handleExpired(): void {
        const { error, data } = this.#productivityDbService.getAll();
        if (error) {
            console.log("could not retrieve items. skipping clearing expired items");
            return;
        }

        const items = data as ProductivityDbItem[];
        const startOfDay = getTimeUtils().startOfDay;
        const expiredItems = items.filter(item => item.deleted && item.deleted < startOfDay);

        if (expiredItems.length > 0) {
            for (const item of expiredItems) {
                this.#productivityDbService.delete(item.id);
            }
        }
    }

}