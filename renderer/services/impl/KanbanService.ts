import { mock } from "node:test";
import { KanbanCardType, KanbanFormValue, KanbanStatus, PriorityLevel } from "../../types/KanbanTypes";
import { generateKanbanIds } from "../../utils/KanbanUtils";
import { IKanbanService } from "../IKanbanService";

const STATUS_PREFIX_MAP: Record<KanbanStatus, string> = {
    1: "pending",
    2: "inProgress",
    3: "onHold"
} as const;

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

let kanbanService: KanbanService = null;

export class KanbanService implements IKanbanService {

    constructor() {
        if (kanbanService == null) {
            kanbanService = this;
        }

        return kanbanService;
    }

    async getKanbanCards(): Promise<KanbanCardType[]> {
        return mockCards;
    }

    deleteKanbanCards(cardId: string): void {
        mockCards = mockCards.filter(c => c.id !== cardId);
    }

    modifyKanbanCard({ title, description, priority, id }: KanbanFormValue) {
        const selectedCard = mockCards.find(c => c.id === id);

        if (!selectedCard) {
            throw new Error("Kanban item not found to update");
        }

        Object.assign(selectedCard, { title, description, priority: priority as unknown as PriorityLevel });
    }

    addKanbanCard({title, description, priority}: KanbanFormValue) {
        const id = `${mockCards.length + 1}`;
        const kanbanCard: KanbanCardType = {
            id,
            title, 
            description,
            priority: priority as unknown as PriorityLevel,
            status: 1
        }

        mockCards.push(kanbanCard);
    }

}
