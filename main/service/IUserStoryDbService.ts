import DbUserStory from "../model/DbUserStory";

export default interface IUserStoryDbService {
    getStories(): Promise<DbUserStory[]>;
    addStory(title: string, storyPoint: number, epicRef: number): Promise<number>;
    modifyStory(id: number, title: string, storyPoint: number, epicRef: number): Promise<void>;
    removeStory(id: number): Promise<void>;
}