# Implementation Plan — Feature 4: Blocked Reasons & Completed Dependencies

## Summary of Requirements

1. **Blocked Reasons in Retrospective Dashboard** — New section below Late Completions showing all `BLOCKED` reasons for the current PI.
2. **Blocked Reasons for Dependencies** — Extend the blocked-reason capture (currently user stories only) to the dependency kanban.
3. **Completed Dependencies in Completed Board** — When "C" is pressed on a feature, show both completed user stories AND completed dependencies, with a type label to differentiate.
4. **Blocked Reasons on Completed Board** — For each completed item (US or dependency), show its blocked reason if one was recorded.

---

## Files Changed

| Action | File | Purpose |
|--------|------|---------|
| MODIFY | `renderer/components/Kanban.tsx` | Extend blocked-reason capture to dependencies |
| MODIFY | `renderer/components/PulseBoard/PulseDashboard.tsx` | Add `BlockedReasons` section; lift reason fetch to parent |
| MODIFY | `renderer/components/PulseBoard/CompletedStories.tsx` | Show deps + type labels + blocked reasons per row |

No new files. No new IPC events. No database schema changes.

---

## Detailed Design

### 1. `renderer/components/Kanban.tsx`

**What changes:** `wrappedHandleDrop` currently only intercepts drops to On Hold for `isUserStory`. Extend to also intercept for `isDependency`.

**Add after line 123:**
```typescript
const isDependency = type === "DEPENDENCY";
```

**Modify `wrappedHandleDrop` condition** (currently `if (isUserStory && +status === 3)`) to:
```typescript
if ((isUserStory || isDependency) && +status === 3) {
```

**Update the modal message** to use a dynamic label:
```typescript
const itemLabel = isUserStory ? "user story" : "dependency";
const modal = getReasonModal(
    `Why is this ${itemLabel} being blocked?`,
    modalService,
    onConfirm
);
```

No change to `wrappedDeleteCard` — late completion capture stays user-story-only (requirement does not mention late completion for dependencies).

---

### 2. `renderer/components/PulseBoard/PulseDashboard.tsx`

**What changes:**

**a) Lift reason fetching to the parent `PulseDashboard` component.**

Currently `LateCompletions` fetches its own reasons. To avoid a second identical IPC call for `BlockedReasons`, move the fetch to `PulseDashboard` and pass filtered arrays as props.

New signature for `PulseDashboard`:
```typescript
// No prop changes — same PulseDashboardProps
export default function PulseDashboard({ pulses, activeSprint, piTitle }: PulseDashboardProps)
```

Add state at the top of `PulseDashboard`:
```typescript
const [allReasons, setAllReasons] = useState<ModificationReason[]>([]);

useEffect(() => {
    if (!piTitle) return;
    const service = new ModificationReasonService();
    service.getByPiRef(piTitle).then(setAllReasons);
}, [piTitle]);
```

Render section changes (pass filtered arrays instead of `piTitle`):
```typescript
<LateCompletions reasons={allReasons.filter(r => r.type === "LATE_COMPLETION")} />
<BlockedReasons  reasons={allReasons.filter(r => r.type === "BLOCKED")} />
```

**b) Refactor `LateCompletions`** — change its props from `{ piTitle: string }` to `{ reasons: ModificationReason[] }`. Remove internal `useEffect`/`useState` for fetching. Receives pre-filtered array, renders the same table.

**c) Add new `BlockedReasons` sub-component** — same table structure as `LateCompletions`, different columns:

```typescript
type BlockedReasonsProps = { reasons: ModificationReason[] }

function BlockedReasons({ reasons }: BlockedReasonsProps) {
    // heading: "Blocked Reasons"
    // subtitle: "{count} blocked item{s} recorded"
    // table columns: Jira Key | Reason | Category | Sprint When Blocked | Date
    //   - "Sprint When Blocked" = r.activeSprint ?? "—"
    //   - category uses same CATEGORY_LABELS map
    //   - date uses same formatDate helper
}
```

**Placement in render:** After `<LateCompletions>`, before closing `</div>`.

---

### 3. `renderer/components/PulseBoard/CompletedStories.tsx`

**What changes:**

**a) Update `CompletedStoryRow` type:**
```typescript
type CompletedStoryRow = {
    jiraKey: string;
    title: string;
    target: number;
    itemType: 'USER_STORY' | 'DEPENDENCY';
    blockedReason?: string;
    blockedCategory?: string;
}
```

**b) Add `ModificationReasonService` import and instantiate it alongside `CommsService`.**

