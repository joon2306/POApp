import { JiraReportData } from "../components/JiraGenerator/JiraReport";
import { AiJiraResponse, JiraFormData } from "../types/JiraGenerator/JiraTypes";

export default interface IJiraGeneratorService {
    generateJira: (jiraFormData: JiraFormData) => Promise<AiJiraResponse>;
}