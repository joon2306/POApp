import { TABLE_TIME_TRACKER_ITEMS } from "../../database/database";
import ITimeTrackerDbService from "../ITimeTrackerService";
import Database from "better-sqlite3";

export default class TimeTrackerService implements ITimeTrackerDbService {

    private db: Database.Database;
    constructor(db: Database.Database) {
        this.db = db;
    }

    track(): void {
        try {
            const today = this._getNow();
            const insert = this.db.prepare(`INSERT INTO ${TABLE_TIME_TRACKER_ITEMS} (date) VALUES (?)`);
            insert.run(today);
            const cleanup = this.db.prepare(`DELETE FROM ${TABLE_TIME_TRACKER_ITEMS} WHERE date < ?`);
            cleanup.run(today);
        } catch (error) {
            console.error("Error adding date to time tracker: ", error);
        }
    }

    hasTracked(): boolean {
        try {
            const stmt = this.db.prepare(`SELECT * FROM ${TABLE_TIME_TRACKER_ITEMS} WHERE date = ?`);
            const row = stmt.get(this._getNow());
            return !!row;
        } catch (error) {
            console.error("Error checking if date exists in time tracker: ", error);
            return false;
        }
    }

    _getNow() {
        // Returns 'YYYY-MM-DD' in UTC
        return new Date().toISOString().slice(0, 10);
    }




}