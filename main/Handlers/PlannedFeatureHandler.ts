import CommunicationEvents from "../../renderer/types/CommunicationEvent";
import { PiItem, PiResponse } from "../model/PiItem";
import { PlannedFeatureItem } from "../model/PlannedFeatureItem";
import CommsService from "../service/impl/CommsService";
import IPiDbService from "../service/IPiDbService";
import IPlannedFeatureDbService from "../service/IPlannedFeatureDbService";
import Handler from "./Handler";


let instance: PlannedFeatureHandler = null;
export default class PlannedFeatureHandler implements Handler {

    #commsService: CommsService;
    #dbService: IPlannedFeatureDbService;
    constructor(commsService: CommsService, dbService: IPlannedFeatureDbService) {
        if (instance === null) {
            this.#commsService = commsService;
            this.#dbService = dbService;
        }

        return instance;

    }

    #create() {
        this.#commsService.getRequest(CommunicationEvents.createPlannedFeature, ([plannedFeature]: PlannedFeatureItem[]) => this.#dbService.create(plannedFeature));
    }

    #get() {
        this.#commsService.getRequest(CommunicationEvents.getAllPlannedFeature, ([piRef]: string[]) => this.#dbService.getAllByPiRef(piRef));
    }

    #delete() {
        this.#commsService.getRequest(CommunicationEvents.deletePlannedFeature, ([title]: string[]) => this.#dbService.delete(title));
    }

    #modify() {
        this.#commsService.getRequest(CommunicationEvents.modifyPlannedFeature, ([plannedFeature]: PlannedFeatureItem[]) => this.#dbService.modify(plannedFeature));
    }

    execute() {
        this.#create();
        this.#get();
        this.#delete();
        this.#modify();
    }

}