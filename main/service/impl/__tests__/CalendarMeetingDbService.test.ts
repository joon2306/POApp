import Database from "better-sqlite3";
import CalendarMeetingDbService from "../CalendarMeetingDbService";
import { CalendarEvent } from "../../IOutlookCalendarService";

const upcoming: CalendarEvent = {
    sourceKey: "outlook:event-1",
    title: "Team Sync",
    organizer: "Owner",
    start: "2026-06-27T10:00:00.000+04:00",
    end: "2026-06-27T10:30:00.000+04:00",
    durationMinutes: 30,
    cancelled: false,
};

describe("CalendarMeetingDbService", () => {
    let db: Database;
    let service: CalendarMeetingDbService;

    beforeEach(() => {
        db = new Database(":memory:");
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
            CREATE UNIQUE INDEX idx_calendar_kanban_item ON calendar_meetings(kanbanItemId)
                WHERE kanbanItemId IS NOT NULL;
        `);
        service = new CalendarMeetingDbService(db);
    });

    afterEach(() => db.close());

    it("inserts an upcoming meeting once with the required Todo defaults", () => {
        const first = service.reconcile([upcoming], "2026-06-27T05:00:00.000Z");
        const second = service.reconcile([upcoming], "2026-06-27T05:10:00.000Z");
        const cards = db.prepare("SELECT * FROM kanban_items").all() as any[];

        expect(first.kanbanChanged).toBe(true);
        expect(second.kanbanChanged).toBe(false);
        expect(cards).toHaveLength(1);
        expect(cards[0]).toMatchObject({
            title: "Teams meeting: Team Sync",
            description: "Outlook meeting - 10:00-10:30",
            priority: 4,
            status: 1,
            time: 30,
        });
    });

    it("synchronizes calendar-owned fields while preserving lane and priority", () => {
        service.reconcile([upcoming], "2026-06-27T05:00:00.000Z");
        db.prepare("UPDATE kanban_items SET status = 2, priority = 3").run();
        const changed = {
            ...upcoming,
            title: "Renamed Sync",
            end: "2026-06-27T10:45:00.000+04:00",
            durationMinutes: 45,
        };

        expect(service.reconcile([changed], "2026-06-27T05:10:00.000Z").kanbanChanged).toBe(true);
        expect(db.prepare("SELECT title, status, priority, time FROM kanban_items").get()).toEqual({
            title: "Teams meeting: Renamed Sync",
            status: 2,
            priority: 3,
            time: 45,
        });
    });

    it("does not import meetings first discovered after they ended", () => {
        const result = service.reconcile([upcoming], "2026-06-27T07:00:00.000Z");
        expect(result.kanbanChanged).toBe(false);
        expect(db.prepare("SELECT COUNT(*) AS count FROM kanban_items").get()).toEqual({ count: 0 });
    });

    it("reports overdue cards until resolved and never recreates them", () => {
        service.reconcile([upcoming], "2026-06-27T05:00:00.000Z");
        const card = db.prepare("SELECT id FROM kanban_items").get() as { id: number };
        expect(service.getOverdueMeetings(Date.parse("2026-06-27T07:00:00.000Z"))).toHaveLength(1);

        service.resolveByKanbanItemId(card.id);
        expect(service.getOverdueMeetings(Date.parse("2026-06-27T07:00:00.000Z"))).toHaveLength(0);
        service.reconcile([upcoming], "2026-06-27T07:10:00.000Z");
        expect(db.prepare("SELECT COUNT(*) AS count FROM kanban_items").get()).toEqual({ count: 1 });
    });

    it("keeps a cancelled meeting card but removes it from overdue tracking", () => {
        service.reconcile([upcoming], "2026-06-27T05:00:00.000Z");
        service.reconcile([{ ...upcoming, cancelled: true }], "2026-06-27T05:10:00.000Z");

        expect(db.prepare("SELECT COUNT(*) AS count FROM kanban_items").get()).toEqual({ count: 1 });
        expect(service.getOverdueMeetings(Date.parse("2026-06-27T07:00:00.000Z"))).toHaveLength(0);
    });

    it("treats a meeting missing from a successful empty snapshot as cancelled", () => {
        service.reconcile([upcoming], "2026-06-27T05:00:00.000Z");
        service.reconcile([], "2026-06-27T05:10:00.000Z");

        expect(db.prepare("SELECT COUNT(*) AS count FROM kanban_items").get()).toEqual({ count: 1 });
        expect(service.getOverdueMeetings(Date.parse("2026-06-27T07:00:00.000Z"))).toHaveLength(0);
    });

    it("imports a future meeting if an initially cancelled event is restored", () => {
        service.reconcile([{ ...upcoming, cancelled: true }], "2026-06-27T05:00:00.000Z");
        expect(service.reconcile([upcoming], "2026-06-27T05:10:00.000Z").kanbanChanged).toBe(true);
        expect(db.prepare("SELECT COUNT(*) AS count FROM kanban_items").get()).toEqual({ count: 1 });
    });
});
