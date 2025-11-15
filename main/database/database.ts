import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";


const TABLE_KANBAN_ITEMS = "kanban_items";
const TABLE_PRODUCTIVITY_ITEMS = "productivity_items";
const TABLE_VAULT_ITEMS = "vault_items";
const TABLE_PI_ITEMS = "pi_items";
const TABLE_JIRA_ITEMS = "jira_items";

let db: Database = null;
export default function getDatabase() {

    const dbPath = path.join(app.getPath("userData"), "appdata7.db");


    const initDatabase = () => {
        db = new Database(dbPath, { verbose: console.log });
        db.pragma("journal_mode = WAL");
        createTables();
    }

    const createTables = () => {
        const createKanbanTbl = db.prepare(`CREATE TABLE IF NOT EXISTS ${TABLE_KANBAN_ITEMS} (id INTEGER PRIMARY KEY, title TEXT, description TEXT, priority INTEGER, status INTEGER, time INTEGER, start INTEGER, duration INTEGER)`);
        createKanbanTbl.run();

        const createProductivityTbl = db.prepare(`CREATE TABLE IF NOT EXISTS ${TABLE_PRODUCTIVITY_ITEMS} (id INTEGER PRIMARY KEY, title text, priority INTEGER, status INTEGER, time INTEGER, deleted INTEGER, duration INTEGER, start INTEGER)`);
        createProductivityTbl.run();

        const createVaultTbl = db.prepare(`CREATE TABLE IF NOT EXISTS ${TABLE_VAULT_ITEMS} (title TEXT PRIMARY KEY, text1 TEXT NOT NULL, text2 TEXT, text3 TEXT)`);
        createVaultTbl.run();

        const createPiTbl = db.prepare(`CREATE TABLE IF NOT EXISTS ${TABLE_PI_ITEMS} (title TEXT PRIMARY KEY, s1 INTEGER NOT NULL, s2 INTEGER NOT NULL, s3 INTEGER NOT NULL, s4 INTEGER NOT NULL,
            s5 INTEGER NOT NULL, ip INTEGER NOT NULL)`);
        createPiTbl.run();

        const createJiraTbl = db.prepare(`CREATE TABLE IF NOT EXISTS ${TABLE_JIRA_ITEMS} (jiraKey TEXT PRIMARY KEY, title TEXT NOT NULL, target INTEGER NOT NULL, status INTEGER NOT NULL, type INTEGER NOT NULL, piRef TEXT NOT NULL)`);
        createJiraTbl.run();
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



export { TABLE_KANBAN_ITEMS, TABLE_PRODUCTIVITY_ITEMS, TABLE_VAULT_ITEMS, TABLE_PI_ITEMS, TABLE_JIRA_ITEMS };