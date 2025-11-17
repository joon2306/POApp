import CommunicationEvents from "../../renderer/types/CommunicationEvent";
import { JiraItem, JiraKey, PiRef } from "../model/JiraItem";
import IJiraDbService from "../service/IJiraDbService";
import CommsService from "../service/impl/CommsService";
import Handler from "./Handler";

let instance: JiraHandler = null;
export default class JiraHandler implements Handler {

    #commsService: CommsService = null;
    #jiraDbService: IJiraDbService = null;

    constructor(commsService: CommsService, jiraDbService: IJiraDbService) {
        if (instance === null) {
            this.#commsService = commsService;
            this.#jiraDbService = jiraDbService;
            instance = this;
        }
        return instance;
    }

    #createJira() {
        this.#commsService.getRequest(CommunicationEvents.createJira, ([jiraItem]: JiraItem[]) => this.#jiraDbService.create(jiraItem));
    }

    #deleteJira() {
        this.#commsService.getRequest(CommunicationEvents.deleteJira, ([jiraKey]: string[]) => this.#jiraDbService.delete(jiraKey));
    }

    #getByPiRef() {
        this.#commsService.getRequest(CommunicationEvents.getJiraByPi, ([piRef]: [string]) => this.#jiraDbService.getByPiRef(piRef as PiRef));
    }

    #getByTypeAndFeatureRef() {
        this.#commsService.getRequest(CommunicationEvents.getJiraByFeature, ([jiraType, featureRef]: [number, string]) => this.#jiraDbService.getByTypeAndFeatureRef(jiraType, featureRef as JiraKey));
    }

    #modifyJira() {
        this.#commsService.getRequest(CommunicationEvents.modifyJira,
            ([jiraItem]: JiraItem[]) => this.#jiraDbService.modify(jiraItem))
    }

    #completeJira() {
        this.#commsService.getRequest(CommunicationEvents.completeJira, ([jiraKey]: string[]) => this.#jiraDbService.setIncomplete(jiraKey));
    }
    
    


    execute() {
        this.#createJira();
        this.#deleteJira();
        this.#getByPiRef();
        this.#getByTypeAndFeatureRef();
        this.#modifyJira();
        this.#completeJira();
    }

}