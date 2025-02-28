import CommunicationEvents from "../renderer/types/CommunicationEvent";
import FeatureInputType from "../renderer/types/FeatureGenerator/FeatureInput";
import { RefineData } from "../renderer/types/FeatureGenerator/FinalReport";
import ICommunicationService from "./service/ICommunicationService";
import CommsService from "./service/impl/CommsService";
import aiUtilsInstance from "./utils/AiUtils";

export async function refineFeature() {
    const commsService: ICommunicationService = new CommsService();

    const refine = async ([{ feature, currentContent, feedback, iterations }]: RefineData[]) => {

        const promptMsg = `
      Refine the following user stories, acceptance criteria, and effort estimates based on the feedback provided.
      
      Original Feature:
      Description: ${feature.description}
      Additional Context: ${feature.context}
      
      Current User Stories, Acceptance Criteria, Estimates and questions:
      ${JSON.stringify(currentContent, null, 2)}
      
      Feedback from Product Owner (Iteration ${iterations}):
      ${feedback}
      
      Please improve the content based on this feedback. Return the refined content in the same JSON structure:
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

    commsService.getRequest(CommunicationEvents.refineFeature, async (refineData: RefineData[]) => {
        const response = await refine(refineData);
        return response;
    });
}
