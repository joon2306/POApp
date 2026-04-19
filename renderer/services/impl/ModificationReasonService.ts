import GenericResponse from "../../../main/model/GenericResponse";
import CommunicationEvents from "../../types/CommunicationEvent";
import { ModificationReason } from "../../types/ModificationReason";
import IModificationReasonService from "../IModificationReasonService";
import CommsService from "./CommsService";

let instance: ModificationReasonService = null;
export default class ModificationReasonService implements IModificationReasonService {

    #commsService: CommsService;

    constructor(commsService?: CommsService) {
        if (instance === null) {
            this.#commsService = commsService ?? new CommsService();
            instance = this;
        }
        return instance;
    }

    save(reason: ModificationReason): void {
        this.#commsService.sendRequest(CommunicationEvents.saveModificationReason, { ...reason, timestamp: Date.now() });
    }

    async getByPiRef(piRef: string): Promise<ModificationReason[]> {
        const response = await this.#commsService.sendRequest<GenericResponse<ModificationReason[]>>(
            CommunicationEvents.getModificationReasonsByPi, piRef
        );
        return response?.data ?? [];
    }
}
