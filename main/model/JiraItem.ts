export const JIRA_STATUS = {
    PENDING: 1,
    IN_PROGRESS: 2,
    ON_HOLD: 3,
    COMPLETED: 4 
} as const;

export const JIRA_TYPE = {
    FEATURE: 1,
    DEPENDENCY: 2,
    USER_STORY: 3
} as const;

export type PiRef = `SL${number}.${number}`;
export type JiraKey = `ADTCUST-${number}` | `ADTDEVI-${number}` | `GXDD-${number}`;
export type JiraItem = {
    jiraKey: `ADTCUST-${number}` | `ADTDEVI-${number}` | `GXDD-${number}`;
    title: string;
    target: 1 | 2 | 3 | 4 | 5 | 6;
    status: typeof JIRA_STATUS [keyof typeof JIRA_STATUS];
    type: typeof JIRA_TYPE[keyof typeof JIRA_TYPE];
    piRef: PiRef;
    featureRef: JiraKey;
}