import CommunicationEvents from "../../renderer/types/CommunicationEvent";
import { KanbanDbItem } from "../model/KanbanItem";
import ICommunicationService from "../service/ICommunicationService";
import IKanbanDbService from "../service/IKanbanDbService";
import IProductivityService from "../service/IProductivityService";
import Handler from "./Handler";
import ICalendarMeetingDbService from "../service/ICalendarMeetingDbService";
import ICalendarStatusManager from "../service/ICalendarStatusManager";

let instance: TodoKanbanHandler = null;

export default class TodoKanbanHandler implements Handler {
    #kanbanDbService: IKanbanDbService;
    #commsService: ICommunicationService;
    #productivityService: IProductivityService;
    #calendarMeetingDbService: ICalendarMeetingDbService;
    #calendarStatusManager: ICalendarStatusManager;

    constructor(
        kanbanDbService: IKanbanDbService,
        commsService: ICommunicationService,
        productivityService: IProductivityService,
        calendarMeetingDbService?: ICalendarMeetingDbService,
        calendarStatusManager?: ICalendarStatusManager,
    ) {
        if (instance === null) {
            this.#kanbanDbService = kanbanDbService;
            this.#commsService = commsService;
            this.#productivityService = productivityService;
            this.#calendarMeetingDbService = calendarMeetingDbService;
            this.#calendarStatusManager = calendarStatusManager;

        }
        return instance;

    }

    #getKanbanCards() {
        const getKanbanCards = () => this.#kanbanDbService.getAll();
        this.#commsService.getRequest(CommunicationEvents.getTodoKanbanCards, () => getKanbanCards());
    }

    #saveKanbanCard() {
        const save = ([{ id, title, description, priority, status, time }]: KanbanDbItem[]) => {
            return this.#kanbanDbService.create({ id, title, description, priority, status, time });
        }
        this.#commsService.getRequest(CommunicationEvents.saveTodoKanbanCard, (kanbanCard: KanbanDbItem[]) => save(kanbanCard));
    }

    #deleteCard() {
        const deleteCard = ([{ id }]: Array<{ id: number }>) => {
            const { error, data: deletedCard } = this.#kanbanDbService.delete(id);
            if (!error) {
                this.#calendarMeetingDbService?.resolveByKanbanItemId(id);
                this.#calendarStatusManager?.refreshStatus();
                if (deletedCard) this.#productivityService.add(deletedCard);
            }
        }
        this.#commsService.getRequest(CommunicationEvents.deleteTodoKanbanCard, ([{ id }]: Array<{ id: number }>) => {
            deleteCard([{ id }])
        });
    }

    #modifyCard() {
        const modifyCard = ([{ id, title, description, priority, status, time }]: KanbanDbItem[]) => {
            this.#kanbanDbService.modify({ id, title, description, priority, status, time });
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
