import { PulseFormData } from "../../hooks/usePulseForm";
import CommunicationEvents from "../../types/CommunicationEvent";
import { Feature, JiraKey, JiraTicket } from "../../types/Feature/Feature";
import { PiTitle } from "../../types/Feature/Pi";
import { GenericResponse } from "../../types/Generic";
import { PlannedFeatureServerResponse, PlannedPulse } from "../../types/Pulse/Pulse";
import { Sprint } from "../../utils/PulseUtils";
import IPulseService from "../IPulseService";
import CommsService from "./CommsService";

let instance: PlannedPulseService = null;
export default class PlannedPulseService implements IPulseService {

    #commsService: CommsService;

    constructor(commsService: CommsService) {
        if (instance === null) {
            this.#commsService = commsService;
            instance = this;
        }
        return instance;
    }

    #pulseToFeature(pulse: PulseFormData ): PlannedFeatureServerResponse {
        return {
            title: pulse.featureKey.value as JiraKey,
            size:  1,
            description: pulse.featureTitle.value as string,
            piRef: pulse.piTitle.value as string
        }
    }

    #featureToPulse(feature: PlannedFeatureServerResponse): PlannedPulse {
        return {
            title: feature.title,
            description: feature.description,
            size: feature.size,
            type: "PLANNED"
        }
    }

    saveFeature(pulse: PulseFormData): void {
        this.#commsService.sendRequest(CommunicationEvents.createPlannedFeature, this.#pulseToFeature(pulse))
    }

    async getAll(_activeSprint: Sprint, piTitle: PiTitle): Promise<PlannedPulse[]> {

        const { data, error } = await this.#commsService.sendRequest<GenericResponse<PlannedFeatureServerResponse[]>>(CommunicationEvents.getAllPlannedFeature, piTitle);

        if (error || data.length === 0) {
            return [];
        }

        return data.map(r => this.#featureToPulse(r));

    }


    deleteJira(jiraKey: JiraKey) {
        this.#commsService.sendRequest(CommunicationEvents.deletePlannedFeature, jiraKey);
    }


    modifyFeature(pulse: PulseFormData): void {
        this.#commsService.sendRequest(CommunicationEvents.modifyPlannedFeature, this.#pulseToFeature(pulse))
    }



}