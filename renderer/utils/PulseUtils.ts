import { prefetchDNS } from "react-dom";
import { Feature, JIRA_STATE, JiraKey, JiraTicket } from "../types/Feature/Feature";
import { Pi } from "../types/Feature/Pi";
import { Pulse, State } from "../types/Pulse/Pulse";

type FeatureTarget = Pulse["target"];

export type Sprint = "Sprint 1" | "Sprint 2" | "Sprint 3" | "Sprint 4" | "Sprint 5" | "Sprint IP" | "Inactive";

class SprintMapper {
    public static readonly SPRINT_MAP: Record<number, Sprint> = {
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


    constructor(private readonly feature: Feature,
        private readonly activeSprint: Sprint) { }

    computeState(): State {
        if (this.feature.userStories.length === 0 && this.feature.completedStories.length > 0) {
            return "COMPLETED";
        }

        const activeSprint = parseInt(Object.entries(SprintMapper.SPRINT_MAP).find(([_, value]) => value === this.activeSprint)?.[0]);

        if (activeSprint) {
            if (activeSprint > this.feature.target) {
                return "INCONSISTENT";
            }
        }

        if (this.feature.userStories.length > 0 && this.feature.userStories.every(userStory => userStory.state === JIRA_STATE.ON_HOLD)) {
            return "BLOCKED";
        }

        if (this.feature.dependencies.length !== 0) {
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

        if (this.feature.dependencies.length !== 0) {
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
        }, "");

        return SprintUtils.SPRINT_MAP[returnValue] ?? "Inactive";
    }
}


export class PulseUtils {

    static getSprintTarget(featureTarget: FeatureTarget) {
        return new SprintMapper(featureTarget).getSprint();
    }

    static getState(feature: Feature, activeSprint: Sprint) {
        return new StateMapper(feature, activeSprint).computeState();
    }

    static getTags(feature: Feature, activeSprint: Sprint) {
        return new StateMapper(feature, activeSprint).getTags();
    }

    static getActiveSprint(pi: Pi) {
        return new SprintUtils(pi).getActiveSprint();
    }
}