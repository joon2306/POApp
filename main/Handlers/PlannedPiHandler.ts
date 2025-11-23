import CommunicationEvents from "../../renderer/types/CommunicationEvent";
import { PiItem, PiResponse } from "../model/PiItem";
import CommsService from "../service/impl/CommsService";
import IPiDbService from "../service/IPiDbService";
import IPlannedFeatureDbService from "../service/IPlannedFeatureDbService";
import Handler from "./Handler";


let instance: PlannedPiHandler = null;
export default class PlannedPiHandler implements Handler {

    #commsService: CommsService;
    #dbService: IPiDbService;
    #plannedFeatureDbService: IPlannedFeatureDbService
    constructor(commsService: CommsService, dbService: IPiDbService, plannedFeatureDbService: IPlannedFeatureDbService) {
        if (instance === null) {
            this.#commsService = commsService;
            this.#dbService = dbService;
            this.#plannedFeatureDbService = plannedFeatureDbService;
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
        this.#commsService.getRequest(CommunicationEvents.createPlannedPi, ([piResponse]: PiResponse[]) => this.#dbService.create(this.#createPiItem(piResponse)));
    }

    #get() {
        this.#commsService.getRequest(CommunicationEvents.getPlannedPi, () => this.#dbService.getAll());
    }

    #delete() {
        this.#commsService.getRequest(CommunicationEvents.deletePlannedPi, ([title]: string[]) => {
            this.#dbService.delete(title);
            this.#plannedFeatureDbService.deleteByPiRef(title);
        });
    }

    execute() {
        this.#create();
        this.#get();
        this.#delete();
    }

}