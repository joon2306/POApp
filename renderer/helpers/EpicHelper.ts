import { Epic } from "../components/Plan/types/types";
import { Err, Ok, Result } from "../types/Result";

export default class EpicHelper {

    private epics: Epic[] = [];

    constructor(epics: Epic[]) {
        this.epics = epics;
    }

    private areEpicsEqual(epicA: Epic, epicB: Epic): boolean {
        if (epicA.name !== epicB.name) {
            return false;
        }

        if (epicA.description !== epicB.description) {
            return false;
        }

        if (epicA.stories.length !== epicB.stories.length) {
            return false;
        }

        return true;
    }

    public retrieveUpdatedEpic(epics: Epic[]): Result<Epic, Error> {
        if (this.epics.length !== epics.length) {
            return new Err(new Error("Epic lists have different lengths."));
        }

        const updatedEpics = this.epics.filter(exitingEpic => epics.some(newEpic => !this.areEpicsEqual(exitingEpic, newEpic)));

        if(updatedEpics.length !== 1) {
            return new Err(new Error("There are multiple or no updated epics."));
        }

        this.epics = epics;

        return new Ok(updatedEpics[0]);
    }
}