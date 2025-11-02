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
            new VaultImpl({title: "test", text1: "text1"}),
            new VaultImpl({title: "test1", text1: "text12", text2: "text22"}),
            new VaultImpl({title: "test3", text1: "text13", text2: "text23", text3: "text33"})
        ]
    }

    get(): Vault[] {
        return this.#vaults;
    }

    add(input: VaultInput): void {
        this.#vaults.push(new VaultImpl(input));
    }

    delete(title: string): void {
        const index = this.#vaults.findIndex(item => item.title === title);
        this.#vaults.splice(index, 1);
    }




}