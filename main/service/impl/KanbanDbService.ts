import { start } from "repl";
import getDatabase, { TABLE_KANBAN_ITEMS } from "../../database/database";
import KanbanResponse, { KanbanDbItem } from "../../model/KanbanItem";
import IKanbanDbService from "../IKanbanDbService";
import Database from "better-sqlite3";
import KanbanTimeManager, { IKanbanTimeManager } from "../../manager/KanbanTimeManager";

let instance: KanbanDbService = null;
export default class KanbanDbService implements IKanbanDbService {

    private db: Database = null;
    #kanbanTimeManager: IKanbanTimeManager = null;
    constructor() {
        if (!instance) {
            this.db = getDatabase();
            this.#kanbanTimeManager = new KanbanTimeManager(this);
            instance = this;
        }
        return instance;
    }

    getAllKanbanCards(): KanbanResponse<KanbanDbItem[]> {
        try {
            const stmt = this.db.prepare(`SELECT * FROM ${TABLE_KANBAN_ITEMS}`);
            const rows = stmt.all() as KanbanDbItem[];
            return { error: false, data: rows }
        } catch (err) {
            console.error("Error fetching kanban cards: ", err);
            return { error: true, data: [] };
        }

    }
    saveKanbanCard(kanbanItem: KanbanDbItem): KanbanResponse<string> {
        try {
            const { error } = this.getKanbanCardById(kanbanItem.id);
            if (!error) {
                console.log("Kanban card with id already exists. Cannot save duplicate");
                return { error: true, data: "Kanban card with id already exists. Cannot save duplicate" };
            }
            const stmt = this.db.prepare(`INSERT INTO ${TABLE_KANBAN_ITEMS} (id, title, description, priority, status, time) VALUES (?, ?, ?, ?, ?, ?)`);
            stmt.run(+kanbanItem.id, kanbanItem.title, kanbanItem.description, kanbanItem.priority, kanbanItem.status, kanbanItem.time);
            return { error: false, data: "Kanban card saved successfully" };
        } catch (err) {
            console.error("Error saving kanban card: ", err);
            return { error: true, data: "Error saving kanban card" };
        }
    }
    deleteKanbanCard(id: number): KanbanResponse<string> {
        try {
            const kanbanCard = this.getKanbanCardById(id);
            if (kanbanCard.error) {
                return { error: true, data: "Kanban card not found. Cannot delete" };
            }
            const stmt = this.db.prepare(`DELETE FROM ${TABLE_KANBAN_ITEMS} WHERE id = ?`);
            stmt.run(kanbanCard.data.id);
            return { error: false, data: "Kanban card deleted successfully" };
        } catch (err) {
            console.error("Error deleting kanban card: ", err);
            return { error: true, data: "Error deleting kanban card" };
        }
    }
    modifyKanbanCard(kanbanItem: KanbanDbItem): KanbanResponse<string> {
        try {
            const kanbanCard = this.getKanbanCardById(kanbanItem.id);
            if (kanbanCard.error) {
                return { error: true, data: "Kanban card not found. Cannot modify" };
            }
            const stmt = this.db.prepare(`UPDATE ${TABLE_KANBAN_ITEMS} SET title = ?, description = ?, priority = ?, status = ?, time = ?, start = ?, duration = ? WHERE id = ?`);
            stmt.run(kanbanItem.title, kanbanItem.description, kanbanItem.priority, kanbanItem.status ?? kanbanCard.data.status, kanbanItem.time,
                kanbanItem.start ?? kanbanCard.data.start, kanbanItem.duration ?? kanbanCard.data.duration, kanbanCard.data.id);
            this.#kanbanTimeManager.handleChangeOfState(kanbanCard.data, kanbanItem);
            return { error: false, data: "Kanban card modified successfully" };
        } catch (err) {
            console.error("Error modifying kanban card: ", err);
            return { error: true, data: "Error modifying kanban card" };
        }
    }

    getKanbanCardByTitleAndDescription(title: string, description: string): KanbanResponse<KanbanDbItem> {
        try {
            const stmt = this.db.prepare(`SELECT * FROM ${TABLE_KANBAN_ITEMS} WHERE title = ? AND description = ?`);
            const row = stmt.get(title, description) as KanbanDbItem;
            if (row) {
                return { error: false, data: row };
            }
            console.log("No kanban card found with the given title and description");
            return { error: true, data: null };

        } catch (err) {
            console.error("Error fetching kanban card by title and description: ", err);
            return { error: true, data: null };
        }

    }

    getKanbanCardById(id: number): KanbanResponse<KanbanDbItem> {
        try {
            const stmt = this.db.prepare(`SELECT * FROM ${TABLE_KANBAN_ITEMS} WHERE id = ?`);
            const row = stmt.get(id) as KanbanDbItem;
            if (row) {
                return { error: false, data: row };
            }
            console.log("No kanban card found with the given id");
            return { error: true, data: null };

        } catch (err) {
            console.error("Error fetching kanban: ", err);
            return { error: true, data: null };
        }

    }
}