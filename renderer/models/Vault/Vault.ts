export type VaultInput = {
    title: string;
    text1: string;
    text2?: string;
    text3?: string;
}

export default interface Vault {
    title: string;
    texts: string[]
}

export class VaultImpl implements Vault {
    #texts: string[] = [];

    constructor({ title, text1, text2, text3 }: VaultInput) {
        this.#texts = [title, text1, text2, text3];
    }

    get title() {
        return this.#texts[0];
    }

    get texts() {
        return this.#texts;
    }
}