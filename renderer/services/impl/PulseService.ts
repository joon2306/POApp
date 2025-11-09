import { JiraTicket } from "../../types/Feature/Feature";
import { Pulse } from "../../types/Pulse/Pulse";
import { PulseUtils } from "../../utils/PulseUtils";
import IPulseService from "../IPulseService";

let instance: PulseService = null;
export default class PulseService implements IPulseService {

    #pulses: Array<Pulse>;

    constructor() {
        if (instance === null) {
            this.initFeatures();
            instance = this;
        }
        return instance;
    }

    initFeatures() {
        const userStories1: Array<JiraTicket> = [{
            title: "ADTCUST-11",
            state: 1
        }, {
            title: "ADTCUST-12",
            state: 2
        }];

        const userStories2: Array<JiraTicket> = [{
            title: "ADTCUST-21",
            state: 3
        }, {
            title: "ADTCUST-22",
            state: 3
        }];

        const dependencies2: Array<JiraTicket> = [{
            title: "ADTCUST-23",
            state: 2
        }
        ]

        const getTickt = (title, state) => {
            return [
                { title, state }
            ]
        }

        this.#pulses = [
            {
                featureKey: "ADTCUST-1", title: "SDV_UI", target: 3, progress: 55, userStories: userStories1, dependencies: [],
                state: PulseUtils.getState(userStories1, []), tags: PulseUtils.getTags(userStories1, [])
            },
            { featureKey: "ADTCUST-2", title: "SDV MAC Secoc Impl", target: 4, progress: 20, userStories: userStories2, dependencies: dependencies2, state: PulseUtils.getState(userStories2, dependencies2), tags: PulseUtils.getTags(userStories2, dependencies2) },
            { featureKey: "ADTCUST-3", title: "remove status 500", target: 1, progress: 40, userStories: [], dependencies: [], state: PulseUtils.getState([], []), tags: PulseUtils.getTags([], []) },
            { featureKey: "ADTDEVI-1", title: "Java 17 migration", target: 6, progress: 10, userStories: getTickt("ADTDEVI-31", 1), dependencies: getTickt("GXDD-123", 1), state: PulseUtils.getState(getTickt("ADTDEVI-31", 1), getTickt("GXDD-123", 1)), tags: PulseUtils.getTags(getTickt("ADTDEVI-31", 1), getTickt("GXDD-123", 1)) },
            { featureKey: "ADTCUST-5", title: "ADT Converter DTC masking", target: 3, progress: 70, userStories: [], dependencies: [], state: PulseUtils.getState([], []), tags: PulseUtils.getTags([], []) }
        ]
    }

    getAll(): Promise<Pulse[]> {
        const sortedPulses = this.#pulses.sort((a, b) => {
            const aCompleted = a.state === "COMPLETED";
            const bCompleted = b.state === "COMPLETED";

            if (aCompleted && !bCompleted) { return -1 };
            if (bCompleted && !aCompleted) { return 1 };
            return a.target - b.target;
        });

        return Promise.resolve(sortedPulses);
    }



}