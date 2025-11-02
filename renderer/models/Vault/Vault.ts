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

    async #addToClipboard(text: string) {
        if (text) {
            console.log("writing text: ", text)
            return navigator.clipboard.writeText(text).then(() => console.log("text has been written: ", text))
        }
    }

    get title() {
        return this.#texts[0];
    }

    get texts() {
        return this.#texts;
    }
}