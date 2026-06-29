import Database from "better-sqlite3";
import { TABLE_CALENDAR_MEETINGS, TABLE_KANBAN_ITEMS } from "../../database/database";
import { OverdueMeeting } from "../../../renderer/types/CalendarTypes";
import ICalendarMeetingDbService, { CalendarReconcileResult } from "../ICalendarMeetingDbService";
import { CalendarEvent } from "../IOutlookCalendarService";

type TrackingRow = {
    sourceKey: string;
    kanbanItemId: number | null;
    cancelled: number;
    resolvedAt: number | null;
};

type KanbanRow = {
    id: number;
    title: string;
    description: string;
    time: number;
};

export default class CalendarMeetingDbService implements ICalendarMeetingDbService {
    constructor(private readonly db: Database) {}

    reconcile(events: CalendarEvent[], fetchedAt: string): CalendarReconcileResult {
        const seenAt = Date.parse(fetchedAt);
        const effectiveSeenAt = Number.isNaN(seenAt) ? Date.now() : seenAt;
        let kanbanChanged = false;
        const dates = new Set<string>();
        const snapshotDate = new Date(effectiveSeenAt);
        dates.add(`${snapshotDate.getFullYear()}-${String(snapshotDate.getMonth() + 1).padStart(2, "0")}-${String(snapshotDate.getDate()).padStart(2, "0")}`);

        const transaction = this.db.transaction(() => {
            for (const event of events) {
                const start = Date.parse(event.start);
                const end = Date.parse(event.end);
                if (Number.isNaN(start) || Number.isNaN(end)) continue;
                const calendarDate = event.start.slice(0, 10);
                dates.add(calendarDate);
                const existing = this.getTrackingRow(event.sourceKey);

                if (!existing) {
                    const shouldSkip = event.cancelled || end < effectiveSeenAt;
                    if (shouldSkip) {
                        this.insertTracking(event, null, start, end, calendarDate, effectiveSeenAt, end < effectiveSeenAt ? effectiveSeenAt : null);
                        continue;
                    }

                    const insert = this.db.prepare(
                        `INSERT INTO ${TABLE_KANBAN_ITEMS} (title, description, priority, status, time)
                         VALUES (?, ?, 4, 1, ?)`,
                    ).run(this.cardTitle(event), this.cardDescription(event), event.durationMinutes);
                    const kanbanItemId = Number(insert.lastInsertRowid);
                    this.insertTracking(event, kanbanItemId, start, end, calendarDate, effectiveSeenAt, null);
                    kanbanChanged = true;
                    continue;
                }

                this.db.prepare(
                    `UPDATE ${TABLE_CALENDAR_MEETINGS}
                     SET outlookTitle = ?, organizer = ?, start = ?, end = ?, calendarDate = ?,
                         cancelled = ?, lastSeenAt = ?
                     WHERE sourceKey = ?`,
                ).run(event.title, event.organizer ?? null, start, end, calendarDate,
                    event.cancelled ? 1 : 0, effectiveSeenAt, event.sourceKey);

                if (existing.resolvedAt || event.cancelled) continue;
                if (!existing.kanbanItemId) {
                    if (end >= effectiveSeenAt) {
                        const insert = this.db.prepare(
                            `INSERT INTO ${TABLE_KANBAN_ITEMS} (title, description, priority, status, time)
                             VALUES (?, ?, 4, 1, ?)`,
                        ).run(this.cardTitle(event), this.cardDescription(event), event.durationMinutes);
                        this.db.prepare(
                            `UPDATE ${TABLE_CALENDAR_MEETINGS} SET kanbanItemId = ? WHERE sourceKey = ?`,
                        ).run(Number(insert.lastInsertRowid), event.sourceKey);
                        kanbanChanged = true;
                    }
                    continue;
                }
                const card = this.db.prepare(
                    `SELECT id, title, description, time FROM ${TABLE_KANBAN_ITEMS} WHERE id = ?`,
                ).get(existing.kanbanItemId) as KanbanRow | undefined;
                if (!card) {
                    this.markResolved(event.sourceKey, effectiveSeenAt);
                    continue;
                }

                const title = this.cardTitle(event);
                const description = this.cardDescription(event);
                if (card.title !== title || card.description !== description || card.time !== event.durationMinutes) {
                    this.db.prepare(
                        `UPDATE ${TABLE_KANBAN_ITEMS} SET title = ?, description = ?, time = ? WHERE id = ?`,
                    ).run(title, description, event.durationMinutes, card.id);
                    kanbanChanged = true;
                }
            }

            for (const calendarDate of dates) {
                this.db.prepare(
                    `UPDATE ${TABLE_CALENDAR_MEETINGS}
                     SET cancelled = 1
                     WHERE calendarDate = ? AND lastSeenAt <> ? AND resolvedAt IS NULL`,
                ).run(calendarDate, effectiveSeenAt);
            }
        });

        transaction();
        return { kanbanChanged, overdueMeetings: this.getOverdueMeetings(effectiveSeenAt) };
    }

