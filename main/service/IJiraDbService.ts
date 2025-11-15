import GenericResponse from "../model/GenericResponse";
import { JiraItem, PiRef } from "../model/JiraItem";
import IDbService from "./IDbService";

export default interface IJiraDbService extends IDbService<JiraItem, GenericResponse<string>, GenericResponse<JiraItem[]>,
string, GenericResponse<string>, JiraItem, GenericResponse<string>>{
    getByJirakey(jiraKey: string): GenericResponse<JiraItem>;
    getByTypeAndPiRef(type: string, piRef: PiRef): GenericResponse<JiraItem[]>;
};