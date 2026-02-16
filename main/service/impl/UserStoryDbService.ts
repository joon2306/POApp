import getDatabase, { TABLE_USER_STORIES } from "../../database/database";
import DbUserStory from "../../model/DbUserStory";
import IUserStoryDbService from "../IUserStoryDbService";

export default class UserStoryDbService implements IUserStoryDbService {

    async getStories(): Promise<DbUserStory[]> {
        const db = getDatabase();
        const stmt = db.prepare(`SELECT * FROM ${TABLE_USER_STORIES}`);
        return stmt.all() as DbUserStory[];
    }

    async addStory(title: string, storyPoint: number, epicRef: number): Promise<number> {
        const db = getDatabase();
        const stmt = db.prepare(`INSERT INTO ${TABLE_USER_STORIES} (title, storyPoint, epicRef) VALUES (?, ?, ?)`);
        const result = stmt.run(title, storyPoint, epicRef);
        return result.lastInsertRowid as number;
    }

    async modifyStory(id: number, title: string, storyPoint: number, epicRef: number): Promise<void> {
        const db = getDatabase();
        const stmt = db.prepare(`UPDATE ${TABLE_USER_STORIES} SET title = ?, storyPoint = ?, epicRef = ? WHERE id = ?`);
        stmt.run(title, storyPoint, epicRef, id);
    }

    async removeStory(id: number): Promise<void> {
        const db = getDatabase();
        const stmt = db.prepare(`DELETE FROM ${TABLE_USER_STORIES} WHERE id = ?`);
        stmt.run(id);
    }
}