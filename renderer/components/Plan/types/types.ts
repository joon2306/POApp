
export interface Feature {
  title: string;
}

export interface UserStory {
  id?: number;
  epicRef?: number;
  title: string;
  acceptanceCriteria: string[];
  points: number;
}

export interface Epic {
  id?: number;
  name: string;
  description: string;
  stories: UserStory[];
}

export interface ImplementationStep {
  id: string;
  content: string;
  subSteps: ImplementationStep[];
  isExpanded?: boolean;
}

export interface TechnicalAnalysis {
  implementationSteps: ImplementationStep[];
  dependencies: string[];
  edgeCases: string[];
  effortEstimate: string;
}

export interface TestCase {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  preConditions: string;
  steps: string;
  expectedResult: string;
}

export interface GeneratedPlan {
  epics: Epic[];
  technicalAnalysis: TechnicalAnalysis;
  testCases: TestCase[];
}
