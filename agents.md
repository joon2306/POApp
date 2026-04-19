This project is a productivity tool to help optimise productivity for a Product Owner. 

It consists of 4 sections:
- Productivity which is a dashboard used to see some producitivity metrics such as overall productivity, in progress tasks and completed tasks
- a todo which is a kanban composed of pending, in progress and on hold tasks
- a pulse board which is a place to manage the current PI and its features based on sprint. When a feature is clicked we can see its user stories in the kanban composed of the sections: pending, inprogress and on hold. As compared to the todo kanban, we do not care about the planned time to complete the US but here we add an expected sprint completion. 
When d is clicked, it opens a kanban showing dependencies.
- a vault which is a place to store secrets and other important information

````
When working in this project, I want the work to be split into the following activities:
-> discuss the feature and ask questions to clear things out.
-> when clear, prepare a solution design clearing telling me which file will be modified and which will be added and very important to share all contract definitions for me to understand your design.
-> when I validate the design, proceed with implementation
-> I will review the implementation and comment to you.
````

Task i want to implement:

problem: 
the pulse board is not very strong and is lacking important features for it to be usable. 

I would like the following features to be added for it to be usable:
-> When modifying a user story, i would like the application to ask me the reason. The reason is to perform a retrospective later. When the user story is completed later than originally planned, again need to ask the reason. 
-> In the pulse board i want to see a section like a dashboard to see the relationship of the features to see if they are going on track, like a way to perform the retrospective very quickly.
-> today when user stories are deleted because they are completed, I can no longer see them. I will like the information saved in the database so that when I click on "C" when hovering over the feature in the pulse board I can see the completed user stories.

---

## Project Architecture & Context

### Tech Stack
- **Framework**: Nextron (Electron + Next.js) — a desktop app
- **Language**: TypeScript
- **Styling**: TailwindCSS 3
- **Database**: better-sqlite3 (local SQLite)
- **AI**: OpenAI SDK (for feature/email/jira generation helpers)
- **Testing**: Jest + React Testing Library
- **Package Manager**: npm
- **Build**: `nextron build` / `npm run dev`

### Project Structure

