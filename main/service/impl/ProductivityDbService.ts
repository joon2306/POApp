import getDatabase, { TABLE_PRODUCTIVITY_ITEMS } from "../../database/database";
import GenericDbResponse from "../../model/DbItem";
import ProductivityDbItem from "../../model/ProductivityDbItem";
import IProductivityDbService from "../IProductivityDbService";

export default class ProductivityDbService implements IProductivityDbService {

    private static CREATE_ERROR_MSG = "Could not create productivity item in db";
    private static CREATE_SUCCESS_MSG = "productivity item created";
    private static DELETE_ERROR_MSG = "Could not delete productivity item with id: ";
    private static DELETE_SUCCESS_MSG = "Successfully deleted productivity item with id: ";
    private static MODIFY_ERROR_MSG = "Could not modify productivity item with id: ";
    private static MODIFY_SUCCESS_MSG = "Successfully modified productivity item with it: ";

    #db = null;

    constructor() {
        this.#db = getDatabase();
    }
    create(item: ProductivityDbItem): GenericDbResponse<string> {
        const { error } = this.findById(item.id);
        if (!error) {
            try {
                const stmt = this.#db.prepare(`INSERT INTO ${TABLE_PRODUCTIVITY_ITEMS} (id, title, priority, status, time, deleted, duration) VALUES (?, ?, ?, ?, ?, ?, ?)`);
                stmt.run(item.id, item.title, item.priority, item.status, item.time, item.deleted, item.duration);
                return { error: false, data: ProductivityDbService.CREATE_SUCCESS_MSG };

            } catch (err) {
                console.error("error creating db item: ", err);
            }

        }
        return { error: true, data: ProductivityDbService.CREATE_ERROR_MSG }

    }
    getAll(): GenericDbResponse<ProductivityDbItem[]> {
        try {
            const stmt = this.#db.prepare(`SELECT * FROM ${TABLE_PRODUCTIVITY_ITEMS}`);
            const items = stmt.all() as ProductivityDbItem[];
            return { error: false, data: items };
        } catch (err) {
            console.error("Failure to retrieve items from productivity: ", err);
        }

        return { error: true, data: [] };
    }
    delete(id: number): GenericDbResponse<string> {
        try {
            const stmt = this.#db.prepare(`DELETE * from ${TABLE_PRODUCTIVITY_ITEMS} where id = ?`);
            stmt.run(id);
            return { error: false, data: ProductivityDbService.DELETE_SUCCESS_MSG };

        } catch (err) {
            console.error("Failure to delete item in productivity: ", err);
        }
        return { error: true, data: ProductivityDbService.DELETE_ERROR_MSG + id };
    }
    modify(item: ProductivityDbItem): GenericDbResponse<string> {
        try {
            const stmt = this.#db.prepare(`UPDATE ${TABLE_PRODUCTIVITY_ITEMS} SET title = ?, priority = ?, status = ?, time = ?, deleted = ?, duration = ? where id = ?`);
            stmt.run(item.title, item.priority, item.status, item.time, item.deleted, item.duration, item.id);
            return { error: false, data: ProductivityDbService.MODIFY_SUCCESS_MSG };
        } catch (err) {
            console.error("Failure to modify item in productivity ", err);
        }
        return { error: true, data: ProductivityDbService.MODIFY_ERROR_MSG };
    }

    findById(id: number): GenericDbResponse<ProductivityDbItem> {
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