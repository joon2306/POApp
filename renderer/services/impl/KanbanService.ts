import { mock } from "node:test";
import { KanbanCardType, KanbanStatus } from "../../types/KanbanTypes";
import { generateKanbanIds } from "../../utils/KanbanUtils";
import { IKanbanService } from "../IKanbanService";

const STATUS_PREFIX_MAP: Record<KanbanStatus, string> = {
    1: "pending",
    2: "inProgress",
    3: "onHold"
} as const;

const mockCards: Omit<KanbanCardType, "id">[] = [
    {
        title: "Meeting with Rohan",
        description: "discuss backend",
        priority: 1,
        status: 1
    },
    {
        title: "Meeting with kisshan",
        description: "prepare questions",
        priority: 2,
        status: 1
    },
    {
        title: "Meeting with Christine",
        description: "discuss issue ADTCUST-356",
        priority: 3,
        status: 3
    },
    {
        title: "do feature estimation",
        description: "break into content backend and front",
        priority: 4,
        status: 2
    },
    {
        title: "Inform Hiresh about modification to be done to spike",
        description: "discuss spike",
        priority: 1,
        status: 2
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

    private mockCardsWithIds = generateKanbanIds(mockCards, STATUS_PREFIX_MAP);

    async getKanbanCards(): Promise<KanbanCardType[]> {
        return this.mockCardsWithIds;
    }

    async deleteKanbanCards(cardId: string): Promise<KanbanCardType[]> {
        this.mockCardsWithIds = this.mockCardsWithIds.filter(c => c.id !== cardId);
        return this.mockCardsWithIds;
    }

}
