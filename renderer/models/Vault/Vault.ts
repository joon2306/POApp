export type VaultInput = {
    title: string;
    texts: string[],
    uniqueVault: boolean
}

export type VaultResponse = {
    title: string;
    text1: string;
    text2?: string;
    text3?: string;
}

export default interface Vault {
    title: string;
    texts: string[],
    uniqueVault: boolean
}

export class VaultImpl implements Vault {
    #texts: string[] = [];
    #title: string;
    #uniqueVault: boolean;

    constructor({ title, texts, uniqueVault }: VaultInput) {
        this.#title = title;
        this.#texts = texts;
        this.#uniqueVault = uniqueVault;
    }

    get title() {
        return this.#title;
    }

    get texts() {
        return this.#texts;
    }

    set texts(texts: string[]) {
        this.#texts = texts;
    }

    set uniqueVault(value: boolean) {
        this.#uniqueVault = value;
    }
    get uniqueVault() {
        return this.#uniqueVault;
    }

}