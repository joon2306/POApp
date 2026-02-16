import getDatabase, { TABLE_PI_ITEMS, TABLE_PLANNED_PI_ITEMS } from "../database/database";
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
import IPlannedFeatureDbService from "../service/IPlannedFeatureDbService";
import PlannedFeatureDbService from "../service/impl/PlannedFeatureDbService";
import IEpicDbService from "../service/IEpicDbService";
import EpicDbService from "../service/impl/EpicDbService";
import IUserStoryDbService from "../service/IUserStoryDbService";
import UserStoryDbService from "../service/impl/UserStoryDbService";

type ServiceManagerProviderType = {
    productivityService: IProductivityService;
    kanbanDbService: IKanbanDbService;
    commsService: ICommunicationService;
    copyService: ICopyService;
    tokenGeneratorService: ITokenGeneratorService;
    vaultDbService: IVaultDbService;
    piDbService: IPiDbService;
    jiraDbService: IJiraDbService;
    plannedPiDbService: IPiDbService;
    plannedFeatureDbService: IPlannedFeatureDbService;
    epicDbService: IEpicDbService;
    userStoryDbService: IUserStoryDbService;
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
        const piDbService = new PiDbService(this.#db, TABLE_PI_ITEMS);
        const plannedPiDbService = new PiDbService(this.#db, TABLE_PLANNED_PI_ITEMS)
        const jiraDbService = new JiraDbService(this.#db);
        const plannedFeatureDbService  = new PlannedFeatureDbService(this.#db);
        const epicDbService = new EpicDbService();
        const userStoryDbService = new UserStoryDbService();

        return {
            productivityService,
            kanbanDbService,
            commsService,
            copyService,
            tokenGeneratorService, 
            vaultDbService,
            piDbService,
            jiraDbService,
            plannedPiDbService,
            plannedFeatureDbService,
            epicDbService,
            userStoryDbService
        }
    }



}