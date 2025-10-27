import Database from "better-sqlite3";
import { TABLE_PRODUCTIVITY_ITEMS } from "../../database/database";
import GenericResponse from "../../model/GenericResponse";
import ProductivityDbItem from "../../model/ProductivityDbItem";
import getTimeUtils from "../../utils/TimeUtils";
import IProductivityDbService from "../IProductivityDbService";

let instance: ProductivityDbService = null;

export default class ProductivityDbService implements IProductivityDbService {

    private static CREATE_ERROR_MSG = "Could not create productivity item in db";
    private static CREATE_SUCCESS_MSG = "productivity item created";
    private static DELETE_ERROR_MSG = "Could not delete productivity item with id: ";
    private static DELETE_SUCCESS_MSG = "Successfully deleted productivity item with id: ";
    private static MODIFY_ERROR_MSG = "Could not modify productivity item with id: ";
    private static MODIFY_SUCCESS_MSG = "Successfully modified productivity item with it: ";

    #db: Database = null;

    constructor(database: Database) {
        if (instance === null) {
            this.#db = database;
            instance = this;
        }
        return instance;
    }
    create(item: ProductivityDbItem): GenericResponse<string> {
        try {
            const stmt = this.#db.prepare(`INSERT INTO ${TABLE_PRODUCTIVITY_ITEMS} (title, priority, status, time, deleted, duration, start) VALUES (?, ?, ?, ?, ?, ?, ?)`);
            stmt.run(item.title, item.priority, item.status, item.time, item.deleted, item.duration, item.start);
            return { error: false, data: ProductivityDbService.CREATE_SUCCESS_MSG };

        } catch (err) {
            console.error("error creating db item: ", err);
        }
        return { error: true, data: ProductivityDbService.CREATE_ERROR_MSG }

    }
    getAll(): GenericResponse<ProductivityDbItem[]> {
        try {
            const stmt = this.#db.prepare(`SELECT * FROM ${TABLE_PRODUCTIVITY_ITEMS}`);
            const items = stmt.all() as ProductivityDbItem[];
            return { error: false, data: items };
        } catch (err) {
            console.error("Failure to retrieve items from productivity: ", err);
        }

        return { error: true, data: [] };
    }
    delete(id: number): GenericResponse<string> {
        try {
            const stmt = this.#db.prepare(`DELETE * from ${TABLE_PRODUCTIVITY_ITEMS} where id = ?`);
            stmt.run(id);
            return { error: false, data: ProductivityDbService.DELETE_SUCCESS_MSG };

        } catch (err) {
            console.error("Failure to delete item in productivity: ", err);
        }
        return { error: true, data: ProductivityDbService.DELETE_ERROR_MSG + id };
    }
    modify(item: ProductivityDbItem): GenericResponse<string> {
        try {
            const stmt = this.#db.prepare(`UPDATE ${TABLE_PRODUCTIVITY_ITEMS} SET title = ?, priority = ?, status = ?, time = ?, deleted = ?, duration = ?, start =? where id = ?`);
            stmt.run(item.title, item.priority, item.status, item.time, item.deleted, item.duration, item.start, item.id);
            return { error: false, data: ProductivityDbService.MODIFY_SUCCESS_MSG };
        } catch (err) {
            console.error("Failure to modify item in productivity ", err);
        }
        return { error: true, data: ProductivityDbService.MODIFY_ERROR_MSG };
    }

    findById(id: number): GenericResponse<ProductivityDbItem> {
        try {
            const stmt = this.#db.prepare(`SELECT * FROM ${TABLE_PRODUCTIVITY_ITEMS} WHERE id = ?`);
            const result = stmt.get(id) as ProductivityDbItem;
            if (result) {
                return { error: false, data: result };
            }
        } catch (err) {
            console.error("could not find this item in productivity table", err);
        }
        return { error: true, data: null };
    }


}