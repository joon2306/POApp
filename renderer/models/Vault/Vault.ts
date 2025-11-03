export type VaultInput = {
    title: string;
    texts: string[]
}

export default interface Vault {
    title: string;
    texts: string[]
}

export class VaultImpl implements Vault {
    #texts: string[] = [];
    #title: string;

    constructor({ title, texts}: VaultInput) {
        this.#title = title;
        this.#texts = texts;
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
}