import { SelectedFeature } from "../components/PulseBoard/PulseRouter";
import { IKanbanService } from "../services/IKanbanService";
import CommsService from "../services/impl/CommsService";
import JiraKanbanService from "../services/impl/JiraKanbanService";
import { ToDoKanbanService } from "../services/impl/ToDoKanbanService";
import { JIRA_TYPE } from "../types/Pulse/Pulse";

export default interface IKanbanFactory {

    build(): IKanbanService;

    setComms(commsService: CommsService): IKanbanFactory;

    setSelectedFeature(selectedFeature: SelectedFeature): IKanbanFactory;
}

export type KanbanType = "TODO" | "FEATURE" | "USER_STORY" | "DEPENDENCY";



export class KanbanFactory implements IKanbanFactory {

    #type: KanbanType;
    #commsService: CommsService;
    #selectedFeature: SelectedFeature;

    constructor(type: KanbanType) {
        this.#type = type;
    }

    static of(type: KanbanType): IKanbanFactory {
        return new KanbanFactory(type);
    }

    setComms(commsService: CommsService) {
        this.#commsService = commsService;
        return this;
    }

    setSelectedFeature(selectedFeature: SelectedFeature) {
        this.#selectedFeature = selectedFeature;
        return this;
    }

    build(): IKanbanService {
        if (this.#type === "TODO") {
            return new ToDoKanbanService();
        } else {
            return new JiraKanbanService(this.#commsService, this.#selectedFeature,
                this.#type === "USER_STORY" ? JIRA_TYPE.USER_STORY : JIRA_TYPE.DEPENDENCY);
        }
    }
}