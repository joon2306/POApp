import GenericResponse from "../model/GenericResponse";
import { KanbanDbItem } from "../model/KanbanItem";
import ProductivityDbItem from "../model/ProductivityDbItem";
import IKanbanDbService from "../service/IKanbanDbService";
import ProductivityDbService from "../service/impl/ProductivityDbService";
import IProductivityDbService from "../service/IProductivityDbService";
import getTimeUtils from "../utils/TimeUtils";

export interface IKanbanTimeManager {
    handleChangeOfState: (prevItem: KanbanDbItem, currentItem: KanbanDbItem) => KanbanDbItem;

    handleDelete: (kanbanItem: KanbanDbItem) => void;
}

const IN_PROGRESS = 2;
export default class KanbanTimeManager implements IKanbanTimeManager {

    #startOfDay = null;
    #kanbanDbService: IKanbanDbService = null;
    #productivityDbService: IProductivityDbService = null;

    constructor(kanbanDbService: IKanbanDbService) {
        this.#startOfDay = getTimeUtils().startOfDay;
        this.#kanbanDbService = kanbanDbService;
        this.#productivityDbService = new ProductivityDbService();
        this.#resetStartTime();
    }

    #resetStartTime() {
        const { error, data }: GenericResponse<KanbanDbItem[]> = this.#kanbanDbService.getAll();
        if (error) {
            console.error("failure to fetch in progress cards for resetting...");
            return;
        }

        const expiredInProgressItems = data.filter(item => item.status === IN_PROGRESS && item.start && item.start < this.#startOfDay);

        if (expiredInProgressItems.length === 0) {
            console.log("no expired in progress items");
            return;
        }
        for (const expiredKanbanItem of expiredInProgressItems) {
            console.log(`resetting timestamp for ${expiredKanbanItem.title}`);
            expiredKanbanItem.duration = 0;
            expiredKanbanItem.start = Date.now();
            this.#kanbanDbService.modify(expiredKanbanItem);
        }

    }

    #getDifferenceInMinutes = (startTimestamp: number, endTimestamp: number) => {
        const { toMinutes } = getTimeUtils();
        return toMinutes(endTimestamp - startTimestamp)
    };

    #getUpdatedDuration = (kanbanItem: KanbanDbItem): number => {
        const originalDuration = kanbanItem.duration ?? 0;
        return this.#getDifferenceInMinutes(kanbanItem.start, Date.now()) + originalDuration;
    }

    handleChangeOfState = (prevItem: KanbanDbItem, currentItem: KanbanDbItem) => {
        const originalState = prevItem.status;
        const newState = currentItem.status;

        if (originalState !== newState) {

            if (originalState === IN_PROGRESS) {
                currentItem.duration = this.#getUpdatedDuration(prevItem);
            } else if (newState === IN_PROGRESS) {
                currentItem.start = Date.now();
            }

        }
        return currentItem;

    }

    handleDelete = (kanbanItem: KanbanDbItem) => {
        const startTime = kanbanItem.start;
        if (!startTime) {
            console.log(`kanban ${kanbanItem.title} did not start. It won't be considered for productivity calcultation`);
            return;
        }

        if (startTime < this.#startOfDay) {
            console.log(`invalid item to be considered for productivity calculation`);
            return;
        }

        const duration = this.#getUpdatedDuration(kanbanItem);
        const productivityItem: ProductivityDbItem = {
            title: kanbanItem.title,
            time: kanbanItem.time,
            priority: kanbanItem.priority,
            duration: duration,
            deleted: Date.now(),
            status: kanbanItem.status,
            start: kanbanItem.start
        };
        this.#productivityDbService.create(productivityItem);
    }

}