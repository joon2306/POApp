import { NextResponse } from "next/server";
import FeatureInputType from "../types/FeatureGenerator/FeatureInput";
import { AiResponse, ExportData, RefineData, SummaryData } from "../types/FeatureGenerator/FinalReport";

export interface IFeatureGeneratorService {
    generateFeature(featureInput: FeatureInputType): Promise<AiResponse>;

    refineFeature(refineData: RefineData): Promise<AiResponse>;

    summaryFeature(summaryData: SummaryData): Promise<AiResponse>;

    exportFeature(exportData: ExportData): Promise<any>;
}