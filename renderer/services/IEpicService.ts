import { Epic } from "../components/Plan/types/types";

export default interface IEpicService {

    getEpics(): Promise<Epic[]>;

    addEpic(epic: Epic): Promise<Epic>;

    modifyEpic(epic: Epic): Promise<void>;

    removeEpic(epic: Epic): Promise<void>;
}