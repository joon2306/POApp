import { SelectedFeature } from "../../components/PulseBoard/PulseRouter";
import CommunicationEvents from "../../types/CommunicationEvent";
import { GenericResponse } from "../../types/Generic";
import { KanbanCardType, KanbanFormValue, KanbanStatus } from "../../types/KanbanTypes";
import { JiraServerResponse, JiraType } from "../../types/Pulse/Pulse";
import { IKanbanService } from "../IKanbanService";
import CommsService from "./CommsService";

export default class JiraKanbanService implements IKanbanService {

    #commsService: CommsService;
    #selectedFeature: SelectedFeature;
    #type: JiraType;
    constructor(commsService: CommsService, selectedFeature: SelectedFeature, type: JiraType) {
        this.#commsService = commsService;
        this.#selectedFeature = selectedFeature
        this.#type = type;
    }

    #jiraToKanbanCard(jira: JiraServerResponse) {
        return {
            id: jira.jiraKey,
            status: jira.status,
            description: jira.title,
            title: jira.jiraKey,
            target: jira.target,
        } as KanbanCardType;
    }

    #kanbanToJira(kanbanCard: KanbanCardType) {
        return {
            jiraKey: kanbanCard.title,
            status: kanbanCard.status,
            target: kanbanCard.target,
            title: kanbanCard.description,
            type: this.#type,
            piRef: this.#selectedFeature.piRef,
            featureRef: this.#selectedFeature.featureRef
        } as JiraServerResponse;
    }

    async getKanbanCards(): Promise<KanbanCardType[]> {
        const { data: jiras, error } = await this.#commsService.sendRequest<GenericResponse<JiraServerResponse[]>>(CommunicationEvents.getJiraByFeature, this.#type, this.#selectedFeature.featureRef);
        if (error) {
            console.error("failure to retrieve jira kanban cards");
            return [];
        }

        return jiras.map(jira => this.#jiraToKanbanCard(jira));
    }

    deleteKanbanCards(title: string): void {
        this.#commsService.sendRequest(CommunicationEvents.completeJira, title);
    }
    modifyKanbanCard({ title, description, target }: KanbanFormValue, status: number | undefined): void {
        this.#commsService.sendRequest(CommunicationEvents.modifyJira, this.#kanbanToJira({
            id: "",
            description,
            status: status as KanbanStatus ?? 0,
            title,
            target,
            priority:1,
            time: 30,
        }))
    }
    addKanbanCard({ title, description, target }: KanbanFormValue): void {
        this.#commsService.sendRequest(CommunicationEvents.createJira, this.#kanbanToJira({
            id: "",
            description,
            status: 1,
            title,
            target,
            priority: 1,
            time: 30
        }));
    }
}