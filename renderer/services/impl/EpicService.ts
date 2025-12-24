import { Epic, UserStory } from "../../components/Plan/types/types";
import IEpicService from "../IEpicService";
import IStoryService from "../IStoryService";

let instance: EpicService = null;
export default class EpicService implements IEpicService {

    private epics: Epic[] = [];
    private userStoryService: IStoryService;
    private featureRef: string;

    constructor(userStoryService: IStoryService, featureRef: string) {
        if (instance === null) {
            this.userStoryService = userStoryService;
            this.featureRef = featureRef;
            instance = this;
        }
        return instance;
    }

    public async getEpics(): Promise<Epic[]> {
        const filteredEpics = this.epics.filter(e => e.featureRef === this.featureRef);
        for (const epic of filteredEpics) {
            epic.stories = await this.userStoryService.getStories(epic.id);
        }
        return Promise.resolve(filteredEpics);
    }

    private addEpic(epic: Epic): Promise<number> {
        epic.id = this.epics.length + 1;
        this.epics.push(epic);
        console.log("adding epic: ", epic);
        return Promise.resolve(epic.id);
    }

    private handleModifyEpic(epic: Epic): Promise<number> {
        const hasId = !!epic.id;
        if (!hasId) {
            console.log("epic has no id, adding new epic instead of modifying: ", epic);
            return this.addEpic(epic);
        }
        this.epics = this.epics.map(e => {
            if (e.id === epic.id) {
                return epic;
            }
            return e;
        });
        return Promise.resolve(epic.id);
    }

    public modifyEpic(epic: Epic): Promise<number> {
        console.log("modifying epic: ", epic);
        return this.handleModifyEpic(epic);
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