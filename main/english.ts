import CommunicationEvents from "../renderer/types/CommunicationEvent";
import ICommunicationService from "./service/ICommunicationService";
import CommsService from "./service/impl/CommsService";
import aiUtilsInstance, {models} from "./utils/AiUtils";

export default async function improve() {
    const commsService: ICommunicationService = new CommsService();

    const translate = async ([input]: string[]) => {

        const promptMsg = `
        Remove any english mistakes in the text below.
        You are allowed to improve the flow of the sentence if needed by making it more readable and structure the sentences better.
        Also return in this json format
        {
            "content": "improved text"
        }
        You should not not add any symbols etc so that the json string can be parsed easily to a javascript object.
        Here is the text to correct: ${input}
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

    commsService.getRequest(CommunicationEvents.improveEnglish, async (english: string[]) => {
        const response = await translate(english);
        return response;
    });
}
