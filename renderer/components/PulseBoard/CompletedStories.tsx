import { useEffect, useMemo, useState } from "react";
import { SelectedFeature } from "./PulseRouter";
import CommsService from "../../services/impl/CommsService";
import CommunicationEvents from "../../types/CommunicationEvent";
import { GenericResponse } from "../../types/Generic";
import { JIRA_STATUS, JIRA_TYPE, JiraServerResponse } from "../../types/Pulse/Pulse";
import { SPRINT_OPTIONS } from "../../types/Feature/Feature";
import Card from "../Card";
import ModificationReasonService from "../../services/impl/ModificationReasonService";
import { ModificationReason } from "../../types/ModificationReason";

type CompletedStoriesProps = {
    selectedFeature: SelectedFeature;
}

type CompletedStoryRow = {
    jiraKey: string;
    title: string;
    target: number;
    itemType: 'USER_STORY' | 'DEPENDENCY';
    blockedReason?: string;
    blockedCategory?: string;
}

export default function CompletedStories({ selectedFeature }: CompletedStoriesProps) {
    const [stories, setStories] = useState<CompletedStoryRow[]>([]);
    const commsService = useMemo(() => new CommsService(), []);

    useEffect(() => {
        const fetchAll = async () => {
            const reasonService = new ModificationReasonService();
            // Sequential fetches required for the two getJiraByFeature calls — they share
            // the same IPC channel and a persistent listener, so parallel calls would
            // cause both promises to resolve with whichever response arrives first.
            const usRes = await commsService.sendRequest<GenericResponse<JiraServerResponse[]>>(
                CommunicationEvents.getJiraByFeature, JIRA_TYPE.USER_STORY, selectedFeature.featureRef
            );
            const depRes = await commsService.sendRequest<GenericResponse<JiraServerResponse[]>>(
                CommunicationEvents.getJiraByFeature, JIRA_TYPE.DEPENDENCY, selectedFeature.featureRef
            );
            const reasons = await reasonService.getByPiRef(selectedFeature.piRef);

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
        fetchAll();
    }, [selectedFeature.featureRef, selectedFeature.piRef]);

    const getSprintLabel = (target: number) => {
        const sprint = SPRINT_OPTIONS.find(s => s.value === target);
        return sprint ? sprint.label : "Unplanned";
    };

    return (
        <div className="m-10">
            <h1 className="text-2xl font-bold text-[#000000] mb-2">Completed Items</h1>
            <p className="text-sm text-gray-500 mb-6">
                Feature: <span className="font-semibold text-[#000000]">{selectedFeature.featureRef}</span>
            </p>

            {stories.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <p className="text-gray-400 text-lg">No completed items for this feature.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left py-3 px-5 font-semibold text-gray-600 uppercase text-xs tracking-wider">Jira Key</th>
                                <th className="text-left py-3 px-5 font-semibold text-gray-600 uppercase text-xs tracking-wider">Title</th>
                                <th className="text-left py-3 px-5 font-semibold text-gray-600 uppercase text-xs tracking-wider">Type</th>
                                <th className="text-left py-3 px-5 font-semibold text-gray-600 uppercase text-xs tracking-wider">Target Sprint</th>
                                <th className="text-left py-3 px-5 font-semibold text-gray-600 uppercase text-xs tracking-wider">Blocked Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stories.map((story, index) => (
                                <tr key={story.jiraKey}
                                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150`}>
                                    <td className="py-3 px-5 font-mono font-semibold text-blue-600">{story.jiraKey}</td>
                                    <td className="py-3 px-5 text-gray-800">{story.title}</td>
                                    <td className="py-3 px-5">
                                        {story.itemType === 'USER_STORY'
                                            ? <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">User Story</span>
                                            : <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">Dependency</span>
                                        }
                                    </td>
                                    <td className="py-3 px-5">
                                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                            {getSprintLabel(story.target)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-5 text-gray-600 max-w-xs truncate">
                                        {story.blockedReason ?? "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-4 text-xs text-gray-400">
                Total: {stories.length} completed {stories.length === 1 ? "item" : "items"}
            </div>
        </div>
    );
}
