import CommunicationEvents from "../../types/CommunicationEvent";
import FeatureInputType from "../../types/FeatureGenerator/FeatureInput";
import { AiResponse, Content } from "../../types/FeatureGenerator/FinalReport";
import ICommsService from "../ICommsService";
import { IFeatureGeneratorService } from "../IFeatureGeneratorService";
import CommsService from "./CommsService";


let featureGeneratorService: FeatureGeneratorService = null;

export class FeatureGeneratorService implements IFeatureGeneratorService {

    private commsService: ICommsService = null;

    constructor() {
        if (featureGeneratorService == null) {
            this.commsService = new CommsService();
            featureGeneratorService = this;
        }

        return featureGeneratorService;
    }

    async generateFeature(featureInput: FeatureInputType): Promise<AiResponse> {	
        return await this.commsService.sendRequest(CommunicationEvents.generateFeature, featureInput);
    }

}
