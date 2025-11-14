interface IValidator {
    validate(): boolean;

}
interface IStringValidator extends IValidator {
    isBlank(): IStringValidator;
}

interface IDateValidator extends IValidator {
    isBefore(target: Date): IDateValidator;
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

class DateValidator implements IDateValidator {

    #dateTimestamp: number;
    #error: boolean;
    constructor(date: Date) {
        this.#dateTimestamp = date.getTime();
        this.#error = false;
        if(isNaN(this.#dateTimestamp)) {
            this.#error = true;
        }
    }

    isBefore(target: Date) {
        const targetTimestamp = target.getTime();
        if (this.#dateTimestamp < targetTimestamp) {
            this.#error = true;
        }
        return this;
    }

    validate(): boolean {
        return this.#error;
    }
}

export default class Validator {

    static string(str: string): StringValidator {
        return new StringValidator(str);
    }

    static date(date: string | Date): DateValidator {
        if (typeof date === "string") {
            date = new Date(date);
        }
        return new DateValidator(date);
    }

}