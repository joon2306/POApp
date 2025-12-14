import { Epic, UserStory } from "../../components/Plan/types/types";
import { debounce } from "../../helpers/debounce";
import IEpicService from "../IEpicService";
import IStoryService from "../IStoryService";

let instance: EpicService = null;
export default class EpicService implements IEpicService {

    private epics: Epic[] = [];
    private userStoryService: IStoryService;
    private featureRef: string;
    private debounceModify = null;
    private modifiedId: number = 0;

    constructor(userStoryService: IStoryService, featureRef: string) {
        if (instance === null) {
            this.userStoryService = userStoryService;
            this.featureRef = featureRef;
            this.debounceModify = debounce(this.handleModifyEpic.bind(this), 500);
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
        this.modifiedId = epic.id;
        console.log("adding epic: ", epic);
        return Promise.resolve(epic.id);
    }

    private handleModifyEpic(epic: Epic): void {
        this.modifiedId = 0;
        const hasId = !!epic.id;
        if (!hasId) {
            this.addEpic(epic);
            return;
        }
        console.log("modifying epic: ", epic);
        this.epics = this.epics.map(e => {
            if (e.id === epic.id) {
                return epic;
            }
            return e;
        });
    }

    public modifyEpic(epic: Epic): Promise<number> {
        console.log("initial epic: ", epic);
        this.debounceModify(epic);
        return Promise.resolve(this.modifiedId);
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