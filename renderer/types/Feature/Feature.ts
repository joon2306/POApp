export type JiraKey = `ADTCUST-${number}` | `ADTDEVI-${number}` | `GXDD-${number}`;

type JiraState = "PENDING" | "IN_PROGRESS" | "ON_HOLD";

export const JIRA_STATE: Record<JiraState, 1 | 2 | 3> = {
    "PENDING": 1,
    "IN_PROGRESS": 2,
    "ON_HOLD": 3
} as const;

export type target = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type JiraTicket = {
    title: JiraKey;
    state: typeof JIRA_STATE[keyof typeof JIRA_STATE];
    target: target;
}

export const SPRINT_OPTIONS = [
    { value: 1, label: "Sprint 1" },
    { value: 2, label: "Sprint 2" },
    { value: 3, label: "Sprint 3" },
    { value: 4, label: "Sprint 4" },
    { value: 5, label: "Sprint 5" },
    { value: 6, label: "Sprint IP" }
]


export type Feature = {
    title: string;
    target: target;
    featureKey: JiraKey;
    userStories: Array<JiraTicket>;
    dependencies: Array<JiraTicket>;
    completedStories: Array<JiraKey>;
}