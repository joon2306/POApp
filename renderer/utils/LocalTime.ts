import NumberUtils from "./NumberUtils";

const defaultTimeFormat = (h: number, m: number) => h === 0 ? `${m}m` : `${h}h ${m}m`;

export default interface ILocalTime {
    format(customFormat: (h: number, m: number) => string);
}

export class LocalTime implements ILocalTime {

    #minutes: number;

    static of = (minutes: number) => {
        const instance = new LocalTime();
        instance.#minutes = minutes;
        return instance;
    }

    format(customFormat: (h: number, m: number) => string = defaultTimeFormat) {
        if (this.#minutes === 0) {
            return customFormat(0, 0);
        }
        if (!this.#minutes) {
            throw new Error("Minutes have not been added");
        }
        let h = 0;
        let m = 0;
        if (this.#minutes > 60) {
            h = Math.floor(this.#minutes / 60);
            m = this.#minutes - (h * 60);
        } else {
            m = this.#minutes;
        }
        return customFormat(h, NumberUtils.of(m).toFixed(0));
    }

}