import { Epic } from "../components/Plan/types/types";
import { Result } from "../types/Result";

export default abstract class AbstractEpicHelper<T> {

    protected abstract areEpicsEqual(epicA: Epic, epicB: Epic): boolean;

    public abstract retrieveUpdated(epics: Epic[]): Result<T, Error>;
}