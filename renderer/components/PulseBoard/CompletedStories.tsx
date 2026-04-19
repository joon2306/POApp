import { useEffect, useMemo, useState } from "react";
import { SelectedFeature } from "./PulseRouter";
import CommsService from "../../services/impl/CommsService";
import CommunicationEvents from "../../types/CommunicationEvent";
import { GenericResponse } from "../../types/Generic";
import { JIRA_STATUS, JIRA_TYPE, JiraServerResponse } from "../../types/Pulse/Pulse";
import { SPRINT_OPTIONS } from "../../types/Feature/Feature";
import Card from "../Card";

type CompletedStoriesProps = {
    selectedFeature: SelectedFeature;
}

type CompletedStoryRow = {
    jiraKey: string;
    title: string;
    target: number;
}

export default function CompletedStories({ selectedFeature }: CompletedStoriesProps) {
    const [stories, setStories] = useState<CompletedStoryRow[]>([]);
    const commsService = useMemo(() => new CommsService(), []);

    useEffect(() => {
        const fetchCompletedStories = async () => {
            const { data, error } = await commsService.sendRequest<GenericResponse<JiraServerResponse[]>>(
                CommunicationEvents.getJiraByFeature, JIRA_TYPE.USER_STORY, selectedFeature.featureRef
            );
            if (!error && data) {
                const completed = data
                    .filter(item => item.status === JIRA_STATUS.COMPLETED)
                    .map(item => ({
                        jiraKey: item.jiraKey,
                        title: item.title,
                        target: item.target
                    }));
                setStories(completed);
            }
        };
        fetchCompletedStories();
    }, [selectedFeature.featureRef]);

    const getSprintLabel = (target: number) => {
        const sprint = SPRINT_OPTIONS.find(s => s.value === target);
        return sprint ? sprint.label : "Unplanned";
    };

    return (
        <div className="m-10">
            <h1 className="text-2xl font-bold text-[#000000] mb-2">Completed User Stories</h1>
            <p className="text-sm text-gray-500 mb-6">
                Feature: <span className="font-semibold text-[#000000]">{selectedFeature.featureRef}</span>
            </p>

            {stories.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <p className="text-gray-400 text-lg">No completed user stories for this feature.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left py-3 px-5 font-semibold text-gray-600 uppercase text-xs tracking-wider">Jira Key</th>
                                <th className="text-left py-3 px-5 font-semibold text-gray-600 uppercase text-xs tracking-wider">Title</th>
                                <th className="text-left py-3 px-5 font-semibold text-gray-600 uppercase text-xs tracking-wider">Target Sprint</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stories.map((story, index) => (
                                <tr key={story.jiraKey}
                                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150`}>
                                    <td className="py-3 px-5 font-mono font-semibold text-blue-600">{story.jiraKey}</td>
                                    <td className="py-3 px-5 text-gray-800">{story.title}</td>
                                    <td className="py-3 px-5">
                                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                            {getSprintLabel(story.target)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-4 text-xs text-gray-400">
                Total: {stories.length} completed {stories.length === 1 ? "story" : "stories"}
            </div>
        </div>
    );
}
