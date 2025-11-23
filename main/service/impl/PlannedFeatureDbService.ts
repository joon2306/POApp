import Database from "better-sqlite3";
import IPlannedFeatureDbService from "../IPlannedFeatureDbService";
import { GenericResponse } from "../../../renderer/types/Generic";
import { PlannedFeatureItem } from "../../model/PlannedFeatureItem";
import { TABLE_PLANNED_FEATURE_ITEMS } from "../../database/database";

let instance: PlannedFeatureDbService = null;
export default class PlannedFeatureDbService implements IPlannedFeatureDbService {

    static SUCCESSFUL_MESSAGES = {
        create: "Planned feature created successfully",
        delete: "Planned feature deleted successfully",
        modify: "Planned feature modified successfully",
        deleteAll: "Planned features for this PI deleted successfully",
        getAll: "Succesfully get all Planned features",
        getAllByPiRef: "Successfully get all Planned feature by this PI",
        get: "Successfully get Planned feature"
    }

    static FAILURE_MESSAGES = {
        create: "Planned feature could not be created.",
        delete: "Planned feature could not be deleted.",
        modify: "Planned feature could not be modified.",
        deleteAll: "Planned features could not be deleted for this PI",
        getAll: "Failure to get all Planned features",
        getAllByPiRef: "Failure to get all Planned feature by this PI",
        get: "Failure to get planned feature",
        titleMissing: "Title should not be empty"
    }

    #db: Database;
    #dbTable: string;
    constructor(database: Database) {
        if (instance === null) {
            this.#db = database;
            this.#dbTable = TABLE_PLANNED_FEATURE_ITEMS;
            instance = this;
        }
        return instance;
    }

    deleteByPiRef(piRef: string): GenericResponse<string> {
        try {
            const stmt = this.#db.prepare(`DELETE FROM ${this.#dbTable} WHERE piRef = ?`);
            stmt.run(piRef);
            console.log(PlannedFeatureDbService.SUCCESSFUL_MESSAGES.deleteAll);
            return { data: PlannedFeatureDbService.SUCCESSFUL_MESSAGES.deleteAll, error: false };
        } catch (error) {
            console.error(PlannedFeatureDbService.FAILURE_MESSAGES.deleteAll, error);
            return { data: null, error: true };
        }
    }

    create(arg: PlannedFeatureItem): GenericResponse<string> {
        try {
            const stmt = this.#db.prepare(`INSERT INTO ${this.#dbTable} (title, description, piRef, size, notes) VALUES (?, ?, ?, ?, ?)`);
            stmt.run(arg.title, arg.description, arg.piRef, arg.size, arg.notes);
            console.log(PlannedFeatureDbService.SUCCESSFUL_MESSAGES.create);
            return { data: PlannedFeatureDbService.SUCCESSFUL_MESSAGES.create, error: false };
        } catch (error) {
            console.error(PlannedFeatureDbService.FAILURE_MESSAGES.create, error);
            return { data: null, error: true };
        }
    }

    getAll(): GenericResponse<PlannedFeatureItem[]> {
        try {
            const stmt = this.#db.prepare(`SELECT * FROM ${this.#dbTable} `);
            const data = stmt.all() as PlannedFeatureItem[];
            console.log(PlannedFeatureDbService.SUCCESSFUL_MESSAGES.getAll);
            return { data, error: false };
        } catch (error) {
            console.error(PlannedFeatureDbService.FAILURE_MESSAGES.getAll, error);
            return { data: [], error: true };
        }
    }

    getAllByPiRef(piRef: string): GenericResponse<PlannedFeatureItem[]> {
        try {
            const stmt = this.#db.prepare(`SELECT * FROM ${this.#dbTable} WHERE piRef = ? `);
            const data = stmt.all(piRef) as PlannedFeatureItem[];
            console.log(PlannedFeatureDbService.SUCCESSFUL_MESSAGES.getAllByPiRef);
            return { data, error: false };
        } catch (error) {
            console.error(PlannedFeatureDbService.FAILURE_MESSAGES.getAllByPiRef, error);
            return { data: [], error: true };
        }
    }

    delete(arg: string): GenericResponse<string> {
        try {
            const stmt = this.#db.prepare(`DELETE FROM ${this.#dbTable} WHERE title = ?`);
            stmt.run(arg);
            console.log(PlannedFeatureDbService.SUCCESSFUL_MESSAGES.delete);
            return { data: PlannedFeatureDbService.SUCCESSFUL_MESSAGES.delete, error: false };
        } catch (error) {
            console.error(PlannedFeatureDbService.FAILURE_MESSAGES.delete, error);
            return { data: null, error: true };
        }
    }

    getByTitle(title: string): GenericResponse<PlannedFeatureItem> {
        try {
            const stmt = this.#db.prepare(`SELECT * FROM ${this.#dbTable} WHERE title = ?`);
            const data = stmt.get(title);
            console.log(PlannedFeatureDbService.SUCCESSFUL_MESSAGES.get);
            return { data, error: false };

        } catch (error) {
            console.error(PlannedFeatureDbService.FAILURE_MESSAGES.get, error);
            return { data: null, error: true };
        }
    }




    modify(arg: PlannedFeatureItem): GenericResponse<string> {
        try {
            if (!arg.title) {
                console.error(PlannedFeatureDbService.FAILURE_MESSAGES.titleMissing);
                return { data: null, error: true };
            }
            const { data: existingItem, error } = this.getByTitle(arg.title);

            if (error || !existingItem) {
                console.log("item does not exist, cannot modify. create it instead");
                return this.create(arg);
            }

            const stmt = this.#db.prepare(`UPDATE ${this.#dbTable} description = ?, size = ?, notes = ? WHERE title = ?`);
            stmt.run(arg.description ?? existingItem.description, arg.size ?? existingItem.size, arg.notes ?? existingItem.notes, arg.title);
            console.log(PlannedFeatureDbService.SUCCESSFUL_MESSAGES.modify);
            return { data: PlannedFeatureDbService.SUCCESSFUL_MESSAGES.modify, error: false };
        } catch (error) {
            console.error(PlannedFeatureDbService.FAILURE_MESSAGES.modify, error);
            return { data: null, error: true };
        }
    }

}