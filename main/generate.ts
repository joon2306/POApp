import CommunicationEvents from "../renderer/types/CommunicationEvent";
import FeatureInputType from "../renderer/types/FeatureGenerator/FeatureInput";
import ICommunicationService from "./service/ICommunicationService";
import CommsService from "./service/impl/CommsService";
import aiUtilsInstance from "./utils/AiUtils";

export async function generateFeature() {
    const commsService: ICommunicationService = new CommsService();

    const generate = async ([{ description, context }]: FeatureInputType[]) => {
        console.log("description: ", description);

        if (!context) {
            context = "No Additional Context";
        }

        const promptMsg = `
          Generate user stories, acceptance criteria, and effort estimates for the following feature:
    
          Feature Description: ${description}
          Additional Context: ${context}
    
          Provide the following:
          1. A set of user stories in the format "As a [role], I want [feature] so that [benefit]"
          2. Acceptance criteria for each user story
          3. Effort estimates for each user story (using T-shirt sizing: XS, S, M, L, XL)
          4. ask important questions about the feature you think need to be clarified for proper understanding of the feature.
          Your questions need to cover all cases as the product owner may have missed something in this analysis.
    
          Format the response as JSON with the structure:
          {
            "userStories": [
              {
                "id": "US-1",
                "story": "As a...",
                "role": "...",
                "feature": "...",
                "benefit": "..."
              }
            ],
            "acceptanceCriteria": {
              "US-1": [
                "Criteria 1",
                "Criteria 2"
              ]
            },
            "estimates": {
              "US-1": "M"
            },
            "questions": [
              "Question 1",
              "Question 2"
            ]
          }
        `;

        try {
            const { getAiResponse } = aiUtilsInstance;
            const result = await getAiResponse(promptMsg);
            return { error: false, result };
        } catch (error) {
            console.error("Error parsing AI response:", error);
            return {
                error: true,
                message: "Failed to parse AI response"
            };
        }
    };

    commsService.getRequest(CommunicationEvents.generateFeature, async (featureInput: FeatureInputType[]) => {
        const response = await generate(featureInput);
        return response; 
    });
}
