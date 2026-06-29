import { parseOwaEvent, toLocalDateKey } from "../parseOwaEvent";

describe("parseOwaEvent", () => {
    it("parses a normal timed meeting", () => {
        const event = parseOwaEvent(
            "ADT Sync Meeting, 12:30 to 13:00, Friday, June 26, 2026, By Pasquet Beatrice, Tentative, Recurring event",
        );
        expect(event).toMatchObject({
            title: "ADT Sync Meeting", organizer: "Pasquet Beatrice", durationMinutes: 30, cancelled: false,
        });
        expect(event.start).toContain("2026-06-26T12:30:00.000");
        expect(event.end).toContain("2026-06-26T13:00:00.000");
    });

    it("keeps a cancelled event for reconciliation", () => {
        const event = parseOwaEvent(
            "Canceled: Daily ADT MU, 16:30 to 17:00, Friday, June 26, 2026, By Bhoomita, Free, Recurring event",
        );
        expect(event.cancelled).toBe(true);
        expect(event.durationMinutes).toBe(30);
    });

    it("supports meetings crossing midnight", () => {
        const event = parseOwaEvent("Release, 23:30 to 00:15, Friday, June 26, 2026, By Owner, Busy");
        expect(event.durationMinutes).toBe(45);
        expect(toLocalDateKey(new Date(event.end))).toBe("2026-06-27");
    });

    it("ignores all-day and malformed labels", () => {
        expect(parseOwaEvent("Company holiday, Friday, June 26, 2026")).toBeNull();
        expect(parseOwaEvent("")).toBeNull();
    });
});
