import KanbanResponse from "../model/KanbanItem";
import KanbanCards, { KanbanDbItem } from "../model/KanbanItem";

export default interface IKanbanDbService {

    getAllKanbanCards(): KanbanResponse<KanbanDbItem[]>;

    saveKanbanCard(kanbanItem: KanbanDbItem): KanbanResponse<string>;

    deleteKanbanCard(title: string, description: string): KanbanResponse<string>;

    modifyKanbanCard(kanbanItem: KanbanDbItem): KanbanResponse<string>;
}