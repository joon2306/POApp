import { createHash } from "crypto";
import http from "http";
import CDP from "chrome-remote-interface";
import IOutlookCalendarService, { CalendarEvent, CalendarReadResult } from "../IOutlookCalendarService";
import { parseOwaEvent, toLocalDateKey } from "../../utils/parseOwaEvent";

const DEBUG_HOST = "127.0.0.1";
const DEBUG_PORT = 9222;
const RENDER_TIMEOUT_MS = 20_000;
const RENDER_POLL_MS = 500;
type ScrapedTile = { label: string; stableId?: string };

export default class OutlookCalendarService implements IOutlookCalendarService {
    async getToday(): Promise<CalendarReadResult> {
        return this.getForDate(new Date());
    }

    async getForDate(date: Date | string): Promise<CalendarReadResult> {
        const fetchedAt = new Date().toISOString();
        const requestedDate = this.parseRequestedDate(date);
        if (!requestedDate) return this.failure(fetchedAt, "The requested calendar date is invalid.");

        let client: any = null;
        let targetId: string | null = null;
        try {
            if (!(await this.isDebugPortReachable())) {
                return this.failure(fetchedAt, "Chrome debug port 9222 is not reachable.");
            }
            const dateKey = toLocalDateKey(requestedDate);
            const calendarUrl = `https://outlook.cloud.microsoft/calendar/view/day/${dateKey}`;
            const target = await CDP.New({ host: DEBUG_HOST, port: DEBUG_PORT, url: calendarUrl });
            targetId = target.id;
            client = await CDP({ host: DEBUG_HOST, port: DEBUG_PORT, target: targetId });

            const { Page, Runtime } = client;
            await Page.enable();
            await Runtime.enable();
            await Page.navigate({ url: calendarUrl });
            const state = await this.waitForCalendar(Runtime);
            if (state.signedOut) {
                return this.failure(fetchedAt, "Outlook is signed out. Complete authentication in the Chrome window.");
            }
            if (!state.ready) return this.failure(fetchedAt, "The calendar did not finish rendering.");
            return { error: false, fetchedAt, events: this.toCalendarEvents(state.tiles, dateKey) };
        } catch (error: any) {
            return this.failure(fetchedAt, `Unexpected error: ${error?.message ?? String(error)}.`);
        } finally {
            try { await client?.close(); } catch { /* best-effort cleanup */ }
            if (targetId) {
                try { await CDP.Close({ host: DEBUG_HOST, port: DEBUG_PORT, id: targetId }); }
                catch { /* best-effort cleanup */ }
            }
        }
    }

    private parseRequestedDate(value: Date | string): Date | null {
        if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
        if (!match) return null;
        const parsed = new Date(+match[1], +match[2] - 1, +match[3]);
        return toLocalDateKey(parsed) === value ? parsed : null;
    }

    private async waitForCalendar(Runtime: any): Promise<{ ready: boolean; signedOut: boolean; tiles: ScrapedTile[] }> {
        const deadline = Date.now() + RENDER_TIMEOUT_MS;
        while (Date.now() < deadline) {
            const state = await this.evaluate(Runtime, this.scrapeExpression());
            if (state.signedOut || state.ready) return state;
            await new Promise(resolve => setTimeout(resolve, RENDER_POLL_MS));
        }
        return { ready: false, signedOut: false, tiles: [] };
    }

    private scrapeExpression(): string {
        return `(() => {
            const href = location.href;
            const signedOut = /login\\.microsoftonline\\.com|login\\.live\\.com/i.test(href);
            const calendarPage = /outlook\\.(?:office\\.com|cloud\\.microsoft)\\/calendar/i.test(href);
            const appReady = document.readyState === 'complete' && !!document.body &&
                (!!document.querySelector('[role="main"]') || !!document.querySelector('[aria-label*="Calendar"]'));
            const attributes = ['data-item-id', 'data-calitemid', 'data-itemid', 'data-convid', 'data-event-id'];
            const tiles = [];
            document.querySelectorAll('[role="button"][aria-label]').forEach(element => {
                const label = element.getAttribute('aria-label') || '';
                if (!/\\d{1,2}:\\d{2}\\s+to\\s+\\d{1,2}:\\d{2}/i.test(label)) return;
                let node = element;
                let stableId = '';
                for (let depth = 0; node && depth < 5 && !stableId; depth++, node = node.parentElement) {
                    for (const attribute of attributes) {
                        const value = node.getAttribute && node.getAttribute(attribute);
                        if (value) { stableId = value; break; }
                    }
                    if (!stableId && node.getAttribute) {
                        const link = node.getAttribute('href');
                        if (link && /calendar|item|event/i.test(link)) stableId = link;
                    }
                }
                tiles.push({ label, stableId: stableId || undefined });
            });
            return { ready: calendarPage && appReady, signedOut, tiles };
        })()`;
    }

    private async evaluate(Runtime: any, expression: string): Promise<any> {
        const response = await Runtime.evaluate({ expression, returnByValue: true, awaitPromise: true });
        if (response.exceptionDetails) throw new Error(response.exceptionDetails.text || "Outlook DOM evaluation failed");
        return response.result?.value ?? {};
    }

    private toCalendarEvents(tiles: ScrapedTile[], requestedDateKey: string): CalendarEvent[] {
        const parsed = tiles
            .map(tile => ({ tile, event: parseOwaEvent(tile.label) }))
            .filter(item => item.event && toLocalDateKey(new Date(item.event.start)) === requestedDateKey)
            .sort((left, right) => left.event.start.localeCompare(right.event.start));
        const occurrences = new Map<string, number>();
        const unique = new Map<string, CalendarEvent>();
        for (const { tile, event } of parsed) {
            const group = `${this.normalize(event.title)}|${this.normalize(event.organizer ?? "")}|${requestedDateKey}`;
            const occurrence = (occurrences.get(group) ?? 0) + 1;
            occurrences.set(group, occurrence);
            const sourceKey = tile.stableId
                ? `outlook:${this.hash(tile.stableId)}`
                : `fallback:${this.hash(`${group}|${occurrence}`)}`;
            unique.set(sourceKey, { sourceKey, ...event });
        }
        return Array.from(unique.values()).sort((left, right) => left.start.localeCompare(right.start));
    }

    private normalize(value: string): string {
        return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
    }

    private hash(value: string): string {
        return createHash("sha256").update(value).digest("hex");
    }

    private isDebugPortReachable(): Promise<boolean> {
        return new Promise(resolve => {
            const request = http.get(
                { host: DEBUG_HOST, port: DEBUG_PORT, path: "/json/version", timeout: 2_000 },
                response => { response.resume(); resolve(response.statusCode === 200); },
            );
            request.on("error", () => resolve(false));
            request.on("timeout", () => { request.destroy(); resolve(false); });
        });
    }

    private failure(fetchedAt: string, reason: string): CalendarReadResult {
        return { error: true, fetchedAt, message: `Cannot access Outlook: ${reason}` };
    }
}
