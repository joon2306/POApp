import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Kanban from '../../components/Kanban';
import { GlobalUiProvider } from '../../provider/GlobalUiProvider';
import { KanbanCardType } from '../../types/KanbanTypes';

// ─── Service mock ────────────────────────────────────────────────────────────
// The Todo Kanban is backed by ToDoKanbanService (IPC to the main process).
// We stub it so the component can be exercised purely in the renderer.

const mockGetKanbanCards = jest.fn();
const mockModifyKanbanCard = jest.fn();

jest.mock('../../services/impl/ToDoKanbanService', () => {
    return {
        ToDoKanbanService: jest.fn().mockImplementation(() => ({
            getKanbanCards: mockGetKanbanCards,
            modifyKanbanCard: mockModifyKanbanCard,
            deleteKanbanCards: jest.fn(),
            addKanbanCard: jest.fn(),
        })),
    };
});

// ─── Test data ────────────────────────────────────────────────────────────────
// All three cards are Pending (status 1) and Critical priority (4).
// They are returned out of order and with distinct durations so the
// "shortest time first" default can be distinguished from insertion order.

// NOTE: `order` is not yet part of KanbanCardType — persisting a manual
// drag-and-drop order to the DB requires adding it. Widened here so the
// forthcoming-feature tests below can express the expected shape.
const makeCard = (overrides: Partial<KanbanCardType> & { order?: number }): KanbanCardType => ({
    id: '1',
    title: 'Untitled',
    description: 'desc',
    priority: 4,
    status: 1,
    time: 10,
    target: 0,
    ...overrides,
});

const criticalPendingCards: KanbanCardType[] = [
    makeCard({ id: '1', title: 'Longest Task', time: 90 }),
    makeCard({ id: '2', title: 'Shortest Task', time: 15 }),
    makeCard({ id: '3', title: 'Middle Task', time: 45 }),
];

const renderTodoKanban = () =>
    render(
        <GlobalUiProvider>
            <Kanban calculateHeight={() => 0} type="TODO" />
        </GlobalUiProvider>
    );

// Reads the visible order of card titles inside the Pending swim lane.
const getPendingCardTitles = () => {
    const pendingHeader = screen.getByText('Pending');
    const swimLane = pendingHeader.closest('.flex.flex-col') as HTMLElement;
    return within(swimLane)
        .getAllByText('Title')
        .map((label) => label.nextElementSibling?.textContent);
};

const dragCard = (sourceTitle: string, targetTitle: string) => {
    const source = screen.getByText(sourceTitle).closest('[draggable="true"]') as HTMLElement;
    const target = screen.getByText(targetTitle).closest('[draggable="true"]') as HTMLElement;

    const dataTransfer = { data: {}, setData(k: string, v: string) { this.data[k] = v; }, getData(k: string) { return this.data[k]; } };

    fireEvent.dragStart(source, { dataTransfer });
    fireEvent.dragEnter(target, { dataTransfer });
    fireEvent.dragOver(target, { dataTransfer });
    fireEvent.drop(target, { dataTransfer });
    fireEvent.dragEnd(source, { dataTransfer });
};

