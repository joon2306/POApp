import OutlookCalendarService from "../OutlookCalendarService";

const testDate = process.env.OUTLOOK_CALENDAR_TEST_DATE;
const liveTest = testDate ? it : it.skip;

describe("OutlookCalendarService live CDP integration", () => {
    liveTest("reads timed meetings from the requested Outlook date", async () => {
        const result = await new OutlookCalendarService().getForDate(testDate);

        expect(result.error).toBe(false);
        if (result.error === false) {
            expect(result.events.length).toBeGreaterThan(0);
            expect(result.events[0]).toEqual(expect.objectContaining({
                sourceKey: expect.any(String),
                title: expect.any(String),
                start: expect.stringContaining(testDate),
                end: expect.any(String),
                durationMinutes: expect.any(Number),
                cancelled: expect.any(Boolean),
            }));
            console.log(JSON.stringify(result, null, 2));
        }
    }, 30_000);
});
