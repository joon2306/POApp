import IMediator from "../IMediator";
import IUnsubscribe from "../IUnsubscribe";

let instance = null;
export default class Mediator implements IMediator {

    private _map: Map<string, Function> = new Map();

    constructor() {
        if (instance == null) {
            instance = this;
        }
        return instance;
    }

    subscribe<T>(event: string, callback: (arg: T) => void): IUnsubscribe {
        this._map.set(event, callback);
        return new Unsubscribe(this._map, event);
    }
    publish<T>(event: string, data?: T): void {
        const callback = this._map.get(event);
        if (!callback || typeof callback !== 'function') {
            throw new Error(`No subscribers for event ${event}`);
        }
        callback(data);
    }

}


class Unsubscribe implements IUnsubscribe {
    private _map: Map<string, Function> = null;
    private _event: string = null;

    constructor(map: Map<string, Function>, event: string) {
            this._map = map;
            this._event = event;
    }

    unsubscribe(): void {
        if (!this._map.has(this._event)) {
            throw new Error(`No subscribers for event ${this._event}`);
        }
        this._map.delete(this._event);
    }
}