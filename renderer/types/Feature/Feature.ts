export type JiraKey = `ADTCUST-${number}` | `ADTDEVI-${number}` | `GXDD-${number}`;

type JiraState = "PENDING" | "IN_PROGRESS" | "ON_HOLD";

export const JIRA_STATE: Record<JiraState, 1 | 2 | 3> = {
    "PENDING": 1,
    "IN_PROGRESS": 2,
    "ON_HOLD": 3
} as const;

export type JiraTicket = {
    title: JiraKey;
    state: typeof JIRA_STATE[keyof typeof JIRA_STATE];
}

export type Feature = {
    title: string;
    target: 1 | 2 | 3 | 4 | 5 | 6;
    featureKey: JiraKey;
    userStories: Array<JiraTicket>;
    dependencies: Array<JiraTicket>;
    completedStories: Array<JiraKey>;
}