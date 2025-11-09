import NumberUtils from "./NumberUtils";

export default class ProgressUtils {

    static getProgress(total: number, inProgress: number) {
        if(total === 0) {
            return 0;
        }
        return NumberUtils.of((inProgress / total) * 100).toFixed(2);
    }   
}