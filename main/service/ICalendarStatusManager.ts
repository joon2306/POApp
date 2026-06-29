import { CalendarUpdate } from "../../renderer/types/CalendarTypes";

export default interface ICalendarStatusManager {
    getLast(): CalendarUpdate | null;
    refreshStatus(): CalendarUpdate | null;
}
