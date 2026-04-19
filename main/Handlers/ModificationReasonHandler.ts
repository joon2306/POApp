import CommunicationEvents from "../../renderer/types/CommunicationEvent";
import { ModificationReasonItem } from "../model/ModificationReason";
import ICommunicationService from "../service/ICommunicationService";
import IModificationReasonDbService from "../service/IModificationReasonDbService";
import Handler from "./Handler";

let instance: ModificationReasonHandler = null;
export default class ModificationReasonHandler implements Handler {

    #commsService: ICommunicationService;
    #modificationReasonDbService: IModificationReasonDbService;

    constructor(commsService: ICommunicationService, modificationReasonDbService: IModificationReasonDbService) {
        if (instance === null) {
            this.#commsService = commsService;
            this.#modificationReasonDbService = modificationReasonDbService;
            instance = this;
        }
        return instance;
    }

    #saveModificationReason() {
        this.#commsService.getRequest(CommunicationEvents.saveModificationReason,
            ([item]: ModificationReasonItem[]) => this.#modificationReasonDbService.create(item));
    }

    #getModificationReasonsByPi() {
        this.#commsService.getRequest(CommunicationEvents.getModificationReasonsByPi,
            ([piRef]: string[]) => this.#modificationReasonDbService.getByPiRef(piRef));
    }

    execute() {
        this.#saveModificationReason();
        this.#getModificationReasonsByPi();
    }
}
