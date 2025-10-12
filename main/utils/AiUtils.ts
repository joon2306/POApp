import OpenAI from "openai";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources";
import fs from 'fs';
import path from 'path';

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

export const models = {
    nemotronModel: "nvidia/llama-3.1-nemotron-70b-instruct:free",
    geminiModel: "google/gemini-2.0-pro-exp-02-05:free",
    mistral: "mistralai/mistral-nemo:free",
    dolphin: "cognitivecomputations/dolphin3.0-r1-mistral-24b:free"
}

const AiUtils = () => {
    const defaultModel = models.nemotronModel;
    // Read the API key from the file
    const apiKeyPath = path.join('E:', 'PO_APP', 'apiKey.txt');
    let apiKey = '';
    try {
        apiKey = fs.readFileSync(apiKeyPath, 'utf8').trim();
    } catch (error) {
        console.error('Error reading API key from file:', error);
        throw new Error('Failed to read API key from file');
    }

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

        let jsonString = match[1];
        console.log("jsonString: ", jsonString);

        try {
            const parsedObject = JSON.parse(jsonString);
            console.log("parsedObject: ", parsedObject);
            return parsedObject;
        } catch (error) {
            throw new Error("Error parsing JSON object: " + (error as Error).message);
        }
    };

    const getPayload = (promptMsg: string, model: string): Payload => {
        return {
            model: model, // Use appropriate model
            messages: [
                {
                    role: "user",
                    content: promptMsg
                }
            ],
            temperature: 0.85
        };
    };

    const getAiResponse = async (promptMsg: string, model = defaultModel, isNotJson = false,): Promise<any> => {
        const maxAttempts = 5;
        let attempt = 0;
        let result;

        while (attempt < maxAttempts) {
            try {
                const completion = await openai.chat.completions.create(getPayload(promptMsg, model) as ChatCompletionCreateParamsNonStreaming);
                console.log("completion: ", completion);
                const msg = completion.choices[0].message?.content;
                console.log("msg: ", msg);
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