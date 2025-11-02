import ICopyService from "./ICopyService";
let instance: CopyService = null;
export default class CopyService implements ICopyService {

    constructor() {
        if (instance === null) {
            instance = this;
        }
        return this;
    }

    copy(input: string[]): void {
        for (const str of input) {
            if (str && str.trim()) {
                console.log("string: ", str);
            }
        }
    }

}