    getOverdueMeetings(now: number = Date.now()): OverdueMeeting[] {
        const rows = this.db.prepare(
            `SELECT c.kanbanItemId, k.title, c.end
             FROM ${TABLE_CALENDAR_MEETINGS} c
             INNER JOIN ${TABLE_KANBAN_ITEMS} k ON k.id = c.kanbanItemId
             WHERE c.end < ? AND c.cancelled = 0 AND c.resolvedAt IS NULL
             ORDER BY c.end ASC`,
        ).all(now) as Array<{ kanbanItemId: number; title: string; end: number }>;
        return rows.map(row => ({
            kanbanItemId: row.kanbanItemId,
            title: row.title,
            end: new Date(row.end).toISOString(),
        }));
    }

    getNextMeetingEnd(now: number = Date.now()): number | null {
        const row = this.db.prepare(
            `SELECT MIN(c.end) AS nextEnd
             FROM ${TABLE_CALENDAR_MEETINGS} c
             INNER JOIN ${TABLE_KANBAN_ITEMS} k ON k.id = c.kanbanItemId
             WHERE c.end >= ? AND c.cancelled = 0 AND c.resolvedAt IS NULL`,
        ).get(now) as { nextEnd: number | null };
        return row?.nextEnd ?? null;
    }

    resolveByKanbanItemId(kanbanItemId: number): void {
        this.db.prepare(
            `UPDATE ${TABLE_CALENDAR_MEETINGS} SET resolvedAt = ? WHERE kanbanItemId = ? AND resolvedAt IS NULL`,
        ).run(Date.now(), kanbanItemId);
    }

    private getTrackingRow(sourceKey: string): TrackingRow | undefined {
        return this.db.prepare(
            `SELECT sourceKey, kanbanItemId, cancelled, resolvedAt FROM ${TABLE_CALENDAR_MEETINGS} WHERE sourceKey = ?`,
        ).get(sourceKey) as TrackingRow | undefined;
    }

    private insertTracking(
        event: CalendarEvent,
        kanbanItemId: number | null,
        start: number,
        end: number,
        calendarDate: string,
        seenAt: number,
        resolvedAt: number | null,
    ): void {
        this.db.prepare(
            `INSERT INTO ${TABLE_CALENDAR_MEETINGS}
             (sourceKey, kanbanItemId, outlookTitle, organizer, start, end, calendarDate, cancelled, resolvedAt, lastSeenAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ).run(event.sourceKey, kanbanItemId, event.title, event.organizer ?? null, start, end,
            calendarDate, event.cancelled ? 1 : 0, resolvedAt, seenAt);
    }

    private markResolved(sourceKey: string, resolvedAt: number): void {
        this.db.prepare(
            `UPDATE ${TABLE_CALENDAR_MEETINGS} SET resolvedAt = ? WHERE sourceKey = ?`,
        ).run(resolvedAt, sourceKey);
    }

    private cardTitle(event: CalendarEvent): string {
        return `Teams meeting: ${event.title}`;
    }

    private cardDescription(event: CalendarEvent): string {
        const start = new Date(event.start);
        const end = new Date(event.end);
        return `Outlook meeting - ${this.time(start)}-${this.time(end)}`;
    }

    private time(value: Date): string {
        return `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`;
    }
}
