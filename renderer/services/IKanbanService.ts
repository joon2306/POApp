import { KanbanCardType, KanbanFormValue } from "../types/KanbanTypes";

export interface IKanbanService {
    getKanbanCards(): Promise<KanbanCardType[]>;

    deleteKanbanCards(id: string): void;

    modifyKanbanCard({ title, description, priority, id, time, target }: KanbanFormValue, status: number | undefined): void;

    addKanbanCard({title, description, priority, time, target}: KanbanFormValue): void;
}