import { JIRA_STATE, JiraTicket } from "../types/Feature/Feature";
import { Pulse, State } from "../types/Pulse/Pulse";

type FeatureTarget = Pulse["target"];

type SprintTarget = "Sprint 1" | "Sprint 2" | "Sprint 3" | "Sprint 4" | "Sprint 5" | "Sprint IP";

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

    getSprint(): SprintTarget {
        return SprintMapper.SPRINT_MAP[this.featureTarget];
    }

}


class StateMapper {


    constructor(private readonly userStories: Array<JiraTicket>, private readonly dependencies: Array<JiraTicket>) { }

    computeState(): State {
        if (this.userStories.length === 0) {
            return "COMPLETED";
        }

        if (this.userStories.every(userStory => userStory.state === JIRA_STATE.ON_HOLD)) {
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


export class PulseUtils {

    static getSprintTarget(featureTarget: FeatureTarget) {
        return new SprintMapper(featureTarget).getSprint();
    }

    static getState(userStories: Array<JiraTicket>, dependencies: Array<JiraTicket>) {
        return new StateMapper(userStories, dependencies).computeState();
    }

    static getTags(userStories: Array<JiraTicket>, dependencies: Array<JiraTicket>) {
        return new StateMapper(userStories, dependencies).getTags();
    }
}