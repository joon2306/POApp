import { KanbanCardType, KanbanFormValue, KanbanStatus, PriorityLevel } from "../../types/KanbanTypes";
import { IKanbanService } from "../IKanbanService";
import CommsService from "./CommsService";
import ICommsService from "../ICommsService";
import CommunicationEvents from "../../types/CommunicationEvent";

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
            this.cachedCards = await this.commsService.sendRequest<KanbanCardType[]>(CommunicationEvents.getKanbanCards, null);
        }
        return this.cachedCards;
    }

    deleteKanbanCards(cardId: string): void {
        this.cachedCards = this.cachedCards.filter(c => c.id !== cardId);
        this.commsService.sendRequest(CommunicationEvents.deleteKanbanCard, cardId);
    }

    modifyKanbanCard({ title, description, priority, id }: KanbanFormValue, status: number | undefined) {
        const selectedCard = this.cachedCards.find(c => c.id === id);
        if (!status) {
            status = selectedCard.status;
        }

        if (!selectedCard) {
            throw new Error("Kanban item not found to update");
        }

        Object.assign(selectedCard, { title, description, priority: priority as unknown as PriorityLevel, status });
        this.commsService.sendRequest(CommunicationEvents.modifyKanbanCard, selectedCard);
    }

    addKanbanCard({ title, description, priority }: KanbanFormValue) {
        const id = `${this.cachedCards.length + 2}`;
        const status = 1;
        const kanbanCard: KanbanCardType = {
            id,
            title,
            description,
            priority: priority as unknown as PriorityLevel,
            status
        }

        this.cachedCards.push(kanbanCard);
        this.commsService.sendRequest(CommunicationEvents.saveKanbanCard, kanbanCard);
    }

}
