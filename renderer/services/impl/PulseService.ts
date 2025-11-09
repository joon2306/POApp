import { Feature, JiraTicket } from "../../types/Feature/Feature";
import { Pulse } from "../../types/Pulse/Pulse";
import { PulseUtils } from "../../utils/PulseUtils";
import IPulseService from "../IPulseService";

let instance: PulseService = null;
export default class PulseService implements IPulseService {

    #pulses: Array<Pulse>;

    #features: Array<Feature>;

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

        this.#features = [
            {
                featureKey: "ADTCUST-1", title: "SDV_UI", target: 3, userStories: userStories1, dependencies: [], completedStories: ["ADTCUST-111", "ADTCUST-222"]
            },
            { featureKey: "ADTCUST-2", title: "SDV MAC Secoc Impl", target: 4, userStories: userStories2, dependencies: dependencies2, completedStories: [] },
            { featureKey: "ADTCUST-3", title: "remove status 500", target: 1, userStories: [], dependencies: [], completedStories: ["ADTCUST-333"] },
            { featureKey: "ADTDEVI-1", title: "Java 17 migration", target: 6, userStories: getTickt("ADTDEVI-31", 1), dependencies: getTickt("GXDD-123", 1), completedStories: ["ADTDEVI-111", "ADTDEVI-222", "ADTDEVI-333", "ADTDEVI-444"] },
            { featureKey: "ADTCUST-5", title: "ADT Converter DTC masking", target: 3, userStories: [], dependencies: [], completedStories: [] }
        ]

        this.#pulses = this.#features.map(feature => {
            return { ...feature, state: PulseUtils.getState(feature), tags: PulseUtils.getTags(feature) }
        })
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