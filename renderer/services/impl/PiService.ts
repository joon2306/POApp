import CommunicationEvents from "../../types/CommunicationEvent";
import { Pi, PiResponse, PiTitle } from "../../types/Feature/Pi";
import IPiService from "../IPiService";
import CommsService from "./CommsService";
import { GenericResponse } from "../../types/Generic";

let instance: PiService = null;
export default class PiService implements IPiService {

    #commsService: CommsService;
    #currentPiTitle: PiTitle;

    constructor(commsService: CommsService) {
        if (instance === null) {
            this.#commsService = commsService;
            instance = this;
        }
        return instance;
    }

    #addTwoWeeks(timestamp: number): number {
        const date = new Date(timestamp);
        date.setDate(date.getDate() + 14);
        return date.getTime();
    }

    #createSprints(timestamp: number): Pi["sprintTimestamp"] {

        const sprintTimestamp: number[] = [];

        [0, 1, 2, 3, 4, 5].forEach((i) => {
            if (i === 0) {
                return sprintTimestamp.push(timestamp);
            }
            sprintTimestamp.push(this.#addTwoWeeks(sprintTimestamp[i - 1]));
        })

        return {
            first: sprintTimestamp[0],
            second: sprintTimestamp[1],
            third: sprintTimestamp[2],
            fourth: sprintTimestamp[3],
            fifth: sprintTimestamp[4],
            ip: sprintTimestamp[5],
        }
    }

    #piResponseToPi({ title, s1, s2, s3, s4, s5, ip }: PiResponse): Pi {
        return {
            title,
            sprintTimestamp: {
                first: s1,
                second: s2,
                third: s3,
                fourth: s4,
                fifth: s5,
                ip
            }
        }
    }

    async getCurrent(): Promise<Pi> {
        const { data, error } = await this.#commsService.sendRequest<GenericResponse<PiResponse[]>>(CommunicationEvents.getPi, {});
        if (error || data.length === 0) {
            return null;
        }
        this.#currentPiTitle = data[0].title;
        return this.#piResponseToPi(data[0]);
    }
    setCurrent(title: PiTitle, timestamp: number): void {
        const pi: Pi = {
            title,
            sprintTimestamp: this.#createSprints(timestamp)
        }
        this.#commsService.sendRequest<Pi>(CommunicationEvents.createPi, pi);
    }

    removeCurrent() {
        if(!this.#currentPiTitle) {
            console.error("no current pi title to remove");
            return;
        }
        this.#commsService.sendRequest(CommunicationEvents.deletePi, this.#currentPiTitle);
    }

}