import CommunicationEvents from "../../types/CommunicationEvent";
import { Pi, PiResponse, PiTitle } from "../../types/Feature/Pi";
import IPiService from "../IPiService";
import CommsService from "./CommsService";
import PiHelper, { PiHelperConfig } from "../../helpers/PiHelper";

let instance: PlannedPiService = null;
export default class PlannedPiService implements IPiService {

    #currentPiTitle: PiTitle;
    #piHelper: PiHelper;
    #piHelperConfig: PiHelperConfig = {
        create: CommunicationEvents.createPlannedPi,
        getAll: CommunicationEvents.getPlannedPi,
        delete: CommunicationEvents.deletePlannedPi
    }

    constructor(commsService: CommsService) {
        if (instance === null) {
            this.#piHelper = new PiHelper(commsService, this.#piHelperConfig);
            instance = this;
        }
        return instance;
    }

    async getCurrent(): Promise<Pi> {
        const { data, error } = await this.#piHelper.getAll();
        if (error || data.length === 0) {
            return null;
        }
        const currentPi: PiResponse | null = this.#piHelper.getPi(data, false);

        if (!currentPi) {
            return null;
        }

        this.#currentPiTitle = currentPi.title;
        return this.#piHelper.piResponseToPi(currentPi);
    }

    setCurrent(title: PiTitle, timestamp: number): void {
        return this.#piHelper.setCurrent(title, timestamp);
    }

    removeCurrent() {
        return this.#piHelper.removeCurrent(this.#currentPiTitle);
    }

}