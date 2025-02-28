import FeatureInputType from "../types/FeatureGenerator/FeatureInput";

export interface IFeatureGeneratorService {
    generateFeature(featureInput: FeatureInputType): any;
}