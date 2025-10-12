import CommunicationEvents from "../renderer/types/CommunicationEvent";
import { JiraFormData } from "../renderer/types/JiraGenerator/JiraTypes";
import ICommunicationService from "./service/ICommunicationService";
import CommsService from "./service/impl/CommsService";
import aiUtilsInstance, { models } from "./utils/AiUtils";

export async function generateJira() {
    const commsService: ICommunicationService = new CommsService();

    const generate = async ([jiraFormData]: JiraFormData[]) => {

        const promptMsg = `
          Generate a jira ticket with the following details:
          ${JSON.stringify(jiraFormData)}

          Important guidelines:
          - Title should be brief (max 80 characters) but descriptive
          - Description should follow this structure:
            * For bugs:
              - Clear problem statement
              - Steps to reproduce
              - Expected behavior
              - Actual behavior
              - Impact/severity
            * For features:
              - Business value/objective
              - Proposed solution
              - Acceptance criteria
            * For tasks:
              - Purpose/goal
              - Detailed requirements
              - Any technical considerations

          Use professional language and be specific. Avoid vague terms.
          Priority should be one of: Low, Medium, High, Critical

          Format the response as JSON with the structure:
          {
            "title": "Title of the ticket",
            "description": "A clear and concise description of the ticket containing all details.
            For instance for bug it should have details about steps expected results etc.",
            "type": "Type of the ticket",
            "priority": "Priority of the ticket"
          }
        `;

        try {
            const { getAiResponse } = aiUtilsInstance;
            const result = await getAiResponse(promptMsg, models.dolphin);
            return { error: false, result };
        } catch (error) {
            console.error("Error parsing AI response:", error);
            return {
                error: true,
                message: "Failed to parse AI response"
            };
        }
    };

    commsService.getRequest(CommunicationEvents.generateJira, async (jiraInput: JiraFormData[]) => {
        const response = await generate(jiraInput);
        return response;
    });
}
