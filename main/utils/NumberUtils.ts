export interface INumberUtils {

}
export default class NumberUtils {
    #digit:number;

    static of(digit: number) {
        const instance = new NumberUtils();
        instance.#digit = digit;
        return instance;
    }

    toFixed(num: number) {
        if (isNaN(this.#digit)) {
            console.error("digit is incorrect");
        }
        return Number(this.#digit.toFixed(num));
    }

}