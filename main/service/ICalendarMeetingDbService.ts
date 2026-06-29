import { OverdueMeeting } from "../../renderer/types/CalendarTypes";
import { CalendarEvent } from "./IOutlookCalendarService";

export type CalendarReconcileResult = {
    kanbanChanged: boolean;
    overdueMeetings: OverdueMeeting[];
};

export default interface ICalendarMeetingDbService {
    reconcile(events: CalendarEvent[], fetchedAt: string): CalendarReconcileResult;
    getOverdueMeetings(now?: number): OverdueMeeting[];
    getNextMeetingEnd(now?: number): number | null;
    resolveByKanbanItemId(kanbanItemId: number): void;
}
