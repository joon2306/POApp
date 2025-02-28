import FeatureInputType from "../types/FeatureGenerator/FeatureInput";
import { AiResponse } from "../types/FeatureGenerator/FinalReport";

export interface IFeatureGeneratorService {
    generateFeature(featureInput: FeatureInputType): Promise<AiResponse>;
}