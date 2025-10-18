import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";


const TABLE_KANBAN_ITEMS = "kanban_items";
const TABLE_PRODUCTIVITY_ITEMS = "productivity_items"

let db: Database = null;
export default function getDatabase() {

    const dbPath = path.join(app.getPath("userData"), "appdata.db");


    const initDatabase = () => {
        db = new Database(dbPath, { verbose: console.log });
        db.pragma("journal_mode = WAL");
        createTables();
    }

    const createTables = () => {
        const createKanbanTbl = db.prepare(`CREATE TABLE IF NOT EXISTS ${TABLE_KANBAN_ITEMS} (id INTEGER PRIMARY KEY, title TEXT, description TEXT, priority INTEGER, status INTEGER, time INTEGER, start INTEGER, duration INTEGER)`);
        createKanbanTbl.run();

        const createProductivityTbl = db.prepare(`CREATE TABLE IF NOT EXISTS ${TABLE_PRODUCTIVITY_ITEMS} (id INTEGER PRIMARY KEY, title text, priority INTEGER, status INTEGER, time INTEGER, deleted INTEGER, duration INTEGER)`);
        createProductivityTbl.run();
    }

    if (!db) {
        initDatabase();

        app.on('window-all-closed', () => {
            console.log("App is quitting, closing the database");
            db.close();
        })
    }

    return db;

}



export { TABLE_KANBAN_ITEMS, TABLE_PRODUCTIVITY_ITEMS };