const getTime = (hour: number, min: number): number => {
    const date = new Date();
    date.setHours(hour, min, 0, 0);
    return date.getTime();
}
const getStartOfDay = () => {
    return getTime(6, 0);
}

const getStartOfWork = () => {
    return getTime(8, 30);
}

const getLunchTime = () => {
    const timeAt6 = new Date();
    timeAt6.setHours(12, 0, 0, 0);
    return timeAt6.getTime();
}

export interface TimeUtils {
    startOfWork: number;
    startOfDay: number;
    lunchTime: number;
    toMinutes: (timestamp: number) => number
}

const getTimeUtils: () => TimeUtils = () => {
    const startOfDay = getStartOfDay();
    const startOfWork = getStartOfWork();
    const lunchTime = getLunchTime();
    return Object.freeze({
        startOfWork,
        startOfDay,
        lunchTime,
        toMinutes: (timeStamp) => timeStamp / (60 * 1000)
    });
}

export default getTimeUtils;