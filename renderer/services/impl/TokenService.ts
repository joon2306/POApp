import CommunicationEvents from "../../types/CommunicationEvent";
import ICommsService from "../ICommsService";
import ITokenService from "../ITokenService";

let instance: TokenService = null;
export default class TokenService implements ITokenService {

    #commsService: ICommsService;
    constructor(commsService: ICommsService) {
        if (instance === null) {
            this.#commsService = commsService;
            instance = this;
        }
        return this;
    }

    async generateToken(): Promise<void> {
        return await this.#commsService.sendRequest(CommunicationEvents.generateToken, {});
    }

}