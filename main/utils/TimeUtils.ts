
const getStartOfDay = () => {
    const timeAt6 = new Date();
    timeAt6.setHours(6, 0, 0, 0);
    return timeAt6.getTime();
}

const getLunchTime = () => {
    const timeAt6 = new Date();
    timeAt6.setHours(12, 0, 0, 0);
    return timeAt6.getTime();
}

export interface TimeUtils {
    startOfDay: number;
    lunchTime: number;
}

const getTimeUtils: () => TimeUtils = () => {
    const startOfDay = getStartOfDay();
    const lunchTime = getLunchTime();
    return Object.freeze({
        startOfDay,
        lunchTime
    });
}

export default getTimeUtils;