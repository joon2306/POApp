import GenericResponse from "../model/GenericResponse";
import { KanbanDbItem } from "../model/KanbanItem";
import ProductivityDbItem from "../model/ProductivityDbItem";
import IKanbanDbService from "../service/IKanbanDbService";
import ProductivityDbService from "../service/impl/ProductivityDbService";
import IProductivityDbService from "../service/IProductivityDbService";
import getTimeUtils from "../utils/TimeUtils";

export interface IKanbanTimeManager {
    handleChangeOfState: (prevItem: KanbanDbItem, currentItem: KanbanDbItem) => KanbanDbItem;

    handleDelete: (kanbanItem: KanbanDbItem) => KanbanDbItem;

    getExpiredKanbans: (kanbanCards: KanbanDbItem[]) => KanbanDbItem[];

    updateInProgress: (kanbanCards: KanbanDbItem[]) => KanbanDbItem[];
}

const IN_PROGRESS = 2;
let instance: KanbanTimeManager = null;
export default class KanbanTimeManager implements IKanbanTimeManager {

    #startOfDay = null;

    constructor() {
        if (instance === null) {
            this.#startOfDay = getTimeUtils().startOfDay;
            instance = this;
        }
        return instance;
    }

    getExpiredKanbans(kanbanCards: KanbanDbItem[]) {
        return kanbanCards.filter(item => item.status === IN_PROGRESS && item.start && item.start < this.#startOfDay)
        .map(expiredKanbanItem => {
            expiredKanbanItem.duration = 0;
            expiredKanbanItem.start = Date.now();
            return expiredKanbanItem;
        })
    }

    updateInProgress(kanbanCards: KanbanDbItem[]) {
        return kanbanCards.filter(item => item.status === IN_PROGRESS)
        .map(inprogress => {
            inprogress.duration = this.#getUpdatedDuration(inprogress);
            return inprogress;
        })
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
        kanbanItem.duration = duration;
        return kanbanItem;
        
    }

}