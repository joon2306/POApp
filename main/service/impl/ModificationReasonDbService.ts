import Database from "better-sqlite3";
import GenericResponse from "../../model/GenericResponse";
import { ModificationReasonItem } from "../../model/ModificationReason";
import IModificationReasonDbService from "../IModificationReasonDbService";
import { TABLE_MODIFICATION_REASONS } from "../../database/database";

let instance: ModificationReasonDbService = null;
export default class ModificationReasonDbService implements IModificationReasonDbService {

    static SUCCESSFUL_MESSAGES = {
        create: "successfully created modification reason",
    }

    #db: Database;
    #error: GenericResponse<null> = { data: null, error: true };
    #emptyList: GenericResponse<ModificationReasonItem[]> = { data: [], error: true };

    constructor(database: Database) {
        if (instance === null) {
            this.#db = database;
            instance = this;
        }
        return instance;
    }

    create(item: ModificationReasonItem): GenericResponse<string> {
        try {
            const stmt = this.#db.prepare(
                `INSERT INTO ${TABLE_MODIFICATION_REASONS} (jiraKey, reason, category, type, previousValue, newValue, activeSprint, timestamp, piRef) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
            );
            stmt.run(item.jiraKey, item.reason, item.category ?? null, item.type, item.previousValue ?? null, item.newValue ?? null, item.activeSprint ?? null, item.timestamp, item.piRef);
            console.log(ModificationReasonDbService.SUCCESSFUL_MESSAGES.create);
            return { data: ModificationReasonDbService.SUCCESSFUL_MESSAGES.create, error: false };
        } catch (err) {
            console.error("failure to create modification reason: ", err);
        }
        return this.#error;
    }

    getByPiRef(piRef: string): GenericResponse<ModificationReasonItem[]> {
        try {
            const stmt = this.#db.prepare(`SELECT * FROM ${TABLE_MODIFICATION_REASONS} WHERE piRef = ?`);
            const rows = stmt.all(piRef) as ModificationReasonItem[];
            return { data: rows, error: false };
        } catch (err) {
            console.error("failure to get modification reasons by piRef: ", err);
            return this.#emptyList;
        }
    }
}
