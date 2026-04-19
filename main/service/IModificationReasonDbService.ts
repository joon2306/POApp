import GenericResponse from "../model/GenericResponse";
import { ModificationReasonItem } from "../model/ModificationReason";

export default interface IModificationReasonDbService {
  create(item: ModificationReasonItem): GenericResponse<string>;
  getByPiRef(piRef: string): GenericResponse<ModificationReasonItem[]>;
  deleteByPiRef(piRef: string): GenericResponse<string>;
}
