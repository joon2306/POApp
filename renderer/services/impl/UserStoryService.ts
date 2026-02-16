import { UserStory } from "../../components/Plan/types/types";
import CommunicationEvents from "../../types/CommunicationEvent";
import ICommsService from "../ICommsService";
import IStoryService from "../IStoryService";

export default class UserStoryService implements IStoryService {
    
        #commsService: ICommsService;
    
        constructor(commsService: ICommsService) {
            this.#commsService = commsService;
        }
    
        async addStory(story: UserStory): Promise<UserStory> {
            const newId = await this.#commsService.sendRequest<number>(CommunicationEvents.addStory, { title: story.title, storyPoint: story.storyPoint, epicRef: story.epicRef });
            return { ...story, id: newId };
        }
    
        async modifyStory(story: UserStory): Promise<void> {
            await this.#commsService.sendRequest<void>(CommunicationEvents.modifyStory, { id: story.id, title: story.title, storyPoint: story.storyPoint, epicRef: story.epicRef });
        }
    
        async removeStory(story: UserStory): Promise<void> {
            await this.#commsService.sendRequest<void>(CommunicationEvents.removeStory, { id: story.id });
        }
}