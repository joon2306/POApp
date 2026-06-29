export type OverdueMeeting = {
    kanbanItemId: number;
    title: string;
    end: string;
};

export type CalendarUpdate = {
    fetchedAt: string;
    readError: string | null;
    kanbanChanged: boolean;
    overdueMeetings: OverdueMeeting[];
};
