import { GenericResponse } from "../../renderer/types/Generic";
import { PlannedFeatureItem } from "../model/PlannedFeatureItem";
import IDbService from "./IDbService";

export default interface IPlannedFeatureDbService extends IDbService<PlannedFeatureItem, GenericResponse<string>,
GenericResponse<PlannedFeatureItem[]>, string, GenericResponse<string>, PlannedFeatureItem, GenericResponse<string>> {

    deleteByPiRef(piRef: string): GenericResponse<string>;

    getAllByPiRef(piRef: string): GenericResponse<PlannedFeatureItem[]>;

    getByTitle(title: string): GenericResponse<PlannedFeatureItem>;

}