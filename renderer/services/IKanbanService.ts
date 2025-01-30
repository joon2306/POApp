import { KanbanCardType, KanbanFormValue } from "../types/KanbanTypes";

export interface IKanbanService {
    getKanbanCards(): Promise<KanbanCardType[]>;

    deleteKanbanCards(cardId: string): Promise<void>;

    modifyKanbanCard({ title, description, priority, id }: KanbanFormValue): Promise<void>;

    addKanbanCard({title, description, priority}: KanbanFormValue): Promise<void>;
}