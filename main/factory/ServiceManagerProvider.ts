import getDatabase from "../database/database";
import KanbanTimeManager from "../manager/KanbanTimeManager";
import ICommunicationService from "../service/ICommunicationService";
import IKanbanDbService from "../service/IKanbanDbService";
import CommsService from "../service/impl/CommsService";
import KanbanDbService from "../service/impl/KanbanDbService";
import ProductivityDbService from "../service/impl/ProductivityDbService";
import ProductivityService from "../service/impl/ProductivityService";
import IProductivityService from "../service/IProductivityService";
import { Database } from "better-sqlite3";
import IProvider from "./Provider";
import ICopyService from "../service/ICopyService";
import CopyService from "../service/CopyService";
import ExeService from "../service/impl/ExeService";
import TokenGeneratorService from "../service/impl/TokenGeneratorServie";
import ITokenGeneratorService from "../service/ITokenGeneratorService";
import IVaultDbService from "../service/VaultDbService";
import VaultDbService from "../service/impl/VaultDbService";
import PiDbService from "../service/impl/PiDbService";
import IPiDbService from "../service/IPiDbService";
import IJiraDbService from "../service/IJiraDbService";
import JiraDbService from "../service/impl/JiraDbService";

type ServiceManagerProviderType = {
    productivityService: IProductivityService;
    kanbanDbService: IKanbanDbService;
    commsService: ICommunicationService;
    copyService: ICopyService;
    tokenGeneratorService: ITokenGeneratorService;
    vaultDbService: IVaultDbService;
    piDbService: IPiDbService;
    jiraDbService: IJiraDbService;

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
        const exeService = new ExeService();       
        const copyService = new CopyService(exeService);
        const tokenGeneratorService = new TokenGeneratorService(exeService, copyService);
        const vaultDbService = new VaultDbService(this.#db);
        const piDbService = new PiDbService(this.#db);
        const jiraDbService = new JiraDbService(this.#db);

        return {
            productivityService,
            kanbanDbService,
            commsService,
            copyService,
            tokenGeneratorService, 
            vaultDbService,
            piDbService,
            jiraDbService
        }
    }



}