export default interface IStringValidator {
    blank(): void

    hasError(): boolean;

}

export class StringValidator implements IStringValidator {

    #str: string;
    #error: boolean;

    constructor(str: string) {
        this.#str = str;
        this.#error = false;
    }

    static validate(str: string): StringValidator {
        return new StringValidator(str);
    }

    blank() {
        const validString = !!(this.#str && this.#str.trim())
        this.#error = !validString;
        return this;
    }

    hasError() {
        return this.#error;
    }


}