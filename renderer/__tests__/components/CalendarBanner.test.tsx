import React from "react";
import { render, screen } from "@testing-library/react";
import CalendarBanner from "../../components/CalendarBanner";

const healthy = {
    fetchedAt: "2026-06-27T10:00:00Z",
    readError: null,
    kanbanChanged: false,
    overdueMeetings: [],
};

describe("CalendarBanner", () => {
    it("renders nothing when healthy", () => {
        const { container } = render(<CalendarBanner status={healthy} />);
        expect(container).toBeEmptyDOMElement();
    });

    it("renders read and overdue warnings together", () => {
        render(<CalendarBanner status={{
            ...healthy,
            readError: "Chrome debug port 9222 is not reachable.",
            overdueMeetings: [{
                kanbanItemId: 42,
                title: "Teams meeting: Team Sync",
                end: "2026-06-27T09:30:00+04:00",
            }],
        }} />);
        expect(screen.getByTestId("calendar-read-warning")).toHaveTextContent("Chrome debug port 9222");
        expect(screen.getByRole("alert")).toHaveTextContent("Teams meeting: Team Sync");
    });
});
