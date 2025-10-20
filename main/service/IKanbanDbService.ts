
import GenericDbResponse from "../model/DbItem";
import  { KanbanDbItem } from "../model/KanbanItem";
import IDbService from "./IDbService";

export default interface IKanbanDbService extends IDbService<KanbanDbItem,
    GenericDbResponse<string>, GenericDbResponse<KanbanDbItem[]>, number, GenericDbResponse<string>, KanbanDbItem, GenericDbResponse<string>> {

        getKanbanCardByTitleAndDescription(title: string, description: string): GenericDbResponse<KanbanDbItem>;

        getKanbanCardById(id: number): GenericDbResponse<KanbanDbItem>;

}