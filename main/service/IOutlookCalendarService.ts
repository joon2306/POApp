export type CalendarEvent = {
    sourceKey: string;
    title: string;
    organizer?: string;
    start: string;
    end: string;
    durationMinutes: number;
    cancelled: boolean;
};

export type CalendarReadResult =
    | { error: false; fetchedAt: string; events: CalendarEvent[] }
    | { error: true; fetchedAt: string; message: string };

export default interface IOutlookCalendarService {
    /** Reads today's timed calendar entries. Failures are returned and never thrown. */
    getToday(): Promise<CalendarReadResult>;

    /** Date-selectable entry point used by integration tests and diagnostics. */
    getForDate(date: Date | string): Promise<CalendarReadResult>;
}
