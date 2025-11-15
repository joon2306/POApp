import Database from "better-sqlite3";
import GenericResponse from "../../model/GenericResponse";
import { PiItem } from "../../model/PiItem";
import IPiDbService from "../IPiDbService";
import { TABLE_PI_ITEMS } from "../../database/database";

let instance: PiDbService = null;
export default class PiDbService implements IPiDbService {

    static SUCCESSFUL_MESSAGES = {
        create: "successfully created PI",
        delete: "Successfully deleted PI item",
        modify: "Successfully modified PI item"
    }

    #database: Database;
    constructor(database: Database) {
        if (instance === null) {
            this.#database = database;
            instance = this;
        }
        return instance;
    }

    create(arg: PiItem): GenericResponse<string> {
        try {
            const stmt = this.#database.prepare(`INSERT INTO ${TABLE_PI_ITEMS} (title, s1, s2, s3, s4, s5 , ip) VALUES (?, ?, ?, ?, ?, ?, ?)`);
            stmt.run(arg.title, arg.s1, arg.s2, arg.s3, arg.s4, arg.s5, arg.ip);
            console.log(PiDbService.SUCCESSFUL_MESSAGES.create);
            return { data: PiDbService.SUCCESSFUL_MESSAGES.create, error: false }
        } catch (error) {
            console.error("failure to create PI item: ", error);
        }
        return { data: null, error: true };
    }
    getAll(): GenericResponse<PiItem[]> {
        console.log("doing select");
        let data: PiItem[] = [];
        let error = false;
        try {
            const stmt = this.#database.prepare(`SELECT * FROM ${TABLE_PI_ITEMS}`);
            data = stmt.all() as PiItem[];
        } catch (error) {
            console.error("failure to get PI items: ", error);
            error = true;
        }

        return { data, error };

    }
    delete(title: string): GenericResponse<string> {
        try {
            const stmt = this.#database.prepare(`DELETE FROM ${TABLE_PI_ITEMS} where title = ?`);
            stmt.run(title);
            console.log(PiDbService.SUCCESSFUL_MESSAGES.delete);
            return { error: false, data: PiDbService.SUCCESSFUL_MESSAGES.delete };
        } catch (err) {
            console.error("Failure to delete PI item: ", err);
            return { error: true, data: null };
        }
    }
    modify(arg: PiItem): GenericResponse<string> {
        throw Error("Method modified not implemented as will not be required to be updated");
    }

}