import CommunicationEvents from "../renderer/types/CommunicationEvent";
import FeatureInputType from "../renderer/types/FeatureGenerator/FeatureInput";
import { RefineData, SummaryData } from "../renderer/types/FeatureGenerator/FinalReport";
import ICommunicationService from "./service/ICommunicationService";
import CommsService from "./service/impl/CommsService";
import aiUtilsInstance from "./utils/AiUtils";

export async function summaryFeature() {
    const commsService: ICommunicationService = new CommsService();

    const summary = async ([{ feature, currentContent }]: SummaryData[]) => {

        const promptMsg = `
      provided the following user stories, acceptance criteria, and effort estimates based on a feature.
      
      Original Feature:
      Description: ${feature.description}
      Additional Context: ${feature.context}
      
      Current User Stories, Acceptance Criteria, Estimates and questions:
      ${JSON.stringify(currentContent, null, 2)}
      
      Please write a feature summary based on the information. The summary should give an overview of the feature and the benefits that it will bring.
      Please also write a benefit hypothesis which will explain the benefits to the end user and the system.
      Return the refined content in a JSON structure as shown below:
        {
            "summary": "Feature summary goes here",
            "benefitHypothesis": "Benefit hypothesis goes here"
        }	
      The featureSummary and benefitHypothesis should be in paragraph format and should be straightforward, not containing symbols etc...
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

    commsService.getRequest(CommunicationEvents.summaryFeature, async (summaryData: SummaryData[]) => {
        const response = await summary(summaryData);
        return response;
    });
}
