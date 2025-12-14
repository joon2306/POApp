import { Epic, UserStory } from "../components/Plan/types/types";
import { Err, Ok, Result } from "../types/Result";
import AbstractEpicHelper from "./AbstractEpicHelper";

export default class StoryHelper extends AbstractEpicHelper<{epicRef: number, story: UserStory}> {

    private epics: Epic[] = [];

    constructor(epics: Epic[]) {
        super();
        this.epics = epics;
    }

    protected areEpicsEqual(_epicA: Epic, epicB: Epic): boolean {

        return epicB.stories.some(story => story.id !== undefined);
    }

    public retrieveUpdated(epics: Epic[]): Result<{epicRef: number, story: UserStory}, Error> {
        if (this.epics.length !== epics.length) {
            return new Err(new Error("Epic lists have different lengths."));
        }

        const updatedEpics = this.epics.filter(exitingEpic => epics.some(newEpic => !this.areEpicsEqual(exitingEpic, newEpic)));

        if (updatedEpics.length !== 1) {
            return new Err(new Error("There are multiple or no updated epics."));
        }

        const updatedStory = updatedEpics[0].stories.find(story => story.id === undefined);
        if (!updatedStory) {
            return new Err(new Error("No new story found in the updated epic."));
        }

        this.epics = epics;

        return new Ok({ epicRef: updatedEpics[0].id!, story: updatedStory });
    }
}