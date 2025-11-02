import CommunicationEvents from "../../types/CommunicationEvent";
import ICommsService from "../ICommsService";
import ICopyService from "../ICopyService";

let instance: CopyService = null;
export default class CopyService implements ICopyService {

    #commsServide: ICommsService;
    constructor(commsService: ICommsService) {
        if (instance === null) {
            this.#commsServide = commsService;
            instance = this;
        }
        return instance;
    }
    async copy(input: string[]): Promise<void> {
        if (input && input.length === 0) {
            throw new Error("cannot copy as empty array");
        }
        if (input.length === 1) {
            navigator.clipboard.writeText(input[0]);
            return;
        }
        await this.#commsServide.sendRequest(CommunicationEvents.copy, { input });
    }

}