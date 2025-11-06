import CommunicationEvents from "../../renderer/types/CommunicationEvent";
import { KanbanDbItem, KanbanType } from "../model/KanbanItem";
import ICommunicationService from "../service/ICommunicationService";
import IKanbanDbService from "../service/IKanbanDbService";
import IProductivityService from "../service/IProductivityService";
import Handler from "./Handler";

let instance: TodoKanbanHandler = null;

export default class TodoKanbanHandler implements Handler {
    #kanbanDbService: IKanbanDbService;
    #commsService: ICommunicationService;
    #productivityService: IProductivityService;

    private static KANBAN_TYPE = KanbanType.TODO;

    constructor(kanbanDbService: IKanbanDbService, commsService: ICommunicationService, productivityService: IProductivityService) {
        if (instance === null) {
            this.#kanbanDbService = kanbanDbService;
            this.#commsService = commsService;
            this.#productivityService = productivityService;

        }
        return instance;

    }

    #getKanbanCards() {
        const getKanbanCards = () => this.#kanbanDbService.getAllByType(TodoKanbanHandler.KANBAN_TYPE);
        this.#commsService.getRequest(CommunicationEvents.getTodoKanbanCards, () => getKanbanCards());
    }

    #saveKanbanCard() {
        const save = ([{ id, title, description, priority, status, time }]: KanbanDbItem[]) => {
            return this.#kanbanDbService.create({ id, title, description, priority, status, time, type: TodoKanbanHandler.KANBAN_TYPE });
        }
        this.#commsService.getRequest(CommunicationEvents.saveTodoKanbanCard, (kanbanCard: KanbanDbItem[]) => save(kanbanCard));
    }

    #deleteCard() {
        const deleteCard = ([{ id }]: Array<{ id: number }>) => {
            const { error, data: deletedCard } = this.#kanbanDbService.delete(id);
            if (!error) {
                this.#productivityService.add(deletedCard);
            }
        }
        this.#commsService.getRequest(CommunicationEvents.deleteTodoKanbanCard, ([{ id }]: Array<{ id: number }>) => {
            deleteCard([{ id }])
        });
    }

    #modifyCard() {
        const modifyCard = ([{ id, title, description, priority, status, time }]: KanbanDbItem[]) => {
            this.#kanbanDbService.modify({ id, title, description, priority, status, time, type: TodoKanbanHandler.KANBAN_TYPE });
        }
        this.#commsService.getRequest(CommunicationEvents.modifyTodoKanbanCard, (kanbanCard: KanbanDbItem[]) => modifyCard(kanbanCard));
    }

    execute() {
        this.#getKanbanCards();
        this.#saveKanbanCard();
        this.#deleteCard();
        this.#modifyCard();
    };

}