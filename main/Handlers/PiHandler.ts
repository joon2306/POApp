import CommunicationEvents from "../../renderer/types/CommunicationEvent";
import { PiItem } from "../model/PiItem";
import CommsService from "../service/impl/CommsService";
import IPiDbService from "../service/IPiDbService";
import Handler from "./Handler";

let instance: PiHandler = null;
export default class PiHandler implements Handler {

    #commsService: CommsService;
    #dbService: IPiDbService;

    constructor(commsService: CommsService, dbService: IPiDbService) {
        if (instance === null) {
            this.#commsService = commsService;
            this.#dbService = dbService;
        }
        return instance;
    }

    #create() {
        this.#commsService.getRequest(CommunicationEvents.createPi, ([piItem]: PiItem[]) => this.#dbService.create(piItem));
    }

    #get() {
        this.#commsService.getRequest(CommunicationEvents.getPi, () => this.#dbService.getAll());
    }

    #delete() {
        this.#commsService.getRequest(CommunicationEvents.deletePi, ([title]: string[]) => this.#dbService.delete(title))
    }

    execute() {
        this.#create();
        this.#get();
        this.#delete();
    }

}