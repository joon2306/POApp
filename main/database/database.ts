import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";


const TABLE_KANBAN_ITEMS = "kanban_items";
export default function getDatabase() {
    let db: Database = null;

    const dbPath = path.join(app.getPath("userData"), "appdata.db");


    const initDatabase = () => {
        db = new Database(dbPath, { verbose: console.log });
        db.pragma("journal_mode = WAL");
        createTables();
    }

    const createTables = () => {
        const createTableStmt = db.prepare(`CREATE TABLE IF NOT EXISTS ${TABLE_KANBAN_ITEMS} (id INTEGER PRIMARY KEY, title TEXT, description TEXT, priority INTEGER, status INTEGER, time INTEGER)`)
        createTableStmt.run();
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



export { TABLE_KANBAN_ITEMS };