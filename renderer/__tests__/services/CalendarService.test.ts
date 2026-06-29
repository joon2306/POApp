import CalendarService from "../../services/impl/CalendarService";
import CommsService from "../../services/impl/CommsService";
import CommunicationEvents from "../../types/CommunicationEvent";

describe("CalendarService", () => {
    it("pulls cached status through the standard IPC request bridge", async () => {
        const update = { fetchedAt: "now", readError: null, kanbanChanged: false, overdueMeetings: [] };
        const request = jest.spyOn(CommsService.prototype, "sendRequest").mockResolvedValue(update);

        await expect(new CalendarService().getStatus()).resolves.toEqual(update);
        expect(request).toHaveBeenCalledWith(CommunicationEvents.calendarGetStatus, null);
    });

    it("subscribes to pushed updates and returns the IPC unsubscribe function", () => {
        const unsubscribe = jest.fn();
        const on = jest.fn().mockReturnValue(unsubscribe);
        Object.defineProperty(window, "ipc", { value: { on }, configurable: true });
        const callback = jest.fn();

        expect(new CalendarService().subscribe(callback)).toBe(unsubscribe);
        expect(on).toHaveBeenCalledWith(CommunicationEvents.calendarUpdate, callback);
    });
});
