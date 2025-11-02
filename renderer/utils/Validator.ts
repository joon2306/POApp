interface IValidator {
    validate(): boolean;

}
interface IStringValidator extends IValidator {
    isBlank(): IStringValidator;
}

class StringValidator implements IStringValidator {

    #str: string;
    #error: boolean;

    constructor(str: string) {
        this.#str = str;
        this.#error = false;
    }


    isBlank() {
        const validString = !!(this.#str && this.#str.trim())
        this.#error = !validString;
        return this;
    }

    validate() {
        return this.#error;
    }

}

export default class Validator {

    static string(str: string): StringValidator {
        return new StringValidator(str);
    }


}