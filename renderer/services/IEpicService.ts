import { Epic } from "../components/Plan/types/types";

export default interface IEpicService {

    getEpics(): Promise<Epic[]>;

    modifyEpic(epic: Epic): Promise<number>;

    removeEpic(epic: Epic): Promise<void>;
}