import { prefetchDNS } from "react-dom";
import { Feature, JIRA_STATE, JiraKey, JiraTicket } from "../types/Feature/Feature";
import { Pi } from "../types/Feature/Pi";
import { Pulse, State } from "../types/Pulse/Pulse";

type FeatureTarget = Pulse["target"];

type Sprint = "Sprint 1" | "Sprint 2" | "Sprint 3" | "Sprint 4" | "Sprint 5" | "Sprint IP";

class SprintMapper {
    private static readonly SPRINT_MAP = {
        1: "Sprint 1",
        2: "Sprint 2",
        3: "Sprint 3",
        4: "Sprint 4",
        5: "Sprint 5",
        6: "Sprint IP"
    } as const;

    constructor(private readonly featureTarget: FeatureTarget) { }

    getSprint(): Sprint {
        return SprintMapper.SPRINT_MAP[this.featureTarget];
    }

}


class StateMapper {


    constructor(private readonly userStories: Array<JiraTicket>,
        private readonly dependencies: Array<JiraTicket>, private readonly completedStories: Array<JiraKey>) { }

    computeState(): State {
        if (this.userStories.length === 0 && this.completedStories.length > 0) {
            return "COMPLETED";
        }

        if (this.userStories.length > 0 && this.userStories.every(userStory => userStory.state === JIRA_STATE.ON_HOLD)) {
            return "BLOCKED";
        }

        if (this.dependencies.length !== 0) {
            return "HAS_DEPENDENCIES";
        }

        return "NORMAL";
    }


    getTags(): Array<State> {
        const set = new Set<State>();
        const state = this.computeState();
        if (state === "NORMAL") {
            return [];
        }
        set.add(state);
        if (state === "COMPLETED") {
            return ["COMPLETED"];
        }

        if (this.dependencies.length !== 0) {
            set.add("HAS_DEPENDENCIES");
        }

        return [...set];

    }
}

class SprintUtils {
    private static readonly SPRINT_MAP = {
        first: "Sprint 1",
        second: "Sprint 2",
        third: "Sprint 3",
        fourth: "Sprint 4",
        fifth: "Sprint 5",
        ip: "Sprint IP"
    } as const;

    constructor(private readonly pi: Pi) { }

    getActiveSprint(): Sprint {
        const now = Date.now();
        const returnValue = Object.entries(this.pi.sprintTimestamp).reduce((accumulator: string, [key, value]: [string, number]) => {
            if (value < now) {
                accumulator = key;
            }
            return accumulator;
        }, "first");

        return SprintUtils.SPRINT_MAP[returnValue] ?? "Sprint 1";
    }
}


export class PulseUtils {

    static getSprintTarget(featureTarget: FeatureTarget) {
        return new SprintMapper(featureTarget).getSprint();
    }

    static getState(feature: Feature) {
        return new StateMapper(feature.userStories, feature.dependencies, feature.completedStories).computeState();
    }

    static getTags(feature: Feature) {
        return new StateMapper(feature.userStories, feature.dependencies, feature.completedStories).getTags();
    }

    static getActiveSprint(pi: Pi) {
        return new SprintUtils(pi).getActiveSprint();
    }
}