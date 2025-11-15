import CommunicationEvents from "../../renderer/types/CommunicationEvent";
import { JiraItem, PiRef } from "../model/JiraItem";
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

    #getByTypeAndPiRef() {
        this.#commsService.getRequest(CommunicationEvents.getJiraByType, ([jiraKey, piRef]: string[]) => this.#jiraDbService.getByTypeAndPiRef(jiraKey, piRef as PiRef));
    }

    #modifyJira() {
        this.#commsService.getRequest(CommunicationEvents.modifyJira, ([jiraItem]: JiraItem[]) => this.#jiraDbService.modify(jiraItem))
    }
    
    


    execute() {
        this.#createJira();
        this.#deleteJira();
        this.#getByTypeAndPiRef();
        this.#modifyJira();
    }

}