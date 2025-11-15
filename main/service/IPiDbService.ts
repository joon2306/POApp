import GenericResponse from "../model/GenericResponse";
import { PiItem } from "../model/PiItem";
import IDbService from "./IDbService";

export default interface IPiDbService extends IDbService<PiItem, GenericResponse<string>, GenericResponse<PiItem[]>,
    string, GenericResponse<string>, PiItem, GenericResponse<string>> {

}