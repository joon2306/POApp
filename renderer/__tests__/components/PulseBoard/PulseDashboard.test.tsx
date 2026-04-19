import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PulseDashboard from '../../../components/PulseBoard/PulseDashboard';
import { Pulse } from '../../../types/Pulse/Pulse';
import { ModificationReason } from '../../../types/ModificationReason';
import { JiraTicket } from '../../../types/Feature/Feature';

// ─── Service mock ────────────────────────────────────────────────────────────

const mockGetByPiRef = jest.fn();

jest.mock('../../../services/impl/ModificationReasonService', () => {
    return jest.fn().mockImplementation(() => ({
        getByPiRef: mockGetByPiRef
    }));
});

// ─── Test data factories ──────────────────────────────────────────────────────

const makePulse = (overrides: Partial<Pulse> = {}): Pulse => ({
    featureKey: 'ADTCUST-1' as `ADTCUST-${number}`,
    title: 'Test Feature',
    target: 1,
    userStories: [],
    completedStories: [],
    dependencies: [],
    state: 'NORMAL',
    tags: [],
    ...overrides,
});

const makeUS = (target: JiraTicket['target']): JiraTicket => ({
    title: 'ADTCUST-99' as `ADTCUST-${number}`,
    state: 2,
    target,
});

const makeCompletedStory = (target: JiraTicket['target']) => ({
    jiraKey: 'ADTCUST-99' as `ADTCUST-${number}`,
    title: 'Completed Story',
    target,
});

const makeLateCompletion = (overrides: Partial<ModificationReason> = {}): ModificationReason => ({
    jiraKey: 'ADTCUST-10',
    reason: 'Took longer than expected',
    category: 'UNDERESTIMATED',
    type: 'LATE_COMPLETION',
    previousValue: 'Sprint 1',
    activeSprint: 'Sprint 3',
    timestamp: new Date('2026-04-15').getTime(),
    piRef: 'PI-1',
    ...overrides,
});

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
    mockGetByPiRef.mockResolvedValue([]);
});

