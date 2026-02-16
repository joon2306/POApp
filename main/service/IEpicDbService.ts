import DbEpic from "../model/DbEpic";

export default interface IEpicDbService {
    getEpics(): Promise<DbEpic[]>;
    addEpic(name: string, featureRef: number): Promise<number>;
    modifyEpic(id: number, name: string, featureRef: number): Promise<void>;
    removeEpic(id: number): Promise<void>;
}