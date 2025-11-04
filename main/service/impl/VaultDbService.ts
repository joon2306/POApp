import Database from "better-sqlite3";
import GenericResponse from "../../model/GenericResponse";
import { VaultDbItem } from "../../model/VaultDbItem";
import IVaultDbService from "../VaultDbService";
import { TABLE_VAULT_ITEMS } from "../../database/database";

let instance: VaultDbService = null;
export default class VaultDbService implements IVaultDbService {
    private static CREATE_ERROR_MSG = "Could not create vault item in db";
    private static CREATE_SUCCESS_MSG = "vault item created";
    private static DELETE_ERROR_MSG = "Could not delete vault item with id: ";
    private static DELETE_SUCCESS_MSG = "Successfully deleted vault item with id: ";
    private static MODIFY_ERROR_MSG = "Could not modify vault item with id: ";
    private static MODIFY_SUCCESS_MSG = "Successfully modified vault item with it: ";

    #db: Database = null;

    constructor(database: Database) {
        if (instance === null) {
            this.#db = database;
            instance = this;
        }
        return instance;
    }
    create(arg: VaultDbItem): GenericResponse<string> {
        try {
            const stmt = this.#db.prepare(`INSERT INTO ${TABLE_VAULT_ITEMS} (title, text1, text2, text3) VALUES (?, ?, ?, ?)`);
            stmt.run(arg.title, arg.text1, arg.text2, arg.text3);
            return { error: false, data: VaultDbService.CREATE_SUCCESS_MSG };

        } catch (err) {
            console.error("error creating db item: ", err);
        }
        return { error: true, data: VaultDbService.CREATE_ERROR_MSG }
    }
    getAll(): GenericResponse<VaultDbItem[]> {
        try {
            const stmt = this.#db.prepare(`SELECT * FROM ${TABLE_VAULT_ITEMS}`);
            const items = stmt.all() as VaultDbItem[];
            return { error: false, data: items };
        } catch (err) {
            console.error("Failure to retrieve items from vault: ", err);
        }

        return { error: true, data: [] };
    }
    delete(arg: string): GenericResponse<string> {
        try {
            const stmt = this.#db.prepare(`DELETE from ${TABLE_VAULT_ITEMS} where title = ?`);
            stmt.run(arg);
            return { error: false, data: VaultDbService.DELETE_SUCCESS_MSG };

        } catch (err) {
            console.error("Failure to delete item in vault: ", err);
        }
        return { error: true, data: VaultDbService.DELETE_ERROR_MSG + arg };
    }
    modify(arg: VaultDbItem): GenericResponse<string> {
        try {
            const stmt = this.#db.prepare(`UPDATE ${TABLE_VAULT_ITEMS} SET text1 = ?, text2 = ?, text3 = ? where title = ?`);
            stmt.run(arg.text1, arg.text2, arg.text3, arg.title);
            return { error: false, data: VaultDbService.MODIFY_SUCCESS_MSG };
        } catch (err) {
            console.error("Failure to modify item in vault ", err);
        }
        return { error: true, data: VaultDbService.MODIFY_ERROR_MSG };
    }


}