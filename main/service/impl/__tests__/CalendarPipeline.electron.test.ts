import Database from "better-sqlite3";
import CalendarMeetingDbService from "../CalendarMeetingDbService";
import OutlookCalendarService from "../OutlookCalendarService";

const testDate = process.env.OUTLOOK_CALENDAR_TEST_DATE;
const liveTest = testDate ? it : it.skip;

describe("live Outlook-to-Kanban pipeline", () => {
    liveTest("imports real Outlook events transactionally into Todo cards", async () => {
        const calendar = await new OutlookCalendarService().getForDate(testDate);
        expect(calendar.error).toBe(false);
        if (calendar.error === true) return;

        const db = new Database(":memory:");
        try {
            db.exec(`
                CREATE TABLE kanban_items (
                    id INTEGER PRIMARY KEY, title TEXT, description TEXT, priority INTEGER,
                    status INTEGER, time INTEGER, start INTEGER, duration INTEGER
                );
                CREATE TABLE calendar_meetings (
                    sourceKey TEXT PRIMARY KEY, kanbanItemId INTEGER, outlookTitle TEXT NOT NULL,
                    organizer TEXT, start INTEGER NOT NULL, end INTEGER NOT NULL,
                    calendarDate TEXT NOT NULL, cancelled INTEGER NOT NULL DEFAULT 0,
                    resolvedAt INTEGER, lastSeenAt INTEGER NOT NULL
                );
            `);
            const firstStart = Math.min(...calendar.events.filter(event => !event.cancelled).map(event => Date.parse(event.start)));
            const simulatedLaunch = new Date(firstStart - 60_000).toISOString();
            const result = new CalendarMeetingDbService(db).reconcile(calendar.events, simulatedLaunch);
            const cards = db.prepare("SELECT title, priority, status, time FROM kanban_items ORDER BY id").all() as any[];

            expect(result.kanbanChanged).toBe(true);
            expect(cards.length).toBeGreaterThan(0);
            expect(cards.every(card => card.title.startsWith("Teams meeting: "))).toBe(true);
            expect(cards.every(card => card.priority === 4 && card.status === 1 && card.time > 0)).toBe(true);
            expect(cards.some(card => card.title.startsWith("Teams meeting: Canceled:"))).toBe(false);
            console.log(JSON.stringify(cards, null, 2));
        } finally {
            db.close();
        }
    }, 40_000);
});
