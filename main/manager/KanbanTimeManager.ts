import GenericDbResponse from "../model/DbItem";
import  { KanbanDbItem } from "../model/KanbanItem";
import IKanbanDbService from "../service/IKanbanDbService";

export interface IKanbanTimeManager {
    handleChangeOfState: (prevItem: KanbanDbItem, currentItem: KanbanDbItem) => KanbanDbItem;

    handleDelete: (kanbanItem: KanbanDbItem) => void;
}

const IN_PROGRESS = 2;
export default class KanbanTimeManager implements IKanbanTimeManager {

    #startOfDay = null;
    #kanbanDbService: IKanbanDbService = null;

    constructor(kanbanDbService: IKanbanDbService) {
        const getStartOfDay = () => {
            const timeAt6 = new Date();
            timeAt6.setHours(6, 0, 0, 0);
            return timeAt6.getTime();
        }

        this.#startOfDay = getStartOfDay();
        this.#kanbanDbService = kanbanDbService;
        this.#resetStartTime();
    }

    #resetStartTime() {
        const { error, data }: GenericDbResponse<KanbanDbItem[]> = this.#kanbanDbService.getAll();
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

    #getHoursDifference = (startTimestamp: number, endTimestamp: number) => {
        console.log("startTimestamp: ", startTimestamp);
        console.log("endTimestamp: ", endTimestamp);
        const milliseconds = endTimestamp - startTimestamp;
        return milliseconds / (1000 * 60 * 60);
    };

    #getUpdatedDuration = (kanbanItem: KanbanDbItem): number => {
        const originalDuration = kanbanItem.duration ?? 0;
        return this.#getHoursDifference(kanbanItem.start, Date.now()) + originalDuration;
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

    }

}