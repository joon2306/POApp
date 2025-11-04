import Vault, { VaultImpl, VaultInput, VaultResponse } from "../models/Vault/Vault";
import CommunicationEvents from "../types/CommunicationEvent";
import GenericResponse from "../types/GenericResponse";
import ICommsService from "./ICommsService";
import ITokenService from "./ITokenService";
import IUniqueVaultService from "./UniqueVaultService";

export default interface IVaultService {

    get(): Promise<Vault[]>;

    add(input: VaultInput): void;

    delete(title: string): void;

}

let instance: VaultService = null;
export class VaultService implements IVaultService {

    #uniqueVaults: Vault[] = [];
    #uniqueVaultService: IUniqueVaultService;
    #tokenService: ITokenService;
    #commsService: ICommsService;


    constructor(uniqueVaultService: IUniqueVaultService, tokenService: ITokenService, commsService: ICommsService) {
        if (instance === null) {
            this.#uniqueVaultService = uniqueVaultService;
            this.#tokenService = tokenService;
            this.#commsService = commsService;
            this.#initUniqueVaults();
            instance = this;
        }
        return instance;
    }

    async #generateToken(): Promise<void> {
        await this.#tokenService.generateToken();
    }

    #initUniqueVaults() {
        this.#uniqueVaultService.subscribe("tokenGenerator", this.#generateToken.bind(this));
        this.#uniqueVaults = [
            new VaultImpl({ title: "Token", texts: ["token"], uniqueVault: true })
        ]
    }

    async get(): Promise<Vault[]> {
        const { error, data } = await this.#commsService.sendRequest<GenericResponse<VaultResponse[]>>(CommunicationEvents.getVaultItems, {});
        if (error) {
            return this.#uniqueVaults;
        }
        const vaults: Vault[] = data.map(item => new VaultImpl({ title: item.title, texts: [item.text1, item.text2, item.text3], uniqueVault: false }));
        return [...this.#uniqueVaults, ...vaults];
    }

    add(input: VaultInput): void {
        this.#commsService.sendRequest(CommunicationEvents.saveVaultItem, { title: input.title, text1: input.texts[0], text2: input.texts[1], text3: input.texts[2] });
    }

    modify(vault: Vault): void {
        this.#commsService.sendRequest(CommunicationEvents.modifyVaultItem, { title: vault.title, text1: vault.texts[0], text2: vault.texts[1], text3: vault.texts[2] });
    }

    delete(title: string): void {
        this.#commsService.sendRequest(CommunicationEvents.deleteVaultItem, title);
    }
}