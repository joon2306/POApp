import { UserStory } from "../../components/Plan/types/types";
import IEpicService from "../IEpicService";
import IStoryService from "../IStoryService";

let instance: UserStoryService = null;
export default class UserStoryService implements IStoryService {

    private stories: UserStory[] = [];

    constructor() {
        if (instance === null) {
            instance = this;
        }
        return instance;
    }

    public getStories(epicRef: number): Promise<UserStory[]> {
        return Promise.resolve(this.stories.filter(s => s.epicRef === epicRef));
    }

    private addStory(story: UserStory): Promise<number> {
        story.id = this.stories.length + 1;
        this.stories.push(story);
        return Promise.resolve(story.id);
    }

    public modifyStory(story: UserStory): Promise<number> {
        const hasId = !!story.id;
        if (!hasId) {
            return this.addStory(story);
        }
        this.stories = this.stories.map(s => {
            if (s.id === story.id) {
                return story;
            }
            return s;
        });
        return Promise.resolve(0);
    }

    public removeStory(story: UserStory): Promise<void> {
        this.stories = this.stories.filter(s => s.id !== story.id);
        return Promise.resolve();
    }


}