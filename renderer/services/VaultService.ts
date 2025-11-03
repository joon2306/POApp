import Vault, { VaultImpl, VaultInput } from "../models/Vault/Vault";

export default interface IVaultService {

    get(): Vault[];

    add(input: VaultInput): void;

    delete(title: string): void;

}

let instance: VaultService = null;
export class VaultService implements IVaultService {

    #vaults: Vault[] = [];


    constructor() {
        if (instance === null) {
            this.#initVaults();
            instance = this;
        }
        return instance;
    }

    #initVaults() {
        this.#vaults = [
            new VaultImpl({ title: "test", texts: ["text1"] }),
            new VaultImpl({ title: "test1", texts: ["text12", "text22"] }),
            new VaultImpl({ title: "test3", texts: ["text13", "text23", "text33"] })
        ]
    }

    get(): Vault[] {
        return this.#vaults;
    }

    add(input: VaultInput): void {
        this.#vaults.push(new VaultImpl(input));
    }

    modify(vault: Vault): void {
        this.#vaults = this.#vaults.map(item => {
            if(item.title === vault.title) {
                item.texts = vault.texts;
            }
            return item;
        })
    }

    delete(title: string): void {
        const index = this.#vaults.findIndex(item => item.title === title);
        this.#vaults.splice(index, 1);
    }




}