```
PO_APP/
├── main/                     # Electron main process (backend)
│   ├── background.ts         # App entry point, creates window & bootstraps handlers
│   ├── preload.ts            # Exposes IPC bridge to renderer via contextBridge
│   ├── database/
│   │   └── database.ts       # SQLite DB init, table creation, exports table names
│   ├── Handlers/             # IPC request handlers (one per domain)
│   │   ├── Handler.ts        # Interface: { execute(): void }
│   │   ├── TodoKanbanHandler.ts
│   │   ├── ProductivityHandler.ts
│   │   ├── VaultHandler.ts
│   │   ├── PiHandler.ts
│   │   ├── JiraHandler.ts
│   │   ├── CopyHandler.ts
│   │   ├── ExpiryHandler.ts
│   │   └── TokenHandler.ts
│   ├── factory/
│   │   ├── Provider.ts            # Interface: IProvider<T> { provide(): T }
│   │   ├── HandlerProvider.ts     # Singleton — instantiates all handlers, executes them
│   │   └── ServiceManagerProvider.ts  # Singleton — DI container for all services
│   ├── model/                # Backend data models
│   │   ├── JiraItem.ts       # JiraItem, JiraKey, PiRef, JIRA_STATUS, JIRA_TYPE
│   │   ├── KanbanItem.ts     # KanbanDbItem (id, title, description, priority, status, time, start, duration)
│   │   ├── KanbanCard.ts     # KanbanCard class (CSV import support)
│   │   ├── PiItem.ts         # PiItem (title, s1–s5, ip), PiResponse
│   │   ├── Productivity.ts   # Productivity, Task, CompletedTask
│   │   ├── ProductivityDbItem.ts
│   │   ├── VaultDbItem.ts
│   │   └── GenericResponse.ts  # { error: boolean, data: T }
│   ├── service/              # Service interfaces + implementations
│   │   ├── I*.ts             # Interfaces (IKanbanDbService, IJiraDbService, IPiDbService, etc.)
│   │   └── impl/             # Implementations
│   │       ├── CommsService.ts        # IPC listener registration via ipcMain.on
│   │       ├── KanbanDbService.ts     # CRUD for kanban_items table
│   │       ├── JiraDbService.ts       # CRUD for jira_items table
│   │       ├── PiDbService.ts         # CRUD for pi_items table
│   │       ├── ProductivityDbService.ts
│   │       ├── ProductivityService.ts
│   │       ├── VaultDbService.ts
│   │       ├── TimeTrackerService.ts
│   │       ├── ExeService.ts
│   │       ├── CsvReaderService.ts
│   │       └── TokenGeneratorServie.ts
│   ├── manager/
│   │   └── KanbanTimeManager.ts  # Manages time tracking for kanban cards (expiry, duration)
│   ├── helpers/
│   │   └── create-window.ts      # Electron window creation helper
│   └── utils/
│       ├── AiUtils.ts        # OpenAI API wrapper
│       ├── NumberUtils.ts
│       └── TimeUtils.ts
│
├── renderer/                 # Next.js frontend (renderer process)
│   ├── pages/
│   │   ├── _app.tsx          # App wrapper with GlobalUiProvider
│   │   ├── home.tsx          # Main page — renders Dashboard with 4 sections
│   │   └── next.tsx          # Placeholder/default page
│   ├── components/
│   │   ├── Dashboard.tsx     # Sidebar + content layout, renders active section
│   │   ├── Kanban.tsx        # Reusable Kanban board (used by Todo, UserStory, Dependency)
│   │   ├── Card.tsx          # Generic card component
│   │   ├── Button.tsx        # Reusable button with variants & icons
│   │   ├── Modal.tsx         # Global modal component
│   │   ├── Loading.tsx
│   │   ├── LabeledTextarea.tsx
│   │   ├── Form.tsx          # Generic form wrapper
│   │   ├── Form/             # Form sub-components (Input, DatePicker, KanbanForm, Select)
│   │   ├── PulseBoard/
│   │   │   ├── PulseBoard.tsx    # Feature cards grid with PI form, search, state-based colors
│   │   │   └── PulseRouter.tsx   # Routes: DEFAULT→PulseBoard, USER_STORY→Kanban, DEPENDENCY→Kanban
│   │   ├── Productivity/     # Productivity dashboard component
│   │   ├── Vault/            # Vault CRUD component
│   │   ├── ProgressBar/
│   │   ├── Tag/
│   │   ├── EmailGenerator/
│   │   ├── English/
│   │   ├── FeatureGenerator/
│   │   └── JiraGenerator/
│   ├── hooks/
│   │   ├── useKanban.ts      # Kanban state management (drag/drop, CRUD, load)
│   │   ├── useKanbanForm.ts  # Kanban form validation & state
│   │   ├── useKanbanCard.ts  # Card hover/delete interaction
│   │   ├── useDroppable.ts   # Drag-and-drop zone logic
│   │   ├── usePulse.ts       # PulseBoard state (pulses, PI, CRUD, search)
│   │   ├── usePulseForm.ts   # PI + Feature form validation
│   │   ├── useProductivity.ts
│   │   ├── useVault.ts
│   │   ├── useVaultForm.ts
│   │   ├── useJiraForm.ts
│   │   ├── useInsert.ts      # Keyboard shortcut: "Insert" key triggers callback
│   │   ├── useDelete.ts      # Keyboard shortcut: "Delete" key triggers callback
│   │   └── useKeyboard.ts    # Generic keyboard shortcut hook
│   ├── services/
│   │   ├── I*.ts             # Service interfaces
│   │   └── impl/
│   │       ├── CommsService.ts       # Renderer-side IPC: send via window.ipc.send, receive via window.ipc.on
│   │       ├── ToDoKanbanService.ts  # IKanbanService impl for Todo cards
│   │       ├── JiraKanbanService.ts  # IKanbanService impl for UserStory/Dependency cards
│   │       ├── PulseService.ts       # Feature CRUD, aggregates jiras into Pulse objects
│   │       ├── PiService.ts          # PI lifecycle (create/get/delete), sprint generation
│   │       ├── ModalService.ts       # Global modal open/close hook
│   │       ├── Mediator.ts           # Pub/sub event bus
│   │       └── ... (others for generators, vault, etc.)
│   ├── factory/
│   │   ├── KanbanFactory.ts  # Factory: creates ToDoKanbanService or JiraKanbanService
│   │   └── LoggerFactory.ts
│   ├── provider/
│   │   └── GlobalUiProvider.tsx  # React context for global modal management
│   ├── types/
│   │   ├── CommunicationEvent.ts  # All IPC event name constants
│   │   ├── KanbanTypes.ts         # KanbanCardType, KanbanFormValue, swim lane configs, priority configs
│   │   ├── FormTypes.ts           # InputType, SelectType
│   │   ├── ModalTypes.ts
│   │   ├── Pulse/Pulse.ts         # Pulse, State, StateColors, JIRA_STATUS, JIRA_TYPE, JiraServerResponse
│   │   ├── Feature/Feature.ts     # Feature, JiraTicket, JiraKey, JIRA_STATE, SPRINT_OPTIONS
│   │   └── Feature/Pi.ts          # PiTitle, Pi, PiResponse
│   ├── utils/
│   │   ├── PulseUtils.ts     # SprintMapper, StateMapper, SprintUtils, PulseUtils facade
│   │   ├── KanbanUtils.ts    # Card sorting, tag colors, planned time
│   │   ├── Validator.ts      # String validation builder
│   │   ├── ProgressUtils.ts
│   │   ├── LocalDate.ts
│   │   ├── LocalTime.ts
│   │   └── NumberUtils.ts
│   ├── constants/
│   │   └── MediatorEvents.ts  # GENERIC_KANBAN_ERROR, KANBAN_CARD_UPDATE
│   └── styles/               # CSS modules (globals, kanban, card, modal, etc.)
│
├── app/                      # Build output (compiled JS + static assets)
├── resources/                # Extra resources bundled with Electron build
├── package.json
├── tsconfig.json
├── jest.config.js
├── jest.main.config.js
├── tailwind.config.js
└── electron-builder.yml
```

