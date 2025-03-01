import CommunicationEvents from "../../types/CommunicationEvent";
import ICommsService from "../ICommsService";
import IEmailGeneratorService from "../IEmailGeneratorSevice";
import CommsService from "./CommsService";
import EmailGeneratorResponse from "../../types/EmailGenerator/EmailGenerator";

let emailGeneratorService = null;
export default class EmailGeneratorService implements IEmailGeneratorService {

    private commsService: ICommsService = null;

    constructor() {
        if (emailGeneratorService == null) {
            this.commsService = new CommsService();
            emailGeneratorService = this;
        }
        return emailGeneratorService;
    }
    async generateEmail(email: string): Promise<EmailGeneratorResponse> {
        return await this.commsService.sendRequest(CommunicationEvents.translateEmail, email);
    }
}