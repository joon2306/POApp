import { KanbanCardType, KanbanFormValue, KanbanResponse, KanbanStatus, PriorityLevel } from "../../types/KanbanTypes";
import { IKanbanService } from "../IKanbanService";
import CommsService from "./CommsService";
import ICommsService from "../ICommsService";
import CommunicationEvents from "../../types/CommunicationEvent";
import { generateKanbanId } from "../../utils/KanbanUtils";
import IMediator from "../IMediator";
import Mediator from "./Mediator";
import MediatorEvents from "../../constants/MediatorEvents";

let kanbanService: ToDoKanbanService = null;

export class ToDoKanbanService implements IKanbanService {

    private commsService: ICommsService = null;
    private mediator: IMediator = null;

    constructor() {
        if (kanbanService == null) {
            this.commsService = new CommsService();
            this.mediator = new Mediator();
            kanbanService = this;
        }

        return kanbanService;
    }

    async getKanbanCards(): Promise<KanbanCardType[]> {
        const { error, data } = await this.commsService.sendRequest<KanbanResponse<KanbanCardType[]>>(CommunicationEvents.getKanbanCards, null);
        if (error) {
            console.error("Error fetching kanban cards");
            this.mediator.publish<string>(MediatorEvents.GENERIC_KANBAN_ERROR, "Error fetching kanban cards");
        } else {
            return data;
        }
    }

    deleteKanbanCards(id: string): void {
        this.commsService.sendRequest(CommunicationEvents.deleteKanbanCard, { id: +id });
    }

    modifyKanbanCard({ title, description, priority, id, time }: KanbanFormValue, status: number | undefined) {
        this.commsService.sendRequest(CommunicationEvents.modifyKanbanCard, { title, description, priority, id, time, status });
    }

    async addKanbanCard({ title, description, priority, time }: KanbanFormValue) {
        const id = generateKanbanId(await this.getKanbanCards()).toString();
        const status = 1;
        const kanbanCard: KanbanCardType = {
            id,
            title,
            description,
            priority: priority as unknown as PriorityLevel,
            status,
            time
        }

        const { error } = await this.commsService.sendRequest<KanbanResponse<string>>(CommunicationEvents.saveKanbanCard, kanbanCard);

        if (error) {
            this.mediator.publish<string>(MediatorEvents.GENERIC_KANBAN_ERROR, "Error saving kanban card");
            return;
        } else {
            this.mediator.publish<string>(MediatorEvents.KANBAN_CARD_UPDATE, "Kanban card added/modified");
        }

    }

}
