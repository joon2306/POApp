interface ILocalDate {
    format(customFormat: (day: Day, year: number, month: Month) => string): string;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

type Day = typeof days[number];

type Month = typeof months[number];

export default class LocalDate implements ILocalDate {

    #date: Date = null

    static now() {
        const instance = new LocalDate();
        instance.#date = new Date();
        return instance;
    }

    static of(dateStr: string) {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            throw new Error("invalid date string");
        }
        const instance = new LocalDate();
        instance.#date = date;
        return instance;
    }

    format(customFormat: (day: Day, year: number, month: Month) => string) {
        if (!this.#date) {
            throw new Error("Date has not been defined yet");
        }
        const day = days[this.#date.getDay()];
        const year = this.#date.getFullYear();
        const month = months[this.#date.getMonth()];

        return customFormat(day, year, month);
    }

}