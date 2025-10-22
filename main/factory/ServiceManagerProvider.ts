import getDatabase from "../database/database";
import KanbanTimeManager, { IKanbanTimeManager } from "../manager/KanbanTimeManager";
import ICommunicationService from "../service/ICommunicationService";
import IKanbanDbService from "../service/IKanbanDbService";
import CommsService from "../service/impl/CommsService";
import KanbanDbService from "../service/impl/KanbanDbService";
import ProductivityDbService from "../service/impl/ProductivityDbService";
import ProductivityService from "../service/impl/ProductivityService";
import IProductivityDbService from "../service/IProductivityDbService";
import IProductivityService from "../service/IProductivityService";
import { Database } from "better-sqlite3";
import IProvider from "./Provider";

type ServiceManagerProviderType = {
    productivityService: IProductivityService;
    kanbanDbService: IKanbanDbService;
    commsService: ICommunicationService;
}



let instance = null;
export class ServiceManagerProvider implements IProvider<ServiceManagerProviderType> {
    #db: Database

    constructor() {
        if (instance === null) {
            this.#db = getDatabase();
            instance = this;
        }
        return this;
    }
    provide(): ServiceManagerProviderType {
        const productivityDbService = new ProductivityDbService(this.#db);
        const productivityService = new ProductivityService(productivityDbService);
        const kanbanTimeManager = new KanbanTimeManager();
        const kanbanDbService = new KanbanDbService(this.#db, kanbanTimeManager);
        const commsService = new CommsService();

        return {
            productivityService,
            kanbanDbService,
            commsService
        }
    }



}