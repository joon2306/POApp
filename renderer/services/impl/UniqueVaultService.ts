import IUniqueVaultService from "../UniqueVaultService";

let instance: UniqueVaultService = null;

type Callback = {
    callback: (args?: unknown) => void;
    args?: unknown;
}
export default class UniqueVaultService implements IUniqueVaultService {

    #map: Map<String, Callback>;

    constructor() {
        if (instance === null) {
            this.#map = new Map<String, Callback>();
            instance = this;
        }
        return instance;
    }

    subscribe(id: string, callback: () => void, args?: unknown): void {
        this.#map.set(id, {callback: callback, args: args});
    }
    unsubscribe(id: string): void {
        this.#map.delete(id);
    }
    async execute(id: string): Promise<void> {
        const callback = this.#map.get(id);
        if(!callback) {
            console.log("no callback registered for vault: ", id);
            return;
        }
        await callback.callback(callback.args);
    }

}