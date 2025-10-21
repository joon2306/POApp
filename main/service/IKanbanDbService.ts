
import GenericResponse from "../model/GenericResponse";
import  { KanbanDbItem } from "../model/KanbanItem";
import IDbService from "./IDbService";

export default interface IKanbanDbService extends IDbService<KanbanDbItem,
    GenericResponse<string>, GenericResponse<KanbanDbItem[]>, number, GenericResponse<string>, KanbanDbItem, GenericResponse<string>> {

        getKanbanCardByTitleAndDescription(title: string, description: string): GenericResponse<KanbanDbItem>;

        getKanbanCardById(id: number): GenericResponse<KanbanDbItem>;

}