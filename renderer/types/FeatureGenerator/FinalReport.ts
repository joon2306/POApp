import FeatureInputType from "./FeatureInput";

export interface UserStory {
  id: string;
  story: string;
}

export interface Content {
  userStories: UserStory[];
  acceptanceCriteria: Record<string, string[]>;
  estimates: Record<string, string>;
  questions: string[];
}

export interface FeatureSummary {
  summary: string;
  benefitHypothesis: string;
}

export interface FinalReportProps {
  content: Content;
  feature: FeatureInputType;
  iterations: number;
  onReset: () => void;
  featureSummary: FeatureSummary;
}

export interface GeneratedOutputProps {
  content: Content;
  iteration: number;
}

export interface AiResponse {
  error: boolean;
  result: Content | SummaryFeatureProps
}

export interface RefineData {
  feature: FeatureInputType;
  currentContent: Content;
  feedback: string;
  iterations: number;
}


export interface SummaryData {
  feature: FeatureInputType;
  currentContent: Content;
}

export interface SummaryFeatureProps {
  summary: string,
  benefitHypothesis: string
}

export interface ExportData {
  feature: FeatureInputType,
  content: Content,
  summary: string,
  benefitHypothesis: string
}