import OpenAI from "openai";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources";

export interface OpenAIConfig {
    baseURL: string;
    apiKey: string;
}

export interface Message {
    role: string;
    content: string;
}

export interface Payload {
    model: string;
    messages: Message[];
    temperature: number;
}

const AiUtils = () => {
    const nemotronModel = "nvidia/llama-3.1-nemotron-70b-instruct:free";

    const apiKey = "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";

    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey
    } as OpenAIConfig);

    const parseInputString = (input: string): any => {
        console.log("inputString: ", input);

        // Try to parse the input directly as JSON
        try {
            const parsedObject = JSON.parse(input);
            return parsedObject;
        } catch (directParseError) {
            console.log("Direct JSON parse failed, trying to extract JSON content...", directParseError);
        }

        console.log("trying to extract with regex");

        // Extract the JSON content from the input string
        // This pattern matches content between triple backticks with optional language identifier
        const match = input.match(/```(?:json)?\n?([\s\S]+?)\n?```/);

        if (!match) {
            throw new Error("Invalid input format");
        }

        const jsonString = match[1];

        try {
            const parsedObject = JSON.parse(jsonString);
            console.log("parsedObject: ", parsedObject);
            return parsedObject;
        } catch (error) {
            throw new Error("Error parsing JSON object: " + (error as Error).message);
        }
    };

    const getPayload = (promptMsg: string): Payload => {
        return {
            model: nemotronModel, // Use appropriate model
            messages: [
                {
                    role: "user",
                    content: promptMsg
                }
            ],
            temperature: 0.85
        };
    };

    const getAiResponse = async (promptMsg: string, isNotJson = false): Promise<any> => {
        const maxAttempts = 5;
        let attempt = 0;
        let result;

        while (attempt < maxAttempts) {
            try {
                const completion = await openai.chat.completions.create(getPayload(promptMsg) as ChatCompletionCreateParamsNonStreaming);
                const msg = completion.choices[0].message?.content;
                if (isNotJson) {
                    return msg;
                }
                result = parseInputString(msg);
                return result; // Return the result if successful
            } catch (err) {
                console.error(`Attempt ${attempt + 1} - Error parsing AI response:`, err);
                attempt++;
                if (attempt >= maxAttempts) {
                    throw new Error("Max attempts reached. Failed to get a valid AI response.");
                }
            }
        }
    };

    return {
        getAiResponse
    };
};

// Create a single instance of AiUtils
const aiUtilsInstance = AiUtils();

export default aiUtilsInstance;