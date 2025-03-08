import CommunicationEvents from "../../types/CommunicationEvent";
import ICommsService from "../ICommsService";
import CommsService from "./CommsService";
import IJiraGeneratorService from "../IJiraGeneratorService";
import { AiJiraResponse, JiraFormData } from "../../types/JiraGenerator/JiraTypes";
import { JiraReportData } from "../../components/JiraGenerator/JiraReport";

let jiraGeneratorService = null;
export default class JiraGeneratorService implements IJiraGeneratorService {

    private commsService: ICommsService = null;

    constructor() {
        if (jiraGeneratorService == null) {
            this.commsService = new CommsService();
            jiraGeneratorService = this;
        }
        return jiraGeneratorService;
    }
    async generateJira(jiraFormData: JiraFormData): Promise<AiJiraResponse> {
        return await this.commsService.sendRequest(CommunicationEvents.generateJira, jiraFormData);
    }
}