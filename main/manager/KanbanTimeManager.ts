import KanbanResponse, { KanbanDbItem } from "../model/KanbanItem";
import IKanbanDbService from "../service/IKanbanDbService";

export interface IKanbanTimeManager {
    handleChangeOfState: (prevItem: KanbanDbItem, currentItem: KanbanDbItem) => KanbanDbItem;
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
        this.#resetInProgressStartTime();
    }

    #resetInProgressStartTime() {
        const { error, data }: KanbanResponse<KanbanDbItem[]> = this.#kanbanDbService.getAllKanbanCards();
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
            this.#kanbanDbService.modifyKanbanCard(expiredKanbanItem);
        }

    }

    #getHoursDifference = (startTimestamp: number, endTimestamp: number) => {
        console.log("startTimestamp: ", startTimestamp);
        console.log("endTimestamp: ", endTimestamp);
        const milliseconds = endTimestamp - startTimestamp;
        return milliseconds / (1000 * 60 * 60);
    };

    handleChangeOfState = (prevItem: KanbanDbItem, currentItem: KanbanDbItem) => {
        const originalState = prevItem.status;
        const newState = currentItem.status;

        if (originalState !== newState) {

            if (originalState === IN_PROGRESS) {
                const originalDuration = currentItem.duration ?? 0;
                const newDuration = this.#getHoursDifference(prevItem.start, Date.now()) + originalDuration;
                currentItem.duration = newDuration;
            } else if (newState === IN_PROGRESS) {
                currentItem.start = Date.now();
            }

        }
        return currentItem;

    }

}