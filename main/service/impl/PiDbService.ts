import Database from "better-sqlite3";
import GenericResponse from "../../model/GenericResponse";
import { PiItem } from "../../model/PiItem";
import IPiDbService from "../IPiDbService";


export default class PiDbService implements IPiDbService {

    static SUCCESSFUL_MESSAGES = {
        create: "successfully created PI",
        delete: "Successfully deleted PI item",
        modify: "Successfully modified PI item"
    }

    #database: Database;
    #dbTable: string;
    constructor(database: Database, dbTable: string) {
        this.#database = database;
        this.#dbTable = dbTable;
    }

    create(arg: PiItem): GenericResponse<string> {
        try {
            if (!arg.title || !arg.title.toLowerCase().startsWith("sl")) {
                console.error("invalid PI title as doesnt start with SL");
                return { data: null, error: true };
            }
            const stmt = this.#database.prepare(`INSERT INTO ${this.#dbTable} (title, s1, s2, s3, s4, s5 , ip) VALUES (?, ?, ?, ?, ?, ?, ?)`);
            stmt.run(arg.title, arg.s1, arg.s2, arg.s3, arg.s4, arg.s5, arg.ip);
            console.log(PiDbService.SUCCESSFUL_MESSAGES.create);
            return { data: PiDbService.SUCCESSFUL_MESSAGES.create, error: false }
        } catch (error) {
            console.error("failure to create PI item: ", error);
        }
        return { data: null, error: true };
    }
    getAll(): GenericResponse<PiItem[]> {
        let data: PiItem[] = [];
        let error = false;
        try {
            const stmt = this.#database.prepare(`SELECT * FROM ${this.#dbTable}`);
            data = stmt.all() as PiItem[];
        } catch (error) {
            console.error("failure to get PI items: ", error);
            error = true;
        }

        return { data, error };

    }
    delete(title: string): GenericResponse<string> {
        try {
            const stmt = this.#database.prepare(`DELETE FROM ${this.#dbTable} where title = ?`);
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