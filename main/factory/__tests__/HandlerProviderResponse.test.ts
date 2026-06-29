import { HandlerProviderResponse } from "../HandlerProvider";
import BackgroundTask from "../../manager/BackgroundTask";

describe("HandlerProviderResponse background task lifecycle", () => {
    it("starts every registered task and stops them in reverse order", () => {
        const calls: string[] = [];
        const task = (name: string): BackgroundTask => ({
            start: () => calls.push(`start:${name}`),
            stop: () => calls.push(`stop:${name}`),
        });
        const provider = new HandlerProviderResponse([], [task("calendar"), task("future-task")]);

        provider.startBackgroundTasks();
        provider.stopBackgroundTasks();

        expect(calls).toEqual([
            "start:calendar",
            "start:future-task",
            "stop:future-task",
            "stop:calendar",
        ]);
    });
});
