type Productivity = {
    completedTasks: CompletedTask[];
    inProgressTasks: Task[];
    timeRemaining: number;
    timeConsumed: number;
    taskProductivity: number;
    overallProductivity: number;
}

export type Task = {
    title: string;
    duration: number;
    start: number;
    productivity: number;
    time: number;
}

export type CompletedTask = Task & {
    completed: number;
}

export default Productivity;