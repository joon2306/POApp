import { KanbanCardType, KanbanFormValue } from "../types/KanbanTypes";

export interface IKanbanService {
    getKanbanCards(): Promise<KanbanCardType[]>;

    deleteKanbanCards(title: string, description: string): void;

    modifyKanbanCard({ title, description, priority, id, time }: KanbanFormValue, status: number | undefined): void;

    addKanbanCard({title, description, priority, time}: KanbanFormValue): void;
}