### Database Schema (6 Tables)

| Table | Columns | Purpose |
|-------|---------|---------|
| `kanban_items` | id (PK), title, description, priority, status, time, start, duration | Todo kanban cards |
| `productivity_items` | id (PK), title, priority, status, time, deleted, duration, start | Completed/tracked tasks for productivity metrics |
| `vault_items` | title (PK), text1, text2, text3 | Secret/important information storage |
| `pi_items` | title (PK), s1, s2, s3, s4, s5, ip | Program Increment with 5 sprint + IP timestamps |
| `jira_items` | jiraKey (PK), title, target, status, type, piRef, featureRef | All Jira entities (features, user stories, dependencies) |
| `time_tracker_items` | date (PK) | Daily task expiry tracking |

### Key Patterns

1. **Singleton Pattern**: All handlers, services, and providers use module-level `let instance = null` singletons.
2. **IPC Communication**: Renderer calls `CommsService.sendRequest(event, ...args)` which sends `send-{event}` via IPC. Main process listens with `CommsService.getRequest(event, callback)` on `send-{event}`, processes, and replies on `received-{event}`.
3. **Factory/DI**: `ServiceManagerProvider` creates all service instances with the DB. `HandlerProvider` creates all handlers with their service dependencies.
4. **Kanban Reuse**: One `Kanban.tsx` component is used for Todo, UserStory, and Dependency views. `KanbanFactory` switches between `ToDoKanbanService` and `JiraKanbanService`.
5. **Jira Items as Universal Entity**: The `jira_items` table stores features (type=1), dependencies (type=2), and user stories (type=3). `PulseService.getAll()` fetches all jiras for a PI and aggregates them into `Pulse` objects per feature.
6. **State Machine for Features**: `PulseUtils.StateMapper` computes feature state: NORMAL → COMPLETED (all US done), BLOCKED (all US on hold), HAS_DEPENDENCIES, INCONSISTENT (behind schedule or inconsistent targets). State drives card color/styling.
7. **Sprint Model**: PI has 5 sprints (2 weeks each) + IP sprint. Active sprint is determined by comparing current date with sprint timestamps.
8. **Keyboard Shortcuts**: Hover + key combinations: "Insert" to modify, "Delete" to remove, "d" to view dependencies.
9. **GenericResponse Pattern**: All DB operations return `{ error: boolean, data: T }`.
10. **Global Modal**: `GlobalUiProvider` + `useModalService()` manages a single global modal for confirmations, forms, and errors.

