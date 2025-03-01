import CommunicationEvents from "../renderer/types/CommunicationEvent";
import ICommunicationService from "./service/ICommunicationService";
import CommsService from "./service/impl/CommsService";
import aiUtilsInstance, {models} from "./utils/AiUtils";

export default async function translate() {
    const commsService: ICommunicationService = new CommsService();

    const translateEmail = async ([email]: string[]) => {

        const promptMsg = `
        Remove any french mistakes in the email. Do not change the tone or change the content of the text.
        You are allowed only to improve the flow of the sentence if needed.
        Also return in this json format
        {
            "content": "email",
            "subject": "email subject"
        }
        You should not not add any symbols etc so that the json string can be parsed easily to a javascript object.
        If in the email you do not have a subject, you should generate one.
        Here is the email to correct: ${email}
    `;

        try {
            const { getAiResponse } = aiUtilsInstance;
            const result = await getAiResponse(promptMsg, models.geminiModel);
            return { error: false, result };
        } catch (error) {
            console.error("Error parsing AI response:", error);
            return {
                error: true,
                result: "Failed to parse AI response"
            };
        }
    };

    commsService.getRequest(CommunicationEvents.translateEmail, async (email: string[]) => {
        const response = await translateEmail(email);
        return response;
    });
}
