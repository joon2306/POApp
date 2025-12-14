import { UserStory } from "../components/Plan/types/types";

export default interface IStoryService {

    getStories(epicRef: number): Promise<UserStory[]>;

    modifyStory(story: UserStory): Promise<number>;

    removeStory(story: UserStory): Promise<void>;
}