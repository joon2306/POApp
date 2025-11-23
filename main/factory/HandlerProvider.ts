import CopyHandler from "../Handlers/CopyHandler";
import Handler from "../Handlers/Handler";
import JiraHandler from "../Handlers/JiraHandler";
import PiHandler from "../Handlers/PiHandler";
import PlannedFeatureHandler from "../Handlers/PlannedFeatureHandler";
import PlannedPiHandler from "../Handlers/PlannedPiHandler";
import ProductivityHandler from "../Handlers/ProductivityHandler";
import TodoKanbanHandler from "../Handlers/TodoKanbanHandler";
import TokenHandler from "../Handlers/TokenHandler";
import VaultHandler from "../Handlers/VaultHandler";
import IProvider from "./Provider";
import { ServiceManagerProvider } from "./ServiceManagerProvider";

export interface IHandlerProviderResponse {

    execute(key: string): void;

    executeAll(): void;

}

class HandlerProviderResponse implements IHandlerProviderResponse {

    #handlersMap = new Map<string, Handler>;

    constructor(handlers: Handler[]) {
        this.#addHandlers(handlers);
    }

    #addHandlers(handlers: Handler[]) {
        handlers.forEach(handler => {
            this.#handlersMap.set(handler.constructor.name, handler);
        })
    }

    execute(key: string) {
        const handler = this.#handlersMap.get(key);
        if (!handler) {
            throw new Error("This handler does not exist");
        }

        handler.execute();
    }

    executeAll() {
        if (this.#handlersMap.size === 0) {
            throw new Error("There are no handlers to execute");
        }

        this.#handlersMap.forEach((handler) => handler.execute());
    }





}

let instance: HandlerProvider = null;
export default class HandlerProvider implements IProvider<IHandlerProviderResponse> {

    #serviceManagerProvider: ServiceManagerProvider = null;
    constructor() {
        if (instance === null) {
            this.#serviceManagerProvider = new ServiceManagerProvider();
            instance = this;
        }
        return instance;
    }

    provide(): IHandlerProviderResponse {
        const { kanbanDbService, commsService, productivityService, copyService, tokenGeneratorService,
            vaultDbService, piDbService, jiraDbService, plannedPiDbService, plannedFeatureDbService } = this.#serviceManagerProvider.provide();
        const kanbanHandler = new TodoKanbanHandler(kanbanDbService, commsService, productivityService);
        const productivityHandler = new ProductivityHandler(productivityService, commsService, kanbanDbService);
        const copyHandler = new CopyHandler(copyService, commsService);
        const tokenHandler = new TokenHandler(tokenGeneratorService, commsService);
        const vaultHandler = new VaultHandler(commsService, vaultDbService);
        const piHandler = new PiHandler(commsService, piDbService, jiraDbService);
        const plannedPiHandler = new PlannedPiHandler(commsService, plannedPiDbService);
        const jiraHandler = new JiraHandler(commsService, jiraDbService);
        const plannedFeatureHandler = new PlannedFeatureHandler(commsService, plannedFeatureDbService);
        return new HandlerProviderResponse([kanbanHandler, productivityHandler, copyHandler, tokenHandler,
            vaultHandler, piHandler, jiraHandler, plannedPiHandler, plannedFeatureHandler]);
    }

}