export type ModificationReasonType = 'TARGET_CHANGE' | 'BLOCKED' | 'LATE_COMPLETION';

export type ModificationReasonCategory =
  | 'SCOPE_CHANGE'
  | 'DEPENDENCY_BLOCKED'
  | 'UNDERESTIMATED'
  | 'RESOURCE_ISSUE'
  | 'REQUIREMENT_CHANGE'
  | 'OTHER';

export type ModificationReasonItem = {
  id?: number;
  jiraKey: string;
  reason: string;
  category?: ModificationReasonCategory;
  type: ModificationReasonType;
  previousValue?: string;
  newValue?: string;
  activeSprint?: string;
  timestamp: number;
  piRef: string;
}
