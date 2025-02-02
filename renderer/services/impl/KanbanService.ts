import { mock } from "node:test";
import { KanbanCardType, KanbanFormValue, KanbanStatus, PriorityLevel } from "../../types/KanbanTypes";
import { IKanbanService } from "../IKanbanService";
import CommsService from "./CommsService";
import ICommsService from "../ICommsService";

let kanbanService: KanbanService = null;

export class KanbanService implements IKanbanService {

    private commsService: ICommsService = null;
    private cachedCards: KanbanCardType[] = [];

    constructor() {
        if (kanbanService == null) {
            this.commsService = new CommsService();
            kanbanService = this;
        }

        return kanbanService;
    }

    async getKanbanCards(): Promise<KanbanCardType[]> {
        if (this.cachedCards.length === 0) {
            this.cachedCards = await this.commsService.sendRequest<KanbanCardType[]>("kanban-cards", null);
        }
        return this.cachedCards;
    }

    async deleteKanbanCards(cardId: string): Promise<void> {
        this.cachedCards = this.cachedCards.filter(c => c.id !== cardId);
    }

    async modifyKanbanCard({ title, description, priority, id }: KanbanFormValue) {
        const selectedCard = this.cachedCards.find(c => c.id === id);

        if (!selectedCard) {
            throw new Error("Kanban item not found to update");
        }

        Object.assign(selectedCard, { title, description, priority: priority as unknown as PriorityLevel });
    }

    async addKanbanCard({ title, description, priority }: KanbanFormValue) {
        const id = `${this.cachedCards.length + 1}`;
        const kanbanCard: KanbanCardType = {
            id,
            title,
            description,
            priority: priority as unknown as PriorityLevel,
            status: 1
        }

        this.cachedCards.push(kanbanCard);
    }

}
