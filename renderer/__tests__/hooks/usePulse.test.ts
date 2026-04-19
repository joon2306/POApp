import { act, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { usePulse } from '../../hooks/usePulse';
import IPulseService from '../../services/IPulseService';
import IPiService from '../../services/IPiService';
import { Pulse } from '../../types/Pulse/Pulse';
import { Pi } from '../../types/Feature/Pi';
import React from 'react';

// ─── Dependency mocks ─────────────────────────────────────────────────────────

jest.mock('../../services/impl/ModalService', () => ({
    useModalService: () => ({
        openModal: jest.fn(),
        closeModal: jest.fn(),
    }),
}));

// ─── Test data factories ──────────────────────────────────────────────────────

const makePi = (): Pi => ({
    title: 'SL25.2',
    sprintTimestamp: {
        first: 1,        // all in the past → active sprint resolves to "Sprint IP"
        second: 2,
        third: 3,
        fourth: 4,
        fifth: 5,
        ip: 6,
    },
});

const makePulse = (key: number, state: Pulse['state'] = 'NORMAL'): Pulse => ({
    featureKey: `ADTCUST-${key}` as `ADTCUST-${number}`,
    title: `Feature ${key}`,
    target: 1,
    userStories: [],
    completedStories: [],
    dependencies: [],
    state,
    tags: [],
});

// ─── Service mocks ────────────────────────────────────────────────────────────

const mockGetAll = jest.fn<Promise<Pulse[]>, unknown[]>();
const mockGetCurrent = jest.fn<Promise<Pi>, []>();

const mockPulseService: IPulseService = {
    getAll: mockGetAll,
    saveFeature: jest.fn(),
    deleteJira: jest.fn(),
    modifyFeature: jest.fn(),
};

const mockPiService: IPiService = {
    getCurrent: mockGetCurrent,
    setCurrent: jest.fn(),
    removeCurrent: jest.fn(),
};

const deleteElement = React.createElement('span', null, 'Are you sure?');

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
    mockGetCurrent.mockResolvedValue(makePi());
    mockGetAll.mockResolvedValue([]);
});

afterEach(() => {
    jest.clearAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('usePulse — allPulses', () => {

    it('returns allPulses as part of the hook result', async () => {
        const { result } = renderHook(() =>
            usePulse(mockPulseService, mockPiService, deleteElement)
        );
        await act(async () => { });
        expect(result.current).toHaveProperty('allPulses');
        expect(Array.isArray(result.current.allPulses)).toBe(true);
    });

    it('populates allPulses from the full pulseService.getAll() response', async () => {
        const fullList = [makePulse(1), makePulse(2), makePulse(3)];
        mockGetAll.mockResolvedValue(fullList);

        const { result } = renderHook(() =>
            usePulse(mockPulseService, mockPiService, deleteElement)
        );
        await act(async () => { });

        expect(result.current.allPulses).toHaveLength(3);
    });

    it('sets allPulses before search filtering so it is always the complete list', async () => {
        const fullList = [
            makePulse(1),
            makePulse(2),
            makePulse(3),
        ];
        // First call (initial load) returns all 3; second call (triggered by handleSearch) also returns all 3
        mockGetAll.mockResolvedValue(fullList);

        const { result } = renderHook(() =>
            usePulse(mockPulseService, mockPiService, deleteElement)
        );
        await act(async () => { });

        // Initial load: allPulses should have all 3
        expect(result.current.allPulses).toHaveLength(3);
        expect(result.current.pulses).toHaveLength(3);

        // Trigger a search that would filter pulses down to 1 match
        await act(async () => {
            result.current.handleSearch({
                target: { value: 'Feature 1' },
            } as React.ChangeEvent<HTMLInputElement>);
        });

        await act(async () => { });

        // pulses is now filtered to 1 result
        expect(result.current.pulses).toHaveLength(1);
        expect(result.current.pulses[0].featureKey).toBe('ADTCUST-1');

        // allPulses is still the complete list from the last full load
        expect(result.current.allPulses).toHaveLength(3);
    });

    it('allPulses is empty while no PI is active', async () => {
        mockGetCurrent.mockResolvedValue(null);

        const { result } = renderHook(() =>
            usePulse(mockPulseService, mockPiService, deleteElement)
        );
        await act(async () => { });

        expect(result.current.allPulses).toHaveLength(0);
    });

    it('updates allPulses when new pulses are added (count trigger)', async () => {
        const initialList = [makePulse(1)];
        const updatedList = [makePulse(1), makePulse(2)];

        mockGetAll
            .mockResolvedValueOnce(initialList)
            .mockResolvedValueOnce(updatedList);

        const { result } = renderHook(() =>
            usePulse(mockPulseService, mockPiService, deleteElement)
        );
        await act(async () => { });

        expect(result.current.allPulses).toHaveLength(1);

        // savePulse triggers a count increment which re-fetches
        await act(async () => {
            result.current.savePulse({
                piTitle: { value: 'SL25.2', error: false, errorMessage: '' },
                piDate: { value: new Date().toString(), error: false, errorMessage: '' },
                featureKey: { value: 'ADTCUST-2', error: false, errorMessage: '' },
                featureTitle: { value: 'Feature 2', error: false, errorMessage: '' },
                featureTarget: { value: '1', error: false, errorMessage: '' },
            });
        });

        await act(async () => { });

        expect(result.current.allPulses).toHaveLength(2);
    });
});
