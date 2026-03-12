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

