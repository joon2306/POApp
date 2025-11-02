import CommunicationEvents from "../../renderer/types/CommunicationEvent";
import ICommunicationService from "../service/ICommunicationService";
import ICopyService from "../service/ICopyService";
import Handler from "./Handler";

let instance: CopyHandler = null;
export default class CopyHandler implements Handler {

    #copyService: ICopyService;
    #commsService: ICommunicationService;

    constructor(copyService: ICopyService, commsService: ICommunicationService) {
        if (instance === null) {
            this.#commsService = commsService;
            this.#copyService = copyService;
            instance = this;
        }
        return instance;

    }
    execute() {
        this.#commsService.getRequest(CommunicationEvents.copy, ([{ input }]: Array<{ input: string[] }>) => this.#copyService.copy(input));
    }
}