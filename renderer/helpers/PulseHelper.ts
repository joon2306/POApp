import { PlannedPulse, Pulse, StateColors } from "../types/Pulse/Pulse";
import ProgressUtils from "../utils/ProgressUtils";
import { PulseUtils } from "../utils/PulseUtils";

export default class PulseHelper {
    #pulse: Pulse;
    #plannedPulse: PlannedPulse;
    #isPlanned = false;
    constructor(pulse: Pulse | PlannedPulse) {
        if ((pulse as PlannedPulse).type === "PLANNED") {
            this.#isPlanned = true;
            this.#plannedPulse = pulse as PlannedPulse;
        } else {
            this.#pulse = pulse as Pulse;
        }
    }

    getFeatureKey() {
        return this.#isPlanned ? this.#plannedPulse.title : this.#pulse.featureKey;
    }

    getFeatureTitle() {
        return this.#isPlanned ? this.#plannedPulse.description : this.#pulse.title;
    }

    isPlanned() {
        return this.#isPlanned;
    }

    getTarget() {
        return this.#pulse.target !== 0 ? PulseUtils.getSprintTarget(this.#pulse.target) : "UNPLANNED"
    }

    getProgressColor() {
        return StateColors[this.#pulse.state].progressColor;
    }

    getProgress() {
        return ProgressUtils.getProgress(this.#pulse.userStories.length + this.#pulse.completedStories.length, this.#pulse.completedStories.length);
    }

    getTags() {
        return this.#pulse.tags;
    }

    getBgColor() {
        return this.#isPlanned ? undefined : StateColors[this.#pulse.state].bgColor;
    }

    getState() {
        return  StateColors[this.#pulse.state];
    }

    getCustomPulseStyles(isHovered: boolean) {
        const state = this.#isPlanned ? StateColors.NORMAL : this.getState();

        return isHovered ? {
            cursor: "pointer",
            borderColor: state.borderHoverColor,
            transitionProperty: "all",
            transitionDuration: ".2s",
            borderWidth: "2px",
            boxShadow: state.boxShadow,
            backgroundImage: state.bgImage ?? "none"
        } : {
            backgroundImage: state.bgImage ?? "none"
        }

    }
}