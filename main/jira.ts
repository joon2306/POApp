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

          Your response should be clear and concise and also formatted correctly using bullet points and all necessary details.
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
            const result = await getAiResponse(promptMsg, models.geminiModel);
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