### IPC Events (CommunicationEvents.ts)

| Event | Purpose |
|-------|---------|
| `todo-cards` / `save-todo-card` / `delete-todo-card` / `modify-todo-card` | Todo Kanban CRUD |
| `getProductivity` | Fetch productivity metrics |
| `getVaultItems` / `saveVaultItem` / `deleteVaultItem` / `modifyVaultItem` | Vault CRUD |
| `createPi` / `deletePi` / `getPi` | PI lifecycle |
| `createJira` / `modifyJira` / `deleteJira` / `getJiraByPi` / `getJiraByFeature` / `completeJira` | Jira/Feature/US/Dependency CRUD |
| `copy` / `generateToken` | Utility operations |
| `generate-feature` / `refine-feature` / `summary-feature` / `export-feature` | AI feature generation |
| `translate-email` / `generate-jira` / `improve-english` | AI helpers |

### How the Pulse Board Works

1. **PI Management**: User creates a PI (e.g., "SL25.2") with a start date. System auto-generates 5 × 2-week sprints + IP.
2. **Features**: Added as jira items (type=FEATURE). Shown as cards on the PulseBoard grid.
3. **User Stories & Dependencies**: Clicking a feature navigates to a sub-kanban (via PulseRouter). US/deps are jira items linked via `featureRef`.
4. **Progress Tracking**: Each feature card shows a progress bar (completed stories / total stories).
5. **State Visualization**: Feature cards use color-coded states based on StateMapper logic.
6. **Search**: Filters features by key, title, or sprint target.
7. **Completion Flow**: When a US is "deleted" from the kanban, it's set to `COMPLETED` status (status=4) in `jira_items` via `completeJira` event (calls `JiraDbService.setIncomplete` — misleading name, actually sets to COMPLETED). Completed stories appear in `PulseService.getAll()` as `completedStories` array on the Feature.

````
implementation plan to solve problem about pulse board described above:

PulseBoard Enhancements — Solution Design
Three features to make the PulseBoard usable: (1) reason tracking on US modifications, (2) a retrospective dashboard, and (3) a view for completed user stories.

Feature 1: Modification Reason Tracking
Triggers that require a reason
Trigger	Condition	Type
Sprint target change	US is modified and 
target
 value changed	TARGET_CHANGE
Blocked	US is dragged to On Hold (status 3)	BLOCKED
Late completion	US is completed (deleted) and activeSprint > target	LATE_COMPLETION
Backend Changes
[NEW] 
ModificationReason.ts
typescript
export type ModificationReasonType = 'TARGET_CHANGE' | 'BLOCKED' | 'LATE_COMPLETION';
export type ModificationReasonCategory =
  | 'SCOPE_CHANGE'
  | 'DEPENDENCY_BLOCKED'
  | 'UNDERESTIMATED'
  | 'RESOURCE_ISSUE'
  | 'REQUIREMENT_CHANGE'
  | 'OTHER';
export type ModificationReasonItem = {
  id?: number;
  jiraKey: string;
  reason: string;
  category?: ModificationReasonCategory;
  type: ModificationReasonType;
  previousValue?: string;
  newValue?: string;
  activeSprint?: string;
  timestamp: number;
  piRef: string;
}
[MODIFY] 
database.ts
Add new table constant + creation:

