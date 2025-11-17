import GenericResponse from "../model/GenericResponse";
import { JiraItem, JiraKey, PiRef } from "../model/JiraItem";
import IDbService from "./IDbService";

export default interface IJiraDbService extends IDbService<JiraItem, GenericResponse<string>, GenericResponse<JiraItem[]>,
string, GenericResponse<string>, JiraItem, GenericResponse<string>>{
    getByJirakey(jiraKey: string): GenericResponse<JiraItem>;
    getByPiRef(piRef: PiRef): GenericResponse<JiraItem[]>;
    getByTypeAndFeatureRef(type: number, featureRef: JiraKey): GenericResponse<JiraItem[]>;
    setIncomplete(jiraKey: string): GenericResponse<string>;
    deleteByPiRef(piRef: string): GenericResponse<string>;
};