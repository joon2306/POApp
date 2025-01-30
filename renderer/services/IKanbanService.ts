import { KanbanCardType } from "../types/KanbanTypes";

export interface IKanbanService {
    getKanbanCards(): Promise<KanbanCardType[]>;

    deleteKanbanCards(cardId: string): Promise<KanbanCardType[]>;
}