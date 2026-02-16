import CommunicationEvents from "../../renderer/types/CommunicationEvent";
import ICommunicationService from "../service/ICommunicationService";
import IUserStoryDbService from "../service/IUserStoryDbService";
import Handler from "./Handler";

export default class UserStoryHandler implements Handler {

    #userStoryDbService: IUserStoryDbService;
    #commsService: ICommunicationService;

    constructor(userStoryDbService: IUserStoryDbService, commsService: ICommunicationService) {
        this.#commsService = commsService;
        this.#userStoryDbService = userStoryDbService;
    }

    execute() {
        this.#commsService.getRequest(CommunicationEvents.getStories, async () => {
            return await this.#userStoryDbService.getStories();
        });

        this.#commsService.getRequest(CommunicationEvents.addStory, async ([{ title, storyPoint, epicRef }]) => {
            return await this.#userStoryDbService.addStory(title, storyPoint, epicRef);
        });

        this.#commsService.getRequest(CommunicationEvents.modifyStory, async ([{ id, title, storyPoint, epicRef }]) => {
            return await this.#userStoryDbService.modifyStory(id, title, storyPoint, epicRef);
        });

        this.#commsService.getRequest(CommunicationEvents.removeStory, async ([{ id }]) => {
            return await this.#userStoryDbService.removeStory(id);
        });
    }
}