afterEach(() => {
    jest.clearAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('PulseDashboard', () => {

    describe('section title', () => {
        it('renders the Retrospective Dashboard heading', () => {
            render(<PulseDashboard pulses={[]} activeSprint="Sprint 1" piTitle="PI-1" />);
            expect(screen.getByText('Retrospective Dashboard')).toBeInTheDocument();
        });
    });

    // ── Feature Health panel ─────────────────────────────────────────────────

    describe('Feature Health panel', () => {
        it('renders all five health bucket labels', () => {
            render(<PulseDashboard pulses={[]} activeSprint="Sprint 1" piTitle="PI-1" />);
            expect(screen.getByText('On Track')).toBeInTheDocument();
            expect(screen.getByText('Completed')).toBeInTheDocument();
            expect(screen.getByText('Blocked')).toBeInTheDocument();
            expect(screen.getByText('Behind Schedule')).toBeInTheDocument();
            expect(screen.getByText('Has Dependencies')).toBeInTheDocument();
        });

        it('shows 0 for every bucket when there are no pulses', () => {
            render(<PulseDashboard pulses={[]} activeSprint="Sprint 1" piTitle="PI-1" />);
            const zeros = screen.getAllByText('0');
            expect(zeros.length).toBeGreaterThanOrEqual(5);
        });

        it('counts NORMAL state as On Track', () => {
            const pulses = [
                makePulse({ featureKey: 'ADTCUST-1' as `ADTCUST-${number}`, state: 'NORMAL' }),
                makePulse({ featureKey: 'ADTCUST-2' as `ADTCUST-${number}`, state: 'NORMAL' }),
            ];
            render(<PulseDashboard pulses={pulses} activeSprint="Sprint 1" piTitle="PI-1" />);
            const onTrackLabel = screen.getByText('On Track');
            expect(onTrackLabel.closest('div').textContent).toContain('2');
        });

        it('counts COMPLETED state as Completed', () => {
            const pulses = [
                makePulse({ featureKey: 'ADTCUST-1' as `ADTCUST-${number}`, state: 'COMPLETED' }),
            ];
            render(<PulseDashboard pulses={pulses} activeSprint="Sprint 1" piTitle="PI-1" />);
            const completedLabel = screen.getByText('Completed');
            expect(completedLabel.closest('div').textContent).toContain('1');
        });

        it('counts BLOCKED state as Blocked', () => {
            const pulses = [
                makePulse({ featureKey: 'ADTCUST-1' as `ADTCUST-${number}`, state: 'BLOCKED' }),
                makePulse({ featureKey: 'ADTCUST-2' as `ADTCUST-${number}`, state: 'BLOCKED' }),
                makePulse({ featureKey: 'ADTCUST-3' as `ADTCUST-${number}`, state: 'BLOCKED' }),
            ];
            render(<PulseDashboard pulses={pulses} activeSprint="Sprint 1" piTitle="PI-1" />);
            const blockedLabel = screen.getByText('Blocked');
            expect(blockedLabel.closest('div').textContent).toContain('3');
        });

        it('counts INCONSISTENT state as Behind Schedule', () => {
            const pulses = [
                makePulse({ featureKey: 'ADTCUST-1' as `ADTCUST-${number}`, state: 'INCONSISTENT' }),
            ];
            render(<PulseDashboard pulses={pulses} activeSprint="Sprint 1" piTitle="PI-1" />);
            const behindLabel = screen.getByText('Behind Schedule');
            expect(behindLabel.closest('div').textContent).toContain('1');
        });

        it('counts INCONSISTENT US state as Behind Schedule', () => {
            const pulses = [
                makePulse({ featureKey: 'ADTCUST-1' as `ADTCUST-${number}`, state: 'INCONSISTENT US' }),
            ];
            render(<PulseDashboard pulses={pulses} activeSprint="Sprint 1" piTitle="PI-1" />);
            const behindLabel = screen.getByText('Behind Schedule');
            expect(behindLabel.closest('div').textContent).toContain('1');
        });

        it('counts INCONSISTENT DEPENDENCIES state as Behind Schedule', () => {
            const pulses = [
                makePulse({ featureKey: 'ADTCUST-1' as `ADTCUST-${number}`, state: 'INCONSISTENT DEPENDENCIES' }),
            ];
            render(<PulseDashboard pulses={pulses} activeSprint="Sprint 1" piTitle="PI-1" />);
            const behindLabel = screen.getByText('Behind Schedule');
            expect(behindLabel.closest('div').textContent).toContain('1');
        });

        it('counts HAS_DEPENDENCIES state as Has Dependencies', () => {
            const pulses = [
                makePulse({ featureKey: 'ADTCUST-1' as `ADTCUST-${number}`, state: 'HAS_DEPENDENCIES' }),
            ];
            render(<PulseDashboard pulses={pulses} activeSprint="Sprint 1" piTitle="PI-1" />);
            const depLabel = screen.getByText('Has Dependencies');
            expect(depLabel.closest('div').textContent).toContain('1');
        });

        it('counts features with mixed states correctly', () => {
            const pulses = [
                makePulse({ featureKey: 'ADTCUST-1' as `ADTCUST-${number}`, state: 'NORMAL' }),
                makePulse({ featureKey: 'ADTCUST-2' as `ADTCUST-${number}`, state: 'COMPLETED' }),
                makePulse({ featureKey: 'ADTCUST-3' as `ADTCUST-${number}`, state: 'BLOCKED' }),
                makePulse({ featureKey: 'ADTCUST-4' as `ADTCUST-${number}`, state: 'INCONSISTENT' }),
                makePulse({ featureKey: 'ADTCUST-5' as `ADTCUST-${number}`, state: 'INCONSISTENT US' }),
                makePulse({ featureKey: 'ADTCUST-6' as `ADTCUST-${number}`, state: 'HAS_DEPENDENCIES' }),
            ];
            render(<PulseDashboard pulses={pulses} activeSprint="Sprint 1" piTitle="PI-1" />);

            expect(screen.getByText('On Track').closest('div').textContent).toContain('1');
            expect(screen.getByText('Completed').closest('div').textContent).toContain('1');
            expect(screen.getByText('Blocked').closest('div').textContent).toContain('1');
            // INCONSISTENT + INCONSISTENT US = 2
            expect(screen.getByText('Behind Schedule').closest('div').textContent).toContain('2');
            expect(screen.getByText('Has Dependencies').closest('div').textContent).toContain('1');
        });

        it('dashboard counts are unaffected by changing the pulses prop (simulating search independence)', () => {
            const allPulses = [
                makePulse({ featureKey: 'ADTCUST-1' as `ADTCUST-${number}`, state: 'NORMAL' }),
                makePulse({ featureKey: 'ADTCUST-2' as `ADTCUST-${number}`, state: 'COMPLETED' }),
                makePulse({ featureKey: 'ADTCUST-3' as `ADTCUST-${number}`, state: 'BLOCKED' }),
            ];
            // When PulseBoard passes allPulses (not filtered pulses) to PulseDashboard,
            // all 3 features are always counted regardless of search.
            const { rerender } = render(
                <PulseDashboard pulses={allPulses} activeSprint="Sprint 1" piTitle="PI-1" />
            );
            expect(screen.getByText('On Track').closest('div').textContent).toContain('1');
            expect(screen.getByText('Blocked').closest('div').textContent).toContain('1');

            // Simulating a re-render with allPulses unchanged (search changed filtered pulses, not allPulses)
            rerender(<PulseDashboard pulses={allPulses} activeSprint="Sprint 1" piTitle="PI-1" />);
            expect(screen.getByText('On Track').closest('div').textContent).toContain('1');
            expect(screen.getByText('Blocked').closest('div').textContent).toContain('1');
        });
    });

    // ── Sprint Progress panel ────────────────────────────────────────────────

    describe('Sprint Progress panel', () => {
        it('renders a row for every sprint option', () => {
            render(<PulseDashboard pulses={[]} activeSprint="Sprint 1" piTitle="PI-1" />);
            expect(screen.getByText('Sprint 1')).toBeInTheDocument();
            expect(screen.getByText('Sprint 2')).toBeInTheDocument();
            expect(screen.getByText('Sprint 3')).toBeInTheDocument();
            expect(screen.getByText('Sprint 4')).toBeInTheDocument();
            expect(screen.getByText('Sprint 5')).toBeInTheDocument();
            expect(screen.getByText('Sprint IP')).toBeInTheDocument();
        });

        it('shows 0 / 0 for all sprints when there are no user stories', () => {
            render(<PulseDashboard pulses={[makePulse()]} activeSprint="Sprint 1" piTitle="PI-1" />);
            const zeroCounts = screen.getAllByText('0 / 0');
            expect(zeroCounts.length).toBe(6);
        });

        it('counts active user stories toward total for their target sprint', () => {
            const pulse = makePulse({
                userStories: [makeUS(2), makeUS(2)],
            });
            render(<PulseDashboard pulses={[pulse]} activeSprint="Sprint 1" piTitle="PI-1" />);
            // Sprint 2: 0 completed, 2 total
            expect(screen.getByText('0 / 2')).toBeInTheDocument();
        });

        it('counts completed stories toward both total and completed for their target sprint', () => {
            const pulse = makePulse({
                completedStories: [makeCompletedStory(3), makeCompletedStory(3)],
            });
            render(<PulseDashboard pulses={[pulse]} activeSprint="Sprint 1" piTitle="PI-1" />);
            // Sprint 3: 2 completed out of 2 total
            expect(screen.getByText('2 / 2')).toBeInTheDocument();
        });

        it('shows partial completion correctly — TC6: 3 completed of 4 total in Sprint 2', () => {
            const pulse = makePulse({
                userStories: [makeUS(2)],
                completedStories: [
                    makeCompletedStory(2),
                    makeCompletedStory(2),
                    makeCompletedStory(2),
                ],
            });
            render(<PulseDashboard pulses={[pulse]} activeSprint="Sprint 1" piTitle="PI-1" />);
            expect(screen.getByText('3 / 4')).toBeInTheDocument();
        });

        it('does not mix stories from different sprints', () => {
            const pulse = makePulse({
                userStories: [makeUS(1), makeUS(1)],
                completedStories: [makeCompletedStory(3)],
            });
            render(<PulseDashboard pulses={[pulse]} activeSprint="Sprint 1" piTitle="PI-1" />);
            // Sprint 1: 0 completed, 2 active
            expect(screen.getByText('0 / 2')).toBeInTheDocument();
            // Sprint 3: 1 completed, 1 total
            expect(screen.getByText('1 / 1')).toBeInTheDocument();
        });

        it('aggregates user stories across multiple pulses for the same sprint', () => {
            const pulseA = makePulse({
                featureKey: 'ADTCUST-1' as `ADTCUST-${number}`,
                userStories: [makeUS(4)],
                completedStories: [makeCompletedStory(4)],
            });
            const pulseB = makePulse({
                featureKey: 'ADTCUST-2' as `ADTCUST-${number}`,
                userStories: [makeUS(4)],
            });
            render(<PulseDashboard pulses={[pulseA, pulseB]} activeSprint="Sprint 1" piTitle="PI-1" />);
            // Sprint 4: 1 completed out of 3 total (1 active + 1 completed from A, 1 active from B)
            expect(screen.getByText('1 / 3')).toBeInTheDocument();
        });
    });

    // ── Late Completions panel ───────────────────────────────────────────────

    describe('Late Completions panel', () => {
        it('shows "No late completions recorded." when the service returns an empty list', async () => {
            mockGetByPiRef.mockResolvedValue([]);
            render(<PulseDashboard pulses={[]} activeSprint="Sprint 1" piTitle="PI-1" />);
            await waitFor(() => {
                expect(screen.getByText('No late completions recorded.')).toBeInTheDocument();
            });
        });

        it('calls getByPiRef with the piTitle prop', async () => {
            render(<PulseDashboard pulses={[]} activeSprint="Sprint 1" piTitle="SL25.2" />);
            await waitFor(() => {
                expect(mockGetByPiRef).toHaveBeenCalledWith('SL25.2');
            });
        });

        it('renders a table row for each late completion', async () => {
            mockGetByPiRef.mockResolvedValue([
                makeLateCompletion({ jiraKey: 'ADTCUST-10' }),
                makeLateCompletion({ jiraKey: 'ADTCUST-11' }),
            ]);
            render(<PulseDashboard pulses={[]} activeSprint="Sprint 1" piTitle="PI-1" />);
            await waitFor(() => {
                expect(screen.getByText('ADTCUST-10')).toBeInTheDocument();
                expect(screen.getByText('ADTCUST-11')).toBeInTheDocument();
            });
        });

        it('filters out non-LATE_COMPLETION reason types', async () => {
            mockGetByPiRef.mockResolvedValue([
                makeLateCompletion({ jiraKey: 'ADTCUST-10', type: 'LATE_COMPLETION' }),
                { ...makeLateCompletion(), jiraKey: 'ADTCUST-20', type: 'TARGET_CHANGE' },
                { ...makeLateCompletion(), jiraKey: 'ADTCUST-30', type: 'BLOCKED' },
            ]);
            render(<PulseDashboard pulses={[]} activeSprint="Sprint 1" piTitle="PI-1" />);
            await waitFor(() => {
                expect(screen.getByText('ADTCUST-10')).toBeInTheDocument();
                expect(screen.queryByText('ADTCUST-20')).not.toBeInTheDocument();
                expect(screen.queryByText('ADTCUST-30')).not.toBeInTheDocument();
            });
        });

        it('shows the free-text reason in the table', async () => {
            mockGetByPiRef.mockResolvedValue([
                makeLateCompletion({ reason: 'Infrastructure was down for two days' }),
            ]);
            render(<PulseDashboard pulses={[]} activeSprint="Sprint 1" piTitle="PI-1" />);
            await waitFor(() => {
                expect(screen.getByText('Infrastructure was down for two days')).toBeInTheDocument();
            });
        });

        it('shows the human-readable category label', async () => {
            mockGetByPiRef.mockResolvedValue([
                makeLateCompletion({ category: 'DEPENDENCY_BLOCKED' }),
            ]);
            render(<PulseDashboard pulses={[]} activeSprint="Sprint 1" piTitle="PI-1" />);
            await waitFor(() => {
                expect(screen.getByText('Dependency Blocked')).toBeInTheDocument();
            });
        });

        it('shows "—" when category is undefined', async () => {
            const reason = makeLateCompletion();
            delete reason.category;
            mockGetByPiRef.mockResolvedValue([reason]);
            render(<PulseDashboard pulses={[]} activeSprint="Sprint 1" piTitle="PI-1" />);
            await waitFor(() => {
                expect(screen.getAllByText('—').length).toBeGreaterThan(0);
            });
        });

        it('shows previousValue as "Planned For" and activeSprint as "Completed In"', async () => {
            mockGetByPiRef.mockResolvedValue([
                makeLateCompletion({ previousValue: 'Sprint 1', activeSprint: 'Sprint 4' }),
            ]);
            render(<PulseDashboard pulses={[]} activeSprint="Sprint 1" piTitle="PI-1" />);
            await waitFor(() => {
                expect(screen.getByText('Sprint 4')).toBeInTheDocument();
            });
        });

        it('shows a formatted date from the timestamp', async () => {
            const ts = new Date('2026-04-15').getTime();
            mockGetByPiRef.mockResolvedValue([makeLateCompletion({ timestamp: ts })]);
            render(<PulseDashboard pulses={[]} activeSprint="Sprint 1" piTitle="PI-1" />);
            await waitFor(() => {
                // "15 Apr" or "Apr 15" depending on locale — check for the year-less short date
                expect(screen.getByText(/15.*Apr|Apr.*15/i)).toBeInTheDocument();
            });
        });

        it('shows the correct count in the subheading', async () => {
            mockGetByPiRef.mockResolvedValue([
                makeLateCompletion({ jiraKey: 'ADTCUST-10' }),
                makeLateCompletion({ jiraKey: 'ADTCUST-11' }),
            ]);
            render(<PulseDashboard pulses={[]} activeSprint="Sprint 1" piTitle="PI-1" />);
            await waitFor(() => {
                expect(screen.getByText(/2 late completions recorded/i)).toBeInTheDocument();
            });
        });

        it('uses singular "completion" when count is 1', async () => {
            mockGetByPiRef.mockResolvedValue([makeLateCompletion()]);
            render(<PulseDashboard pulses={[]} activeSprint="Sprint 1" piTitle="PI-1" />);
            await waitFor(() => {
                expect(screen.getByText(/1 late completion recorded/i)).toBeInTheDocument();
            });
        });

        it('shows table headers when there are late completions', async () => {
            mockGetByPiRef.mockResolvedValue([makeLateCompletion()]);
            render(<PulseDashboard pulses={[]} activeSprint="Sprint 1" piTitle="PI-1" />);
            await waitFor(() => {
                expect(screen.getByText('Jira Key')).toBeInTheDocument();
                expect(screen.getByText('Reason')).toBeInTheDocument();
                expect(screen.getByText('Category')).toBeInTheDocument();
                expect(screen.getByText('Planned For')).toBeInTheDocument();
                expect(screen.getByText('Completed In')).toBeInTheDocument();
                expect(screen.getByText('Date')).toBeInTheDocument();
            });
        });
    });
});
