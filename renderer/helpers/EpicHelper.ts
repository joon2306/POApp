import { Epic } from "../components/Plan/types/types";
import { Err, Ok, Result } from "../types/Result";
import AbstractEpicHelper from "./AbstractEpicHelper";

export default class EpicHelper extends AbstractEpicHelper<Epic> {

    private epics: Epic[] = [];

    constructor(epics: Epic[]) {
        super();
        this.epics = epics;
    }

    protected areEpicsEqual(epicA: Epic, epicB: Epic): boolean {
        if (epicA.name !== epicB.name) {
            return false;
        }

        if (epicA.description !== epicB.description) {
            return false;
        }

        return true;
    }

    public retrieveUpdated(epics: Epic[]): Result<Epic, Error> {
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