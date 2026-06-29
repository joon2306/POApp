export type ParsedOwaEvent = {
    title: string;
    organizer?: string;
    start: string;
    end: string;
    durationMinutes: number;
    cancelled: boolean;
};

const MONTHS: Record<string, number> = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
};

const TIMED_EVENT = /^(.*?),\s*(\d{1,2}):(\d{2})\s+to\s+(\d{1,2}):(\d{2}),\s*[A-Za-z]+,\s*([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})(.*)$/;

export function parseOwaEvent(label: string): ParsedOwaEvent | null {
    const match = TIMED_EVENT.exec(label.trim());
    if (!match) return null;

    const [, rawTitle, startHour, startMinute, endHour, endMinute, monthName, day, year, suffix] = match;
    const month = MONTHS[monthName];
    if (month === undefined) return null;

    const title = rawTitle.trim();
    const organizerMatch = /,\s*By\s+([^,]+)/i.exec(suffix);
    const start = new Date(+year, month, +day, +startHour, +startMinute, 0, 0);
    let end = new Date(+year, month, +day, +endHour, +endMinute, 0, 0);
    if (end.getTime() < start.getTime()) end = new Date(end.getTime() + 86_400_000);

    return {
        title,
        organizer: organizerMatch?.[1]?.trim() || undefined,
        start: toLocalIso(start),
        end: toLocalIso(end),
        durationMinutes: Math.round((end.getTime() - start.getTime()) / 60_000),
        cancelled: /^cancel(?:ed|led):/i.test(title),
    };
}

export function toLocalDateKey(date: Date): string {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toLocalIso(date: Date): string {
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    return `${toLocalDateKey(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}:00.000`
        + `${sign}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`;
}

function pad(value: number): string {
    return String(value).padStart(2, "0");
}
