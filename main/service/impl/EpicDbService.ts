import getDatabase, { TABLE_EPICS } from "../../database/database";
import DbEpic from "../../model/DbEpic";
import IEpicDbService from "../IEpicDbService";

export default class EpicDbService implements IEpicDbService {
    
    async getEpics(): Promise<DbEpic[]> {
        const db = getDatabase();
        const stmt = db.prepare(`SELECT * FROM ${TABLE_EPICS}`);
        return stmt.all() as DbEpic[];
    }

    async addEpic(name: string, featureRef: number): Promise<number> {
        const db = getDatabase();
        const stmt = db.prepare(`INSERT INTO ${TABLE_EPICS} (name, featureRef) VALUES (?, ?)`);
        const result = stmt.run(name, featureRef);
        return result.lastInsertRowid as number;
    }

    async modifyEpic(id: number, name: string, featureRef: number): Promise<void> {
        const db = getDatabase();
        const stmt = db.prepare(`UPDATE ${TABLE_EPICS} SET name = ?, featureRef = ? WHERE id = ?`);
        stmt.run(name, featureRef, id);
    }

    async removeEpic(id: number): Promise<void> {
        const db = getDatabase();
        const stmt = db.prepare(`DELETE FROM ${TABLE_EPICS} WHERE id = ?`);
        stmt.run(id);
    }
}
