import React from "react";
import { useCalendarStatus } from "../provider/CalendarStatusProvider";
import { CalendarUpdate } from "../types/CalendarTypes";

export default function CalendarBanner({ status: suppliedStatus }: { status?: CalendarUpdate | null }) {
    const contextStatus = useCalendarStatus();
    const status = suppliedStatus === undefined ? contextStatus : suppliedStatus;
    if (!status || (!status.readError && status.overdueMeetings.length === 0)) return null;

    return (
        <div className="space-y-2 px-6 pt-4" aria-live="polite">
            {status.readError && (
                <div
                    data-testid="calendar-read-warning"
                    className="rounded-lg border border-amber-400 bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-900"
                    role="status"
                >
                    Outlook calendar could not be read: {status.readError}
                </div>
            )}

            {status.overdueMeetings.length > 0 && (
                <div
                    data-testid="calendar-overdue-warning"
                    className="rounded-lg border border-red-600 bg-red-100 px-4 py-3 text-red-900"
                    role="alert"
                >
                    <div className="font-bold">Completed meetings still need action in your Kanban</div>
                    <ul className="mt-1 list-disc pl-5 text-sm">
                        {status.overdueMeetings.map(meeting => (
                            <li key={meeting.kanbanItemId}>
                                {meeting.title} (ended at {formatTime(meeting.end)})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

function formatTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
