import { KanbanCardType, KanbanFormValue, KanbanResponse, KanbanStatus, PriorityLevel } from "../../types/KanbanTypes";
import { IKanbanService } from "../IKanbanService";
import CommsService from "./CommsService";
import ICommsService from "../ICommsService";
import CommunicationEvents from "../../types/CommunicationEvent";
import { generateKanbanId } from "../../utils/KanbanUtils";
import IMediator from "../IMediator";
import Mediator from "./Mediator";
import MediatorEvents from "../../constants/MediatorEvents";

let kanbanService: KanbanService = null;

export class KanbanService implements IKanbanService {

    private commsService: ICommsService = null;
    private mediator: IMediator = null;
    private cachedCards: KanbanCardType[] = [];

    constructor() {
        if (kanbanService == null) {
            this.commsService = new CommsService();
            this.mediator = new Mediator();
            kanbanService = this;
        }

        return kanbanService;
    }

    async getKanbanCards(): Promise<KanbanCardType[]> {
        if (this.cachedCards.length === 0) {
            const { error, data } = await this.commsService.sendRequest<KanbanResponse<KanbanCardType[]>>(CommunicationEvents.getKanbanCards, null);

            if (error) {
                console.error("Error fetching kanban cards");
                this.mediator.publish<string>(MediatorEvents.GENERIC_KANBAN_ERROR, "Error fetching kanban cards");
            } else {
                this.cachedCards = data;
            }
        }
        return this.cachedCards;
    }

    deleteKanbanCards(id: string): void {
        console.log("Deleting kanban card with id: ", id);
        console.log("Cached cards before deletion: ", this.cachedCards);
        this.cachedCards = this.cachedCards.filter(c => c.id !== id);	
        this.commsService.sendRequest(CommunicationEvents.deleteKanbanCard, { id: +id });
    }

    modifyKanbanCard({ title, description, priority, id, time }: KanbanFormValue, status: number | undefined) {
        const selectedCard = this.cachedCards.find(c => c.id === id);
        if (!status) {
            status = selectedCard.status;
        }

        if (!selectedCard) {
            throw new Error("Kanban item not found to update");
        }

        Object.assign(selectedCard, { title, description, priority: priority as unknown as PriorityLevel, status, time });
        this.commsService.sendRequest(CommunicationEvents.modifyKanbanCard, selectedCard);
    }

    addKanbanCard({ title, description, priority, time }: KanbanFormValue) {
        const id = generateKanbanId(this.cachedCards).toString();
        const status = 1;
        const kanbanCard: KanbanCardType = {
            id,
            title,
            description,
            priority: priority as unknown as PriorityLevel,
            status,
            time
        }

        this.cachedCards.push(kanbanCard);
        this.commsService.sendRequest(CommunicationEvents.saveKanbanCard, kanbanCard);
    }

}
