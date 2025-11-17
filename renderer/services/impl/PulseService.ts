import { PulseFormData } from "../../hooks/usePulseForm";
import CommunicationEvents from "../../types/CommunicationEvent";
import { Feature, JiraKey, JiraTicket } from "../../types/Feature/Feature";
import { PiTitle } from "../../types/Feature/Pi";
import { GenericResponse } from "../../types/Generic";
import { JIRA_STATUS, JIRA_TYPE, JiraServerResponse, Pulse } from "../../types/Pulse/Pulse";
import { PulseUtils, Sprint } from "../../utils/PulseUtils";
import IPulseService from "../IPulseService";
import CommsService from "./CommsService";

let instance: PulseService = null;
export default class PulseService implements IPulseService {

    #commsService: CommsService;

    constructor(commsService: CommsService) {
        if (instance === null) {
            this.#commsService = commsService;
            instance = this;
        }
        return instance;
    }

    #pulseToFeature(pulse: PulseFormData): JiraServerResponse {
        return {
            jiraKey: pulse.featureKey.value as JiraKey,
            status: 1,
            piRef: pulse.piTitle.value as PiTitle,
            target: pulse.featureTarget.value as typeof JIRA_STATUS[keyof typeof JIRA_STATUS],
            title: pulse.featureTitle.value as string,
            type: JIRA_TYPE.FEATURE
        }
    }

    saveFeature(pulse: PulseFormData): void {
        this.#commsService.sendRequest(CommunicationEvents.createJira, this.#pulseToFeature(pulse))
    }

    async getAll(activeSprint: Sprint, piTitle: PiTitle): Promise<Pulse[]> {

        const { data, error } = await this.#commsService.sendRequest<GenericResponse<JiraServerResponse[]>>(CommunicationEvents.getJiraByPi, piTitle);

        if (error || data.length === 0) {
            return [];
        }

        const features = data.filter(item => item.type === JIRA_TYPE.FEATURE);
        const userStories = data.filter(item => item.type === JIRA_TYPE.USER_STORY);
        const dependencies = data.filter(item => item.type === JIRA_TYPE.DEPENDENCY);



        return features
            .map(feature => {
                return {
                    title: feature.title,
                    target: feature.target,
                    featureKey: feature.jiraKey,
                    userStories: userStories.filter(story => story.status !== JIRA_STATUS.COMPLETED && story.featureRef === feature.jiraKey).map(story => {
                        return { title: story.jiraKey, state: story.status } as JiraTicket;
                    }),
                    dependencies: dependencies.filter(dependency => dependency.featureRef === feature.jiraKey).map(dependency => {
                        return { title: dependency.jiraKey, state: dependency.status } as JiraTicket;
                    }),
                    completedStories: userStories.filter(story => story.status === JIRA_STATUS.COMPLETED && story.featureRef === feature.jiraKey).map(story => story.jiraKey)
                } as Feature;
            })
            .map(feature => {
                return { ...feature, state: PulseUtils.getState(feature, activeSprint), tags: PulseUtils.getTags(feature, activeSprint) }
            }).sort((a, b) => {
                const aCompleted = a.state === "COMPLETED";
                const bCompleted = b.state === "COMPLETED";

                if (aCompleted && !bCompleted) { return -1 };
                if (bCompleted && !aCompleted) { return 1 };
                return a.target - b.target;
            });
    }


    deleteJira(jiraKey: JiraKey) {
        this.#commsService.sendRequest(CommunicationEvents.deleteJira, jiraKey);
    }


    modifyFeature(pulse: PulseFormData): void {
        this.#commsService.sendRequest(CommunicationEvents.modifyJira, this.#pulseToFeature(pulse))
    }



}