import { ModificationReason } from "../types/ModificationReason";

export default interface IModificationReasonService {
  save(reason: ModificationReason): void;
  getByPiRef(piRef: string): Promise<ModificationReason[]>;
}