typescript
const TABLE_MODIFICATION_REASONS = "modification_reasons";
// Inside createTables():
const createModificationReasonsTbl = db.prepare(
  `CREATE TABLE IF NOT EXISTS ${TABLE_MODIFICATION_REASONS} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jiraKey TEXT NOT NULL,
    reason TEXT NOT NULL,
    category TEXT,
    type TEXT NOT NULL,
    previousValue TEXT,
    newValue TEXT,
    activeSprint TEXT,
    timestamp INTEGER NOT NULL,
    piRef TEXT NOT NULL
  )`
);
createModificationReasonsTbl.run();
// Export:
export { ..., TABLE_MODIFICATION_REASONS };
[NEW] 
IModificationReasonDbService.ts
typescript
import GenericResponse from "../model/GenericResponse";
import { ModificationReasonItem } from "../model/ModificationReason";
export default interface IModificationReasonDbService {
  create(item: ModificationReasonItem): GenericResponse<string>;
  getByPiRef(piRef: string): GenericResponse<ModificationReasonItem[]>;
}
[NEW] 
ModificationReasonDbService.ts
Singleton service implementing IModificationReasonDbService. Uses better-sqlite3 with TABLE_MODIFICATION_REASONS. Follows the same 
GenericResponse
 pattern as existing services.

[NEW] 
ModificationReasonHandler.ts
New handler implementing 
Handler
. Registers two IPC listeners:

saveModificationReason → calls 
create()
getModificationReasonsByPi → calls 
getByPiRef()
[MODIFY] 
ServiceManagerProvider.ts
Add modificationReasonDbService: IModificationReasonDbService to the 
ServiceManagerProviderType
 and instantiate ModificationReasonDbService in 
provide()
.

[MODIFY] 
HandlerProvider.ts
Instantiate ModificationReasonHandler with the new service and add it to the handlers array.

Frontend Changes
[MODIFY] 
CommunicationEvent.ts
Add two new events:

typescript
saveModificationReason: "saveModificationReason",
getModificationReasonsByPi: "getModificationReasonsByPi",
[NEW] 
ModificationReason.ts
typescript
export type ModificationReasonType = 'TARGET_CHANGE' | 'BLOCKED' | 'LATE_COMPLETION';
export type ModificationReasonCategory =
  | 'SCOPE_CHANGE'
  | 'DEPENDENCY_BLOCKED'
  | 'UNDERESTIMATED'
  | 'RESOURCE_ISSUE'
  | 'REQUIREMENT_CHANGE'
  | 'OTHER';
export const REASON_CATEGORIES = [
  { value: 'SCOPE_CHANGE', label: 'Scope Change' },
  { value: 'DEPENDENCY_BLOCKED', label: 'Dependency Took Too Long' },
  { value: 'UNDERESTIMATED', label: 'Underestimated Complexity' },
  { value: 'RESOURCE_ISSUE', label: 'Resource Issue' },
  { value: 'REQUIREMENT_CHANGE', label: 'Requirement Change' },
  { value: 'OTHER', label: 'Other' },
];
export type ModificationReason = {
  jiraKey: string;
  reason: string;
  category?: ModificationReasonCategory;
  type: ModificationReasonType;
  previousValue?: string;
  newValue?: string;
  activeSprint?: string;
  piRef: string;
}
[NEW] 
IModificationReasonService.ts
typescript
import { ModificationReason } from "../types/ModificationReason";
export default interface IModificationReasonService {
  save(reason: ModificationReason): void;
  getByPiRef(piRef: string): Promise<ModificationReason[]>;
}
[NEW] 
ModificationReasonService.ts
Singleton service using 
CommsService
 to send/receive via the two new IPC events.

[NEW] 
ReasonModal.tsx
A reusable React component rendered inside the global modal. Contains:

A title describing why the reason is being asked (e.g., "Why is the sprint target changing?")
A textarea for free-text reason (required)
A dropdown for optional category (from REASON_CATEGORIES)
Internal state management, calls onConfirm(reason, category) callback on submit
typescript
type ReasonModalProps = {
  title: string;
  onConfirm: (reason: string, category?: ModificationReasonCategory) => void;
}
[MODIFY] 
Kanban.tsx
Three interception points (only when type === "USER_STORY"):

1. Sprint target change on modify: In 
KanbanCard
, the 
handleSave
 callback compares kanbanFormValue.target (old) with the new 
target
. If different, instead of calling 
modifyCard
 directly, it opens a ReasonModal via modalService. On confirm, it saves the reason via ModificationReasonService then calls 
