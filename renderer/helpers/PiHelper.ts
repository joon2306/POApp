import CommsService from "../services/impl/CommsService";
import CommunicationEvents from "../types/CommunicationEvent";
import { Pi, PiResponse, PiTitle } from "../types/Feature/Pi";
import { GenericResponse } from "../types/Generic";


export type PiHelperConfig = {
    create: string;
    getAll: string;
    delete: string;
}

export default class PiHelper {

    #commsService: CommsService;
    #config: PiHelperConfig;

    constructor(commsService: CommsService, config: PiHelperConfig) {
        this.#commsService = commsService;
        this.#config = config;
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

    piResponseToPi({ title, s1, s2, s3, s4, s5, ip }: PiResponse): Pi {
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

    getPi(pis: Array<PiResponse>, isCurrent: boolean): null | PiResponse {
        return pis.reduce((current, pi) => {
            if (!current) return pi;

            const currentFloat = parseFloat(current.title.slice(2));
            const piFloat = parseFloat(pi.title.slice(2));

            if (isCurrent) {
                return piFloat < currentFloat ? pi : current;
            }
            return currentFloat < piFloat ? pi : current;

        }, null);
    }

    getAll(): Promise<GenericResponse<PiResponse[]>>{
        return this.#commsService.sendRequest<GenericResponse<PiResponse[]>>(this.#config.getAll, {});
    }

    setCurrent(title: PiTitle, timestamp: number): void {
        const pi: Pi = {
            title,
            sprintTimestamp: this.#createSprints(timestamp)
        }
        this.#commsService.sendRequest<Pi>(this.#config.create, pi);
    }

    removeCurrent(currentPiTitle: PiTitle) {
        if (!currentPiTitle) {
            console.error("no current pi title to remove");
            return;
        }
        this.#commsService.sendRequest(this.#config.delete, currentPiTitle);
    }


}