import CalendarPollManager, { CALENDAR_POLL_INTERVAL_MS } from "../CalendarPollManager";
import IOutlookCalendarService from "../../service/IOutlookCalendarService";
import ICalendarMeetingDbService from "../../service/ICalendarMeetingDbService";

const meetingDb = (): ICalendarMeetingDbService => ({
    reconcile: jest.fn().mockReturnValue({ kanbanChanged: false, overdueMeetings: [] }),
    getOverdueMeetings: jest.fn().mockReturnValue([]),
    getNextMeetingEnd: jest.fn().mockReturnValue(null),
    resolveByKanbanItemId: jest.fn(),
});

describe("CalendarPollManager", () => {
    it("caches and pushes a successful read", async () => {
        const service = {
            getToday: jest.fn().mockResolvedValue({ error: false, fetchedAt: "2026-06-27T10:00:00Z", events: [] }),
        } as unknown as IOutlookCalendarService;
        const send = jest.fn();
        const window = { isDestroyed: () => false, webContents: { send } } as any;
        const manager = new CalendarPollManager(service, meetingDb(), () => window);

        const result = await manager.pollNow();

        expect(result).toEqual({
            fetchedAt: "2026-06-27T10:00:00Z",
            readError: null,
            kanbanChanged: false,
            overdueMeetings: [],
        });
        expect(manager.getLast()).toEqual(result);
        expect(send).toHaveBeenCalledWith("calendarUpdate", result);
    });

    it("converts reader failures into cached UI status", async () => {
        const service = {
            getToday: jest.fn().mockResolvedValue({
                error: true,
                fetchedAt: "2026-06-27T10:00:00Z",
                message: "Cannot access Outlook",
            }),
        } as unknown as IOutlookCalendarService;
        const manager = new CalendarPollManager(service, meetingDb(), () => null);

        await expect(manager.pollNow()).resolves.toMatchObject({ readError: "Cannot access Outlook" });
    });

    it("starts immediately and schedules ten-minute polls", async () => {
        jest.useFakeTimers();
        const service = {
            getToday: jest.fn().mockResolvedValue({ error: false, fetchedAt: "now", events: [] }),
        } as unknown as IOutlookCalendarService;
        const manager = new CalendarPollManager(service, meetingDb(), () => null);

        manager.start();
        await Promise.resolve();
        expect(service.getToday).toHaveBeenCalledTimes(1);

        jest.advanceTimersByTime(CALENDAR_POLL_INTERVAL_MS);
        await Promise.resolve();
        expect(service.getToday).toHaveBeenCalledTimes(2);

        manager.stop();
        jest.useRealTimers();
    });
});
