import Database from "better-sqlite3";
import IJiraDbService from "../IJiraDbService";
import GenericResponse from "../../model/GenericResponse";
import { JiraItem, JiraKey, PiRef } from "../../model/JiraItem";
import { TABLE_JIRA_ITEMS } from "../../database/database";

let instance: JiraDbService = null;
export default class JiraDbService implements IJiraDbService {

    static SUCCESSFUL_MESSAGES = {
        create: "successfully created jira",
        delete: "Successfully deleted jira",
        modify: "Successfully modified jira"
    }

    #db: Database;
    #error: GenericResponse<null> = { data: null, error: true };
    #emptyList: GenericResponse<JiraItem[]> = {data: [], error: true};
    constructor(database: Database) {
        if (instance === null) {
            this.#db = database;
            instance = this;
        }
        return instance;
    }
    getByPiRef(piRef: PiRef): GenericResponse<JiraItem[]> {
        try {
            const stmt = this.#db.prepare(`SELECT * FROM ${TABLE_JIRA_ITEMS} where piRef = ?`);
            const rows = stmt.all(piRef);
            return { data: rows, error: false };

        } catch (err) {
            console.error("failure to get jira item by type: ", err);
            return this.#emptyList;
        }
    }

    getByTypeAndFeatureRef(type: number, featureRef: JiraKey): GenericResponse<JiraItem[]> {
        try {
            const stmt = this.#db.prepare(`SELECT * FROM ${TABLE_JIRA_ITEMS} where type = ? and featureRef = ?`);
            const rows = stmt.all(type, featureRef);
            return { data: rows, error: false };

        } catch (err) {
            console.error("failure to get jira item by type: ", err);
            return this.#emptyList;
        }
    }

    getByJirakey(jiraKey: string): GenericResponse<JiraItem> {
        try {
            const stmt = this.#db.prepare(`SELECT * FROM ${TABLE_JIRA_ITEMS} where jiraKey = ?`);
            const row = stmt.get(jiraKey);
            return { data: row, error: false };

        } catch (err) {
            console.error("failure to get jira item by jiraKey: ", err);
            return this.#error;
        }
    }

    create(arg: JiraItem): GenericResponse<string> {
        try {
            const stmt = this.#db.prepare(`INSERT INTO ${TABLE_JIRA_ITEMS} (jiraKey, title, target, status, type, piRef, featureRef) VALUES (? , ?, ?, ?, ?, ?, ?)`);
            stmt.run(arg.jiraKey, arg.title, arg.target, arg.status, arg.type, arg.piRef, arg.featureRef);
            console.log(JiraDbService.SUCCESSFUL_MESSAGES.create);
            return { data: JiraDbService.SUCCESSFUL_MESSAGES.create, error: false };

        } catch (err) {
            console.error("failure to create jira item: ", err);
        }
        return this.#error;
    }
    getAll(): GenericResponse<JiraItem[]> {
        try {
            const stmt = this.#db.prepare(`SELECT * FROM ${TABLE_JIRA_ITEMS}`);
            const rows = stmt.all();
            return { data: rows, error: false };

        } catch (err) {
            console.error("failure to get all jira items: ", err);
            return this.#emptyList;
        }
    }
    delete(arg: string): GenericResponse<string> {
        try {
            const stmt = this.#db.prepare(`DELETE FROM ${TABLE_JIRA_ITEMS} WHERE jiraKey = ?`);
            stmt.run(arg);
            console.log(JiraDbService.SUCCESSFUL_MESSAGES.delete);
            return { data: JiraDbService.SUCCESSFUL_MESSAGES.delete, error: false };
        } catch (err) {
            console.error("failure to delete jira item: ", err);
        }
        return this.#error;
    }
    modify(jiraItem : JiraItem): GenericResponse<string> {
        try {
            const {data: existingJira, error} = this.getByJirakey(jiraItem.jiraKey);
            console.log("existing jira: ", existingJira);
            if(!existingJira || error) {
                return this.create(jiraItem);
            }
            const stmt = this.#db.prepare(`UPDATE ${TABLE_JIRA_ITEMS} SET title = ?, target = ?, status = ? where jiraKey = ?`);
            stmt.run(jiraItem.title, jiraItem.target, jiraItem.status, jiraItem.jiraKey);
            console.log(JiraDbService.SUCCESSFUL_MESSAGES.modify);
            return { data: JiraDbService.SUCCESSFUL_MESSAGES.modify, error: false };

        } catch (err) {
            console.error("failure to modify jira item: ", err);
        }
        return this.#error;
    }


}