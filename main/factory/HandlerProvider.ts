import Handler from "../Handlers/Handler";
import KanbanHandler from "../Handlers/KanbanHandler"
import ProductivityHandler from "../Handlers/ProductivityHandler";
import IProvider from "./Provider";
import { ServiceManagerProvider } from "./ServiceManagerProvider";

type HandlerProviderType = {
    kanbanHandler: KanbanHandler;
    productivityHandler: ProductivityHandler;
}

let instance: HandlerProvider = null;
export default class HandlerProvider implements IProvider<HandlerProviderType> {

    #serviceManagerProvider: ServiceManagerProvider = null;
    constructor() {
        if (instance === null) {
            this.#serviceManagerProvider = new ServiceManagerProvider();
            instance = this;
        }
        return instance;
    }

    provide(): HandlerProviderType {
        const { kanbanDbService, commsService, productivityService } = this.#serviceManagerProvider.provide();
        const kanbanHandler = new KanbanHandler(kanbanDbService, commsService, productivityService);
        const productivityHandler = new ProductivityHandler(productivityService, commsService, kanbanDbService);
        return { kanbanHandler, productivityHandler };
    }

}