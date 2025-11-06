export const KanbanType = {
    TODO: 1,
    FEATURE: 2,
} as const;
interface KanbanDbItem {
    id?: number;
    title: string;
    description: string;
    priority: number;
    status: number;
    time: number;
    start?: number;
    duration?: number;
    type: typeof KanbanType[keyof typeof KanbanType]
    feature_id?: string;
}

export type { KanbanDbItem };


