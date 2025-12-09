import { Epic } from "../../components/Plan/types/types";
import IEpicService from "../IEpicService";

let instance: EpicService = null;
export default class EpicService implements IEpicService {

    private epics: Epic[] = [];

    constructor() {
        if (instance === null) {
            instance = this;
        }
        return instance;
    }

    public getEpics(): Promise<Epic[]> {
        return Promise.resolve(this.epics);
    }

    public addEpic(epic: Epic): Promise<void> {
        epic.id = this.epics.length + 1;
        this.epics.push(epic);
        return Promise.resolve();
    }

    public modifyEpic(epic: Epic): Promise<void> {
        if(this.epics.length === 0) {
            return this.addEpic(epic);
        }
    
        this.epics = this.epics.map(e => {
            if(e.id === epic.id) {
                return epic;
            }
            return e;
        });
        return Promise.resolve();
    }

    public removeEpic(epic: Epic): Promise<void> {
        this.epics = this.epics.filter(e => e.name !== epic.name);
        return Promise.resolve();
    }


}