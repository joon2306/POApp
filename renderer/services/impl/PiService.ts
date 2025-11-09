import { Pi } from "../../types/Feature/Pi";
import IPiService from "../IPiService";

let instance: PiService = null;
export default class PiService implements IPiService {

    #pi: Pi;

    constructor() {
        if (instance === null) {
            this.#initPi();
            instance = this;
        }
        return instance;
    }
    getCurrent(): Promise<Pi> {
        return Promise.resolve(this.#pi);
    }
    setCurrent(pi: Pi): void {
        this.#pi = pi;
    }

    #initPi() {
        this.#pi = {
            title: "SL25.4",
            sprintTimestamp: {
                first: new Date(2025, 9, 9).getTime(),
                second: new Date(2025, 9, 20).getTime(),
                third: new Date(2025, 10, 1).getTime(),
                fourth: new Date(2025, 10, 8).getTime(),
                fifth: new Date(2025, 11, 17).getTime(),
                ip: new Date(2025, 11, 31).getTime()
            }
        }
    }

}