beforeEach(() => {
    mockGetKanbanCards.mockResolvedValue(criticalPendingCards.map((c) => ({ ...c })));
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('Todo Kanban — Pending / Critical ordering', () => {

    // Given the Todo menu is opened
    // When the Kanban loads and displays pending items with critical priority
    // Then, if the user has not manually sorted them, they default to
    // shortest-time-first ordering.
    it('defaults to sorting pending critical items by shortest time first', async () => {
        renderTodoKanban();

        await waitFor(() => {
            expect(screen.getByText('Shortest Task')).toBeInTheDocument();
        });

        expect(getPendingCardTitles()).toEqual([
            'Shortest Task',
            'Middle Task',
            'Longest Task',
        ]);
    });

    // Given pending critical items are displayed in their default (shortest-time) order
    // When the user drags a card to a new position within the Pending lane
    // Then the cards are reordered to reflect the order of execution the user defined,
    // overriding the default shortest-time sort.
    it('lets the user reorder pending critical items via drag and drop', async () => {
        renderTodoKanban();

        await waitFor(() => {
            expect(screen.getByText('Shortest Task')).toBeInTheDocument();
        });

        expect(getPendingCardTitles()).toEqual([
            'Shortest Task',
            'Middle Task',
            'Longest Task',
        ]);

        // User decides "Longest Task" should actually run first, ahead of "Shortest Task".
        dragCard('Longest Task', 'Shortest Task');

        await waitFor(() => {
            expect(getPendingCardTitles()).toEqual([
                'Longest Task',
                'Shortest Task',
                'Middle Task',
            ]);
        });
    });

    // Given pending critical items are displayed
    // When one of them is changed from Critical to High priority
    // Then it drops out of the manual/critical ordering and automatically
    // falls back to time-based sorting (within its new priority group).
    it('automatically re-sorts by time when an item is changed from Critical to High priority', async () => {
        renderTodoKanban();

        await waitFor(() => {
            expect(screen.getByText('Shortest Task')).toBeInTheDocument();
        });

        // User manually reorders the critical items first.
        dragCard('Longest Task', 'Shortest Task');

        await waitFor(() => {
            expect(getPendingCardTitles()).toEqual([
                'Longest Task',
                'Shortest Task',
                'Middle Task',
            ]);
        });

        // Open "Longest Task" and demote it from Critical to High priority.
        fireEvent.doubleClick(screen.getByText('Longest Task'));

        const prioritySelect = await screen.findByRole('combobox');
        fireEvent.change(prioritySelect, { target: { value: '3' } }); // High

        fireEvent.click(screen.getByText('Save'));

        expect(mockModifyKanbanCard).toHaveBeenCalledWith(
            expect.objectContaining({ id: '1', priority: 3 }),
            undefined
        );

        // Reflect the persisted change on the next reload.
        mockGetKanbanCards.mockResolvedValue([
            makeCard({ id: '1', title: 'Longest Task', time: 90, priority: 3 }),
            makeCard({ id: '2', title: 'Shortest Task', time: 15, priority: 4 }),
            makeCard({ id: '3', title: 'Middle Task', time: 45, priority: 4 }),
        ]);

        // No longer Critical, "Longest Task" loses its manually defined
        // position and falls to the bottom, sorted by time within High priority.
        await waitFor(() => {
            expect(getPendingCardTitles()).toEqual([
                'Shortest Task',
                'Middle Task',
                'Longest Task',
            ]);
        });
    });

    // Given the user has previously defined a manual order via drag and drop
    // When the Kanban reloads (e.g. after a card update elsewhere)
    // Then the manually defined order is preserved instead of reverting to
    // the shortest-time default.
    it('preserves the user-defined order across reloads instead of reverting to the time-based default', async () => {
        renderTodoKanban();

        await waitFor(() => {
            expect(screen.getByText('Shortest Task')).toBeInTheDocument();
        });

        dragCard('Longest Task', 'Shortest Task');

        await waitFor(() => {
            expect(getPendingCardTitles()).toEqual([
                'Longest Task',
                'Shortest Task',
                'Middle Task',
            ]);
        });

        // Simulate the periodic reload the Kanban performs (e.g. KANBAN_CARD_UPDATE).
        mockGetKanbanCards.mockResolvedValue(criticalPendingCards.map((c) => ({ ...c })));

        await waitFor(() => {
            expect(getPendingCardTitles()).toEqual([
                'Longest Task',
                'Shortest Task',
                'Middle Task',
            ]);
        });
    });

    // Given pending critical items have been manually ordered by the user
    // When that order is defined via drag and drop
    // Then it is persisted to the database (not just kept in memory), so it
    // survives a full app restart — i.e. the Todo Menu being closed and
    // reopened, not merely a re-render of the mounted component.
    it('saves the manually-defined order to the database and restores it after a full reload', async () => {
        const { unmount } = renderTodoKanban();

        await waitFor(() => {
            expect(screen.getByText('Shortest Task')).toBeInTheDocument();
        });

        dragCard('Longest Task', 'Shortest Task');

        await waitFor(() => {
            expect(getPendingCardTitles()).toEqual([
                'Longest Task',
                'Shortest Task',
                'Middle Task',
            ]);
        });

        // The reorder must be written back to the database, not just held in
        // renderer state — otherwise it would not survive an app restart.
        await waitFor(() => {
            expect(mockModifyKanbanCard).toHaveBeenCalledWith(
                expect.objectContaining({ id: '1', order: 0 }),
                undefined
            );
        });

        // Simulate the Todo Menu being closed and reopened: the component is
        // fully unmounted, so nothing survives except what was saved to the DB.
        unmount();

        // The database now returns the cards with their persisted order.
        mockGetKanbanCards.mockResolvedValue([
            makeCard({ id: '1', title: 'Longest Task', time: 90, order: 0 }),
            makeCard({ id: '2', title: 'Shortest Task', time: 15, order: 1 }),
            makeCard({ id: '3', title: 'Middle Task', time: 45, order: 2 }),
        ]);

        renderTodoKanban();

        await waitFor(() => {
            expect(getPendingCardTitles()).toEqual([
                'Longest Task',
                'Shortest Task',
                'Middle Task',
            ]);
        });
    });
});
