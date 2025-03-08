export type JiraType = 'bug' | 'epic' | 'user-story' | 'task';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface JiraFormData {
  type: JiraType;
  priority: Priority;
  description: string;
  stepsToReproduce?: string;
  expectedResult?: string;
  actualResult?: string;
  acceptanceCriteria?: string;
  epicDescription?: string;
}

export interface JiraFormProps {
  onSubmit: (data: JiraFormData) => void;
}

export interface JiraSelectType {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
  value: string;
}

export const defaultJiraFormData: JiraFormData = {
  type: 'bug',
  priority: 'medium',
  description: '',
  stepsToReproduce: '',
  expectedResult: '',
  actualResult: ''
};