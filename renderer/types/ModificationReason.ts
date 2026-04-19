export type ModificationReasonType = 'TARGET_CHANGE' | 'BLOCKED' | 'LATE_COMPLETION';

export type ModificationReasonCategory =
  | 'SCOPE_CHANGE'
  | 'DEPENDENCY_BLOCKED'
  | 'UNDERESTIMATED'
  | 'RESOURCE_ISSUE'
  | 'REQUIREMENT_CHANGE'
  | 'OTHER';

export const REASON_CATEGORIES = [
  { value: 'SCOPE_CHANGE', label: 'Scope Change' },
  { value: 'DEPENDENCY_BLOCKED', label: 'Dependency Took Too Long' },
  { value: 'UNDERESTIMATED', label: 'Underestimated Complexity' },
  { value: 'RESOURCE_ISSUE', label: 'Resource Issue' },
  { value: 'REQUIREMENT_CHANGE', label: 'Requirement Change' },
  { value: 'OTHER', label: 'Other' },
];

export type ModificationReason = {
  jiraKey: string;
  reason: string;
  category?: ModificationReasonCategory;
  type: ModificationReasonType;
  previousValue?: string;
  newValue?: string;
  activeSprint?: string;
  piRef: string;
}
