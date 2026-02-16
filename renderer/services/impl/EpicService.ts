import { Epic } from "../../components/Plan/types/types";
import CommunicationEvents from "../../types/CommunicationEvent";
import IEpicService from "../IEpicService";
import ICommsService from "../ICommsService";
import { UserStory } from "../../components/Plan/types/types";
import { DbEpic, DbUserStory } from "../../types/DbData";

export default class EpicService implements IEpicService {

    #commsService: ICommsService;

    constructor(commsService: ICommsService) {
        this.#commsService = commsService;
    }

    async getEpics(): Promise<Epic[]> {
        const [epicsFromDb, storiesFromDb] = await Promise.all([
            this.#commsService.sendRequest<DbEpic[]>(CommunicationEvents.getEpics),
            this.#commsService.sendRequest<DbUserStory[]>(CommunicationEvents.getStories)
        ]);

        const epics: Epic[] = epicsFromDb.map(dbEpic => {
            const storiesForEpic = storiesFromDb
                .filter(dbStory => dbStory.epicRef === dbEpic.id)
                .map(dbStory => ({
                    id: dbStory.id,
                    title: dbStory.title,
                    storyPoint: dbStory.storyPoint,
                    epicRef: dbStory.epicRef,
                }));
            
            return {
                id: dbEpic.id,
                name: dbEpic.name,
                featureRef: dbEpic.featureRef,
                stories: storiesForEpic,
                goal: '' // The 'goal' property is not in the DB, default to empty
            };
        });

        return epics;
    }

    async addEpic(epic: Epic): Promise<Epic> {
        const newId = await this.#commsService.sendRequest<number>(CommunicationEvents.addEpic, { name: epic.name, featureRef: epic.featureRef });
        return { ...epic, id: newId };
    }

    async modifyEpic(epic: Epic): Promise<void> {
        await this.#commsService.sendRequest<void>(CommunicationEvents.modifyEpic, { id: epic.id, name: epic.name, featureRef: epic.featureRef });
    }

    async removeEpic(epic: Epic): Promise<void> {
        await this.#commsService.sendRequest<void>(CommunicationEvents.removeEpic, { id: epic.id });
    }
}
