import CommunicationEvents from "../../renderer/types/CommunicationEvent";
import { KanbanDbItem } from "../model/KanbanItem";
import ICommunicationService from "../service/ICommunicationService";
import IKanbanDbService from "../service/IKanbanDbService";
import IProductivityService from "../service/IProductivityService";
import Handler from "./Handler";

let instance: KanbanHandler = null;

export default class KanbanHandler implements Handler {
    #kanbanDbService: IKanbanDbService;
    #commsService: ICommunicationService;
    #productivityService: IProductivityService;

    constructor(kanbanDbService: IKanbanDbService, commsService: ICommunicationService, productivityService: IProductivityService) {
        if (instance === null) {
            this.#kanbanDbService = kanbanDbService;
            this.#commsService = commsService;
            this.#productivityService = productivityService;

        }
        return instance;

    }

    #getKanbanCards() {
        const getKanbanCards = () => this.#kanbanDbService.getAll();
        this.#commsService.getRequest(CommunicationEvents.getKanbanCards, () => getKanbanCards());
    }

    #saveKanbanCard() {
        const save = ([{ id, title, description, priority, status, time }]: KanbanDbItem[]) => {
            return this.#kanbanDbService.create({ id, title, description, priority, status, time });
        }
        this.#commsService.getRequest(CommunicationEvents.saveKanbanCard, (kanbanCard: KanbanDbItem[]) => save(kanbanCard));
    }

    #deleteCard() {
        const deleteCard = ([{ id }]: Array<{ id: number }>) => {
            const { error, data: deletedCard } = this.#kanbanDbService.delete(id);
            if (!error) {
                this.#productivityService.add(deletedCard);
            }
        }
        this.#commsService.getRequest(CommunicationEvents.deleteKanbanCard, ([{ id }]: Array<{ id: number }>) => {
            deleteCard([{ id }])
        });
    }

    #modifyCard() {
        const modifyCard = ([{ id, title, description, priority, status, time }]: KanbanDbItem[]) => {
            this.#kanbanDbService.modify({ id, title, description, priority, status, time });
        }
        this.#commsService.getRequest(CommunicationEvents.modifyKanbanCard, (kanbanCard: KanbanDbItem[]) => modifyCard(kanbanCard));
    }

    execute() {
        this.#kanbanDbService.resetInProgressCards();
        this.#getKanbanCards();
        this.#saveKanbanCard();
        this.#deleteCard();
        this.#modifyCard();
    };

}