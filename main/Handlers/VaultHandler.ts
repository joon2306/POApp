import CommunicationEvents from "../../renderer/types/CommunicationEvent";
import { VaultDbItem } from "../model/VaultDbItem";
import ICommunicationService from "../service/ICommunicationService";
import IVaultDbService from "../service/VaultDbService";
import Handler from "./Handler";

let instance: VaultHandler = null;
export default class VaultHandler implements Handler {

    #commsService: ICommunicationService;
    #vaultDbService: IVaultDbService;
    constructor(commsService: ICommunicationService, vaultDbService: IVaultDbService) {
        if (instance === null) {
            this.#commsService = commsService;
            this.#vaultDbService = vaultDbService;
            instance = this;
        }
        return instance;
    }
    #getAll() {
        const getAll = () => this.#vaultDbService.getAll();
        this.#commsService.getRequest(CommunicationEvents.getVaultItems, () => getAll());
    }

    #create() {
        const save = ([{ title, text1, text2, text3 }]: VaultDbItem[]) => {
            return this.#vaultDbService.create({ title, text1, text2, text3 });
        }
        this.#commsService.getRequest(CommunicationEvents.saveVaultItem, (vault: VaultDbItem[]) => save(vault));
    }

    #delete() {
        const deleteVault = ([ title ]: Array<string>) => {
            return this.#vaultDbService.delete(title);
        }
        this.#commsService.getRequest(CommunicationEvents.deleteVaultItem, ([ title ]: Array<string>) => deleteVault([title]));
    }

    #modify() {
        const modify = ([{ title, text1, text2, text3 }]: VaultDbItem[]) => {
            return this.#vaultDbService.modify({ title, text1, text2, text3 });
        }
        this.#commsService.getRequest(CommunicationEvents.modifyVaultItem, (vault: VaultDbItem[]) => modify(vault));
    }

    execute() {
        this.#getAll();
        this.#create();
        this.#delete();
        this.#modify();
    }
    
}