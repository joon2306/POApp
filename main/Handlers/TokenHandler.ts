import CommunicationEvents from "../../renderer/types/CommunicationEvent";
import ICommunicationService from "../service/ICommunicationService";
import ITokenGeneratorService from "../service/ITokenGeneratorService";
import Handler from "./Handler";

let instance: TokenHandler = null;
export default class TokenHandler implements Handler {

    #tokenGeneratorService: ITokenGeneratorService;
    #commsService: ICommunicationService;

    constructor(tokenGeneratorService: ITokenGeneratorService, commsService: ICommunicationService) {
        if (instance === null) {
            this.#commsService = commsService;
            this.#tokenGeneratorService = tokenGeneratorService;
            instance = this;
        }
        return instance;
    }

    execute() {
        this.#commsService.getRequest(CommunicationEvents.generateToken, async () => await this.#tokenGeneratorService.generateToken());
    }

}