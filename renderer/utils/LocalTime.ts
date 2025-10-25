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



    format(customFormat: (h: number, m: number) => string) {
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
        return customFormat(h, m);
    }

}