modifyCard
.

2. Drop to On Hold: In useKanban.handleDrop, when status === 3 and current type is USER_STORY, the drop needs to trigger a reason modal. Since 
useKanban
 doesn't have modal access, we'll lift the On Hold interception into 
Kanban.tsx
 by passing a wrapped 
handleDrop
 to the swim lanes. The wrapper checks if the target status is On Hold, shows ReasonModal, and on confirm saves reason + proceeds.

3. Late completion: In 
KanbanCard
, the existing delete flow (via useKanbanCard → hover + Delete key) will be enhanced. When type === "USER_STORY", before calling 
deleteCard
, we check if activeSprint > card.target (using selectedFeature.activeSprint and 
SprintMapper
). If late, show ReasonModal. On confirm, save reason + call 
deleteCard
.

[MODIFY] 
useKanban.ts
Modify 
handleDrop
 to accept an optional callback parameter so that 
Kanban.tsx
 can intercept and inject the reason modal before proceeding. Alternatively, expose activeCard state and the raw drop logic so the component can wrap it.

Feature 2: Retrospective Dashboard
Frontend Changes
[NEW] 
PulseDashboard.tsx
A dashboard section rendered below the feature cards grid in 
PulseBoard.tsx
 → 
Body
 component.

IMPORTANT

The dashboard receives the full unfiltered pulses array — the search filter must NOT affect this section.

Displays:

Feature Health Summary: counts of features by state (On Track / Completed / Behind Schedule / Blocked)
Late Completions: count of late-completed US + list of recent reasons
Sprint Progress: simple table/bar showing US completed vs total per sprint
Props:

typescript
type PulseDashboardProps = {
  pulses: Pulse[];          // always the full unfiltered list
  activeSprint: Sprint;
  piTitle: string;
}
Health summary data is derived from already-available pulses array (state is already computed). Late completion data requires fetching modification reasons via ModificationReasonService.getByPiRef().

[MODIFY] 
PulseBoard.tsx
Add <PulseDashboard> at the end of the 
Body
 component, after the feature cards grid. Only rendered when piTitle exists. Crucially, the component receives all pulses (not the search-filtered subset). The 
Body
 component will maintain a separate allPulses state alongside the search-filtered pulses.

Feature 3: View Completed User Stories
Type Changes
[MODIFY] 
Feature.ts
Add a new type and change completedStories:

typescript
export type CompletedStory = {
  jiraKey: JiraKey;
  title: string;
  target: target;
}
export type Feature = {
  title: string;
  target: target;
  featureKey: JiraKey;
  userStories: Array<JiraTicket>;
  dependencies: Array<JiraTicket>;
  completedStories: Array<CompletedStory>;  // Changed from Array<JiraKey>
}
Service Changes
[MODIFY] 
PulseService.ts
In 
getAll()
, change the completedStories mapping from:

typescript
completedStories: userStories
  .filter(s => s.status === JIRA_STATUS.COMPLETED && s.featureRef === feature.jiraKey)
  .map(s => s.jiraKey)
to:

typescript
completedStories: userStories
  .filter(s => s.status === JIRA_STATUS.COMPLETED && s.featureRef === feature.jiraKey)
  .map(s => ({ jiraKey: s.jiraKey, title: s.title, target: s.target }))
Routing & Component Changes
[MODIFY] 
PulseRouter.tsx
Add a new route for completed stories:

typescript
export const ROUTES = {
    DEFAULT: 0,
    USER_STORY: 1,
    DEPENDENCY: 2,
    COMPLETED_STORIES: 3   // NEW
}
Add routing case:

typescript
{route === ROUTES.COMPLETED_STORIES &&
  <CompletedStories selectedFeature={selectedFeature} />}
[NEW] 
CompletedStories.tsx
A full-screen list/table view (not a kanban, not a modal) showing all completed user stories for a feature. Navigated to via 
PulseRouter
 when "c" is pressed.

Props:

