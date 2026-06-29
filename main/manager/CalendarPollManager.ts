import { BrowserWindow } from "electron";
import { CalendarUpdate } from "../../renderer/types/CalendarTypes";
import IOutlookCalendarService from "../service/IOutlookCalendarService";
import ICalendarMeetingDbService from "../service/ICalendarMeetingDbService";
import ICalendarStatusManager from "../service/ICalendarStatusManager";
import BackgroundTask from "./BackgroundTask";

export const CALENDAR_POLL_INTERVAL_MS = 10 * 60 * 1000;

export default class CalendarPollManager implements BackgroundTask, ICalendarStatusManager {
    private timer: NodeJS.Timeout | null = null;
    private running = false;
    private last: CalendarUpdate | null = null;
    private deadlineTimer: NodeJS.Timeout | null = null;

    constructor(
        private readonly calendarService: IOutlookCalendarService,
        private readonly calendarMeetingDbService: ICalendarMeetingDbService,
        private readonly getWindow: () => BrowserWindow | null,
    ) {}

    start(): void {
        if (this.timer) return;
        void this.pollNow();
        this.timer = setInterval(() => void this.pollNow(), CALENDAR_POLL_INTERVAL_MS);
    }

    stop(): void {
        if (this.timer) clearInterval(this.timer);
        if (this.deadlineTimer) clearTimeout(this.deadlineTimer);
        this.timer = null;
        this.deadlineTimer = null;
    }

    getLast(): CalendarUpdate | null {
        return this.last;
    }

    async pollNow(): Promise<CalendarUpdate | null> {
        if (this.running) return this.last;
        this.running = true;
        try {
            const result = await this.calendarService.getToday();
            if (result.error === false) {
                const reconciled = this.calendarMeetingDbService.reconcile(result.events, result.fetchedAt);
                this.last = {
                    fetchedAt: result.fetchedAt,
                    readError: null,
                    kanbanChanged: reconciled.kanbanChanged,
                    overdueMeetings: reconciled.overdueMeetings,
                };
            } else {
                this.last = {
                    fetchedAt: result.fetchedAt,
                    readError: result.message,
                    kanbanChanged: false,
                    overdueMeetings: this.calendarMeetingDbService.getOverdueMeetings(),
                };
            }
            this.push(this.last);
            this.scheduleDeadlineRefresh();
            return this.last;
        } catch (error: any) {
            this.last = {
                fetchedAt: new Date().toISOString(),
                readError: `Calendar synchronization failed: ${error?.message ?? String(error)}`,
                kanbanChanged: false,
                overdueMeetings: this.last?.overdueMeetings ?? [],
            };
            this.push(this.last);
            return this.last;
        } finally {
            this.running = false;
        }
    }

    refreshStatus(): CalendarUpdate | null {
        if (!this.last) return null;
        this.last = {
            ...this.last,
            kanbanChanged: false,
            overdueMeetings: this.calendarMeetingDbService.getOverdueMeetings(),
        };
        this.push(this.last);
        this.scheduleDeadlineRefresh();
        return this.last;
    }

    private scheduleDeadlineRefresh(): void {
        if (this.deadlineTimer) clearTimeout(this.deadlineTimer);
        this.deadlineTimer = null;
        const nextEnd = this.calendarMeetingDbService.getNextMeetingEnd();
        if (nextEnd === null) return;
        const delay = Math.max(0, nextEnd - Date.now() + 1000);
        this.deadlineTimer = setTimeout(() => this.refreshStatus(), delay);
    }

    private push(update: CalendarUpdate): void {
        const window = this.getWindow();
        if (window && !window.isDestroyed()) {
            try {
                window.webContents.send("calendarUpdate", update);
            } catch (error) {
                console.error("Could not push calendar status to renderer", error);
            }
        }
    }
}
