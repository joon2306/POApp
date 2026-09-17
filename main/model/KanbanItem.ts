interface KanbanDbItem {
    id?: number;
    title: string;
    description: string;
    priority: number;
    status: number;
    time: number;
    order?: number;
    start?: number;
    duration?: number;
}

export type { KanbanDbItem };


