export type PiTitle = `SL${number}.${number}`;

export type Pi = {
    title: PiTitle;
    sprintTimestamp: {
        first: number;
        second: number;
        third: number;
        fourth: number;
        fifth: number;
        ip: number;
    }
}


export type PiResponse = {
    title: PiTitle;
    s1: number;
    s2: number;
    s3: number;
    s4: number;
    s5: number;
    ip: number;
}