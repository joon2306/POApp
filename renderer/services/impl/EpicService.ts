import { Epic, UserStory } from "../../components/Plan/types/types";
import IEpicService from "../IEpicService";
import IStoryService from "../IStoryService";

let instance: EpicService = null;
export default class EpicService implements IEpicService {

    private epics: Epic[] = [];
    private userStoryService: IStoryService;

    constructor(userStoryService: IStoryService) {
        if (instance === null) {
            this.userStoryService = userStoryService;
            instance = this;
        }
        return instance;
    }

    public async getEpics(): Promise<Epic[]> {
        for (const epic of this.epics) {
            epic.stories = await this.userStoryService.getStories(epic.id);
        }
        return Promise.resolve(this.epics);
    }

    private addEpic(epic: Epic): Promise<number> {
        epic.id = this.epics.length + 1;
        this.epics.push(epic);
        return Promise.resolve(epic.id);
    }

    public modifyEpic(epic: Epic): Promise<number> {
        const hasId = !!epic.id;
        if (!hasId) {
            return this.addEpic(epic);
        }
        this.epics = this.epics.map(e => {
            if (e.id === epic.id) {
                return epic;
            }
            return e;
        });
        return Promise.resolve(0);
    }

    public removeEpic(epic: Epic): Promise<void> {
        this.epics = this.epics.filter(e => e.name !== epic.name);
        // need to remove associated user stories as well
        epic.stories.forEach(story => {
            this.userStoryService.removeStory(story);
        });
        return Promise.resolve();
    }


}