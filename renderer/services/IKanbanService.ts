import { KanbanCardType, KanbanFormValue } from "../types/KanbanTypes";

export interface IKanbanService {
    getKanbanCards(): Promise<KanbanCardType[]>;

    deleteKanbanCards(cardId: string): void;

    modifyKanbanCard({ title, description, priority, id }: KanbanFormValue, status: number | undefined): void;

    addKanbanCard({title, description, priority}: KanbanFormValue): void;
}