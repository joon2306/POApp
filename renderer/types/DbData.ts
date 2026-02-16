export interface DbEpic {
    id: number;
    name: string;
    featureRef: number;
}

export interface DbUserStory {
    id: number;
    title: string;
    storyPoint: number;
    epicRef: number;
}
