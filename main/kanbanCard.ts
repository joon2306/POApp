import { KanbanCardType } from '../renderer/types/KanbanTypes';
import CommsService from './service/impl/CommsService';
import ICommunicationService from './service/ICommunicationService';

let mockCards: KanbanCardType[] = [
    {
        title: "Meeting with Rohan",
        description: "discuss backend",
        priority: 1,
        status: 1,
        id: "1"
    },
    {
        title: "Meeting with kisshan",
        description: "prepare questions",
        priority: 2,
        status: 1,
        id: "2"
    },
    {
        title: "Meeting with Christine",
        description: "discuss issue ADTCUST-356",
        priority: 3,
        status: 3,
        id: "3"
    },
    {
        title: "do feature estimation",
        description: "break into content backend and front",
        priority: 4,
        status: 2,
        id: "4"
    },
    {
        title: "Inform Hiresh about modification to be done to spike",
        description: "discuss spike",
        priority: 1,
        status: 2,
        id: "5"
    }
];

export function getKanbanCards() {
    const commsService: ICommunicationService = new CommsService();
    commsService.getRequest("kanban-cards", () => mockCards);
}
