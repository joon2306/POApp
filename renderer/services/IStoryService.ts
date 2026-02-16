import { UserStory } from "../components/Plan/types/types";

export default interface IStoryService {
    addStory(story: UserStory): Promise<UserStory>;
    modifyStory(story: UserStory): Promise<void>;
    removeStory(story: UserStory): Promise<void>;
}