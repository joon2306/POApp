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

const getEndLunchTime = () => {
    const timeAt6 = new Date();
    timeAt6.setHours(13, 0, 0, 0);
    return timeAt6.getTime();
}

const getStartLunchTime = () => {
    const time = new Date();
    time.setHours(12, 0, 0, 0);
    return time.getTime();
}

const getEndOfDay = () => {
    const time = new Date();
    time.setHours(16, 30, 0, 0);
    return time.getTime();
}

export interface TimeUtils {
    startOfWork: number;
    startOfDay: number;
    endLunchTime: number;
    endOfDay: number;
    startLunchTime: number;
    toMinutes: (timestamp: number) => number
}

const getTimeUtils: () => TimeUtils = () => {
    const startOfDay = getStartOfDay();
    const startOfWork = getStartOfWork();
    const endLunchTime = getEndLunchTime();
    const startLunchTime = getStartLunchTime();
    const endOfDay = getEndOfDay();
    return Object.freeze({
        startOfWork,
        startOfDay,
        endLunchTime,
        startLunchTime,
        endOfDay,
        toMinutes: (timeStamp) => timeStamp / (60 * 1000)
    });
}

export default getTimeUtils;