**c) Extend `useEffect` to fetch in parallel:**
```typescript
useEffect(() => {
    const fetch = async () => {
        const service = new ModificationReasonService();

        const [usRes, depRes, reasons] = await Promise.all([
            commsService.sendRequest<GenericResponse<JiraServerResponse[]>>(
                CommunicationEvents.getJiraByFeature, JIRA_TYPE.USER_STORY, selectedFeature.featureRef
            ),
            commsService.sendRequest<GenericResponse<JiraServerResponse[]>>(
                CommunicationEvents.getJiraByFeature, JIRA_TYPE.DEPENDENCY, selectedFeature.featureRef
            ),
            service.getByPiRef(selectedFeature.piRef)
        ]);

        // Build lookup: jiraKey → most recent BLOCKED reason
        const blockedMap: Record<string, ModificationReason> = {};
        reasons
            .filter(r => r.type === 'BLOCKED')
            .forEach(r => { blockedMap[r.jiraKey] = r; });

        const mapItem = (item: JiraServerResponse, itemType: 'USER_STORY' | 'DEPENDENCY'): CompletedStoryRow => ({
            jiraKey: item.jiraKey,
            title: item.title,
            target: item.target,
            itemType,
            blockedReason: blockedMap[item.jiraKey]?.reason,
            blockedCategory: blockedMap[item.jiraKey]?.category,
        });

        const rows: CompletedStoryRow[] = [
            ...(!usRes.error && usRes.data
                ? usRes.data.filter(i => i.status === JIRA_STATUS.COMPLETED).map(i => mapItem(i, 'USER_STORY'))
                : []),
            ...(!depRes.error && depRes.data
                ? depRes.data.filter(i => i.status === JIRA_STATUS.COMPLETED).map(i => mapItem(i, 'DEPENDENCY'))
                : []),
        ];
        setStories(rows);
    };
    fetch();
}, [selectedFeature.featureRef, selectedFeature.piRef]);
```

**d) Update the table to add two new columns:**

| Column | Value |
|--------|-------|
| Type | Badge: "User Story" (blue-100/blue-700) or "Dependency" (orange-100/orange-700) |
| Blocked Reason | Reason text if `blockedReason` exists, else `—` (truncated `max-w-xs`) |

**e) Update heading** from "Completed User Stories" to "Completed Items".

**f) Update footer count** from "stories" to "items".

---

## Contracts

### `LateCompletions` prop type (after refactor)
```typescript
type LateCompletionsProps = { reasons: ModificationReason[] }
```

### `BlockedReasons` prop type (new)
```typescript
type BlockedReasonsProps = { reasons: ModificationReason[] }
```

### `CompletedStoryRow` type (updated)
```typescript
type CompletedStoryRow = {
    jiraKey: string;
    title: string;
    target: number;
    itemType: 'USER_STORY' | 'DEPENDENCY';
    blockedReason?: string;
    blockedCategory?: string;
}
```

---

## Notes & Decisions

- **No DB schema change**: `ticketType` is not added to `modification_reasons`. In the dashboard's `BlockedReasons` table, the `jiraKey` is sufficient to identify the item. In the completed board, type is derived directly from `jira_items` data (fetched by `JIRA_TYPE`).
- **Multiple blocked reasons per item**: If a jira key has multiple BLOCKED records, only the most recent one is shown on the completed board (last in the filtered array after `forEach` override). This is a simplification — we can discuss adding an expansion row if needed.
- **Dependency late completion**: Out of scope per requirements. `wrappedDeleteCard` is not modified for dependencies.
- **`selectedFeature.piRef` availability**: `SelectedFeature` already exposes `piRef`, so `CompletedStories` can pass it to `ModificationReasonService.getByPiRef()` without any upstream changes.

---

## Manual Test Plan

### Pre-condition
`npm run dev`. Use a PI with features that have both user stories and dependencies.

### Blocked reason on dependency
1. Open a feature → switch to dependency view.
2. Drag a dependency to "On Hold" → a reason modal should appear ("Why is this dependency being blocked?").
3. Enter reason + category → confirm. Dependency moves to On Hold.

### Blocked reasons in dashboard
4. Return to PulseBoard. Scroll to Retrospective Dashboard.
5. A new "Blocked Reasons" section should appear below "Late Completions".
6. Verify the blocked reason from step 3 is listed with the correct jiraKey, category, sprint, and date.

### Completed dependencies in completed board
7. Complete (delete) a dependency from the dependency kanban.
8. Press "C" on the feature card → navigate to completed board.
9. The table heading says "Completed Items". The completed dependency appears with an orange "Dependency" badge in the Type column.
10. Previously completed user stories appear with a blue "User Story" badge.
11. Any item that was previously blocked (before completion) shows its blocked reason in the "Blocked Reason" column. Items without a blocked reason show "—".
