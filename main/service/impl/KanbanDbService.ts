import { TABLE_KANBAN_ITEMS } from "../../database/database";
import { KanbanDbItem } from "../../model/KanbanItem";
import IKanbanDbService from "../IKanbanDbService";
import Database from "better-sqlite3";
import KanbanTimeManager, { IKanbanTimeManager } from "../../manager/KanbanTimeManager";
import GenericResponse from "../../model/GenericResponse";

let instance: KanbanDbService = null;
export default class KanbanDbService implements IKanbanDbService {

    #db: Database = null;
    #kanbanTimeManager: IKanbanTimeManager = null;
    constructor(database: Database, kanbanTimeManager: IKanbanTimeManager) {
        if (instance == null) {
            this.#db = database;
            this.#kanbanTimeManager = kanbanTimeManager;
            instance = this;
        }
        return instance;
    }
    getAll(): GenericResponse<KanbanDbItem[]> {
        const stmt = this.#db.prepare(`SELECT * FROM ${TABLE_KANBAN_ITEMS}`);
        try {
            const rows = stmt.all() as KanbanDbItem[];
            return { error: false, data: rows }
        } catch (err) {
            console.error("Error fetching kanban cards by type: ", err);
            return { error: true, data: [] };
        }
    }
    resetToDoCards(): void {
        const { error, data: kanbanCards } = this.getAll();
        if (!error) {
            const expiredCards = this.#kanbanTimeManager.getExpiredToDoKanbans(kanbanCards);
            for (const expiredCard of expiredCards) {
                this.modify(expiredCard);
            }
        }
    }

    getUpdatedCards(): KanbanDbItem[] {
        const { error, data: kanbanCards } = this.getAll();
        if (error) {
            console.error("Error fetching kanban cards: ", error);
            return [];
        }
        const updatedInProgressCards = this.#kanbanTimeManager.updateInProgress(kanbanCards);
        return kanbanCards.map(card => {
            if (card.status === 2) {
                return updatedInProgressCards.find(updatedCard => updatedCard.id === card.id);
            }
            return card;
        });
    }


    create(kanbanItem: KanbanDbItem): GenericResponse<string> {
        try {
            const stmt = this.#db.prepare(`INSERT INTO ${TABLE_KANBAN_ITEMS} (title, description, priority, status, time) VALUES (?, ?, ?, ?, ?)`);
            stmt.run(kanbanItem.title, kanbanItem.description, kanbanItem.priority, kanbanItem.status, kanbanItem.time);
            return { error: false, data: "Kanban card saved successfully" };
        } catch (err) {
            console.error("Error saving kanban card: ", err);
            return { error: true, data: "Error saving kanban card" };
        }
    }
    delete(id: number): GenericResponse<KanbanDbItem> {
        try {
            const kanbanCard = this.getKanbanCardById(id);
            if (kanbanCard.error) {
                return { error: true, data: null };
            }
            const stmt = this.#db.prepare(`DELETE FROM ${TABLE_KANBAN_ITEMS} WHERE id = ?`);
            stmt.run(kanbanCard.data.id);
            const kanban = this.#kanbanTimeManager.handleDelete(kanbanCard.data);
            return { error: false, data: kanban };
        } catch (err) {
            console.error("Error deleting kanban card: ", err);
            return { error: true, data: null };
        }
    }
    modify(kanbanItem: KanbanDbItem): GenericResponse<string> {
        try {
            const kanbanCard = this.getKanbanCardById(kanbanItem.id);
            if (kanbanCard.error) {
                return { error: true, data: "Kanban card not found. Cannot modify" };
            }
            kanbanItem = this.#kanbanTimeManager.handleChangeOfState(kanbanCard.data, kanbanItem);
            const stmt = this.#db.prepare(`UPDATE ${TABLE_KANBAN_ITEMS} SET title = ?, description = ?, priority = ?, status = ?, time = ?, start = ?, duration = ? WHERE id = ?`);
            stmt.run(kanbanItem.title, kanbanItem.description, kanbanItem.priority, kanbanItem.status ?? kanbanCard.data.status, kanbanItem.time,
                kanbanItem.start ?? kanbanCard.data.start, kanbanItem.duration ?? kanbanCard.data.duration, kanbanCard.data.id);

            return { error: false, data: "Kanban card modified successfully" };
        } catch (err) {
            console.error("Error modifying kanban card: ", err);
            return { error: true, data: "Error modifying kanban card" };
        }
    }

    getKanbanCardByTitleAndDescription(title: string, description: string): GenericResponse<KanbanDbItem> {
        try {
            const stmt = this.#db.prepare(`SELECT * FROM ${TABLE_KANBAN_ITEMS} WHERE title = ? AND description = ?`);
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

    getKanbanCardById(id: number): GenericResponse<KanbanDbItem> {
        try {
            const stmt = this.#db.prepare(`SELECT * FROM ${TABLE_KANBAN_ITEMS} WHERE id = ?`);
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