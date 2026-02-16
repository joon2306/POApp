import CommunicationEvents from "../../renderer/types/CommunicationEvent";
import ICommunicationService from "../service/ICommunicationService";
import IEpicDbService from "../service/IEpicDbService";
import Handler from "./Handler";

export default class EpicHandler implements Handler {

    #epicDbService: IEpicDbService;
    #commsService: ICommunicationService;

    constructor(epicDbService: IEpicDbService, commsService: ICommunicationService) {
        this.#commsService = commsService;
        this.#epicDbService = epicDbService;
    }

    execute() {
        this.#commsService.getRequest(CommunicationEvents.getEpics, async () => {
            return await this.#epicDbService.getEpics();
        });

        this.#commsService.getRequest(CommunicationEvents.addEpic, async ([{ name, featureRef }]: [{ name: string, featureRef: number }]) => {
            return await this.#epicDbService.addEpic(name, featureRef);
        });

        this.#commsService.getRequest(CommunicationEvents.modifyEpic, async ([{ id, name, featureRef }]) => {
            return await this.#epicDbService.modifyEpic(id, name, featureRef);
        });

        this.#commsService.getRequest(CommunicationEvents.removeEpic, async ([{ id }]) => {
            return await this.#epicDbService.removeEpic(id);
        });
    }
}