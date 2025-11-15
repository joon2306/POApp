import CommunicationEvents from "../../renderer/types/CommunicationEvent";
import { PiItem, PiResponse } from "../model/PiItem";
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

    #createPiItem({ title, sprintTimestamp }: PiResponse) {
        const { first, second, third, fourth, fifth, ip } = sprintTimestamp;
        return {
            title,
            s1: first,
            s2: second,
            s3: third,
            s4: fourth,
            s5: fifth,
            ip: ip
        }
    }

    #create() {
        this.#commsService.getRequest(CommunicationEvents.createPi, ([piResponse]: PiResponse[]) => this.#dbService.create(this.#createPiItem(piResponse)));
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