typescript
type CompletedStoriesProps = {
  selectedFeature: SelectedFeature;
}
Fetches completed stories via CommsService.sendRequest(getJiraByFeature, USER_STORY, featureRef) and filters for status COMPLETED. Displays a styled table with columns: Jira Key, Title, Target Sprint.

[MODIFY] 
PulseBoard.tsx
In 
PulseCard
, add a useKeyboard hook for "c" key that navigates to the completed stories route:

typescript
useKeyboard({
  isHovered,
  callback: () => changeRoute(ROUTES.COMPLETED_STORIES),
  keyInput: "c"
});
[MODIFY] 
PulseUtils.ts
 (minor)
No actual code change needed — pulse.completedStories.length still works with CompletedStory[] instead of JiraKey[]. Noting for awareness.

Summary of All File Changes
Action	File	Feature
NEW	main/model/ModificationReason.ts	F1
MODIFY	
main/database/database.ts
F1
NEW	main/service/IModificationReasonDbService.ts	F1
NEW	main/service/impl/ModificationReasonDbService.ts	F1
NEW	main/Handlers/ModificationReasonHandler.ts	F1
MODIFY	
main/factory/ServiceManagerProvider.ts
F1
MODIFY	
main/factory/HandlerProvider.ts
F1
MODIFY	
renderer/types/CommunicationEvent.ts
F1
NEW	renderer/types/ModificationReason.ts	F1
NEW	renderer/services/IModificationReasonService.ts	F1
NEW	renderer/services/impl/ModificationReasonService.ts	F1
NEW	renderer/components/ReasonModal.tsx	F1
MODIFY	
renderer/components/Kanban.tsx
F1
MODIFY	
renderer/hooks/useKanban.ts
F1
NEW	renderer/components/PulseBoard/PulseDashboard.tsx	F2
MODIFY	
renderer/components/PulseBoard/PulseBoard.tsx
F2, F3
MODIFY	
renderer/types/Feature/Feature.ts
F3
MODIFY	
renderer/services/impl/PulseService.ts
F3
MODIFY	
renderer/components/PulseBoard/PulseRouter.tsx
F3
NEW	renderer/components/PulseBoard/CompletedStories.tsx	F3
Verification Plan
Manual Testing
Since this is an Electron desktop app with no existing tests for these areas, manual testing via npm run dev is the primary verification method.

Pre-condition: Run npm run dev to start the app. Create or use an existing PI with features and user stories.

Feature 1 — Reason tracking
Open a feature's US kanban. Create a US with target Sprint 1.
Sprint target change: Double-click the US → change target to Sprint 3 → on submit, a reason modal should appear asking "Why is the sprint target changing?". Enter a reason + select a category → confirm. Verify the US target updates and no errors in console.
Block (On Hold): Drag the US to On Hold → a reason modal should appear asking "Why is this user story being blocked?". Enter reason → confirm. Verify card moves to On Hold.
Late completion: Ensure the active sprint is beyond the US's target sprint (e.g., active Sprint 3, US target Sprint 1). Delete the US → a reason modal should appear asking "Why was this user story completed late?". Enter reason → confirm. Verify the US is completed.
Feature 2 — Retrospective Dashboard
On the PulseBoard, ensure a PI is active with features. Below the feature cards grid, a dashboard section should appear.
Verify it shows counts: features on track, behind schedule, blocked, completed.
Add some modification reasons (from Feature 1 testing). Verify late completions count updates.
Feature 3 — Completed User Stories
Complete a few user stories (delete them from kanban).
Go back to PulseBoard. Hover over the feature card and press "C".
The app should navigate to a full-screen list view showing completed stories with their Jira key, title, and original target sprint (not a modal, not a kanban — a dedicated routed view).
Feature 4 - Blocked reasons
While reasons for late completion are captured, reasons for blocked reasons should also be captured. We need to add a new section beloe late completions in retrospective dashboard to track blocked reasons. Blocked reasons need to be tracked for dependencies as well. So need to modify for dependency kanban to add blocked reason when a ticket is blocked. When a dependency is completed it shall be added to completed user stories as well but has a label in completed board (press C on a feature) to differentiate between dependency and user story. if a user story or dependency has completed, its blocked reason should be added to the completed board as well.