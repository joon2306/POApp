import CopyHandler from "../Handlers/CopyHandler";
import Handler from "../Handlers/Handler";
import JiraHandler from "../Handlers/JiraHandler";
import ModificationReasonHandler from "../Handlers/ModificationReasonHandler";
import PiHandler from "../Handlers/PiHandler";
import ProductivityHandler from "../Handlers/ProductivityHandler";
import TodoKanbanHandler from "../Handlers/TodoKanbanHandler";
import TokenHandler from "../Handlers/TokenHandler";
import VaultHandler from "../Handlers/VaultHandler";
import IProvider from "./Provider";
import { ServiceManagerProvider } from "./ServiceManagerProvider";
import { BrowserWindow } from "electron";
import CalendarHandler from "../Handlers/CalendarHandler";
import BackgroundTask from "../manager/BackgroundTask";

export interface IHandlerProviderResponse {

    execute(key: string): void;

    executeAll(): void;

    startBackgroundTasks(): void;

    stopBackgroundTasks(): void;

}

export class HandlerProviderResponse implements IHandlerProviderResponse {

    #handlersMap = new Map<string, Handler>;

    constructor(handlers: Handler[], private readonly backgroundTasks: BackgroundTask[]) {
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

    startBackgroundTasks() {
        this.backgroundTasks.forEach(task => task.start());
    }

    stopBackgroundTasks() {
        [...this.backgroundTasks].reverse().forEach(task => task.stop());
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

    provide(getWindow: () => BrowserWindow | null = () => null): IHandlerProviderResponse {
        const { kanbanDbService, commsService, productivityService, copyService, tokenGeneratorService,
            vaultDbService, piDbService, jiraDbService, timeTrackerService, modificationReasonDbService,
            calendarMeetingDbService, calendarStatusManager, backgroundTasks } = this.#serviceManagerProvider.provide(getWindow);
        const kanbanHandler = new TodoKanbanHandler(
            kanbanDbService,
            commsService,
            productivityService,
            calendarMeetingDbService,
            calendarStatusManager,
        );
        const productivityHandler = new ProductivityHandler(productivityService, commsService, kanbanDbService, timeTrackerService);
        const copyHandler = new CopyHandler(copyService, commsService);
        const tokenHandler = new TokenHandler(tokenGeneratorService, commsService);
        const vaultHandler = new VaultHandler(commsService, vaultDbService);
        const piHandler = new PiHandler(commsService, piDbService, jiraDbService, modificationReasonDbService);
        const jiraHandler = new JiraHandler(commsService, jiraDbService);
        const modificationReasonHandler = new ModificationReasonHandler(commsService, modificationReasonDbService);
        const calendarHandler = new CalendarHandler(commsService, calendarStatusManager);
        return new HandlerProviderResponse([kanbanHandler, productivityHandler, copyHandler, tokenHandler,
            vaultHandler, piHandler, jiraHandler, modificationReasonHandler, calendarHandler], backgroundTasks);
    }

}
