import { useEffect, useMemo, useState } from "react";
import { Pulse } from "../../types/Pulse/Pulse";
import { Sprint } from "../../utils/PulseUtils";
import { SPRINT_OPTIONS } from "../../types/Feature/Feature";
import { ModificationReason } from "../../types/ModificationReason";
import ModificationReasonService from "../../services/impl/ModificationReasonService";

type PulseDashboardProps = {
    pulses: Pulse[];
    activeSprint: Sprint;
    piTitle: string;
}

type HealthBucket = {
    label: string;
    count: number;
    color: string;
    textColor: string;
}

type SprintRow = {
    sprint: string;
    sprintNumber: number;
    total: number;
    completed: number;
}

export default function PulseDashboard({ pulses, activeSprint, piTitle }: PulseDashboardProps) {
    const [allReasons, setAllReasons] = useState<ModificationReason[]>([]);

    useEffect(() => {
        if (!piTitle) return;
        const service = new ModificationReasonService();
        service.getByPiRef(piTitle).then(setAllReasons);
    }, [piTitle]);

    return (
        <div className="mt-10 border-t pt-8">
            <h2 className="text-xl font-bold text-[#000000] mb-6">Retrospective Dashboard</h2>
            <div className="grid grid-cols-1 gap-6">
                <HealthSummary pulses={pulses} />
                <SprintProgress pulses={pulses} />
                <LateCompletions reasons={allReasons.filter(r => r.type === "LATE_COMPLETION")} />
                <BlockedReasons reasons={allReasons.filter(r => r.type === "BLOCKED")} />
            </div>
        </div>
    );
}

function HealthSummary({ pulses }: { pulses: Pulse[] }) {
    const healthBuckets: HealthBucket[] = useMemo(() => {
        const counts = { NORMAL: 0, COMPLETED: 0, BLOCKED: 0, INCONSISTENT: 0, HAS_DEPENDENCIES: 0 };
        pulses.forEach(p => {
            if (p.state === "COMPLETED") counts.COMPLETED++;
            else if (p.state === "BLOCKED") counts.BLOCKED++;
            else if (p.state.startsWith("INCONSISTENT")) counts.INCONSISTENT++;
            else if (p.state === "HAS_DEPENDENCIES") counts.HAS_DEPENDENCIES++;
            else counts.NORMAL++;
        });
        return [
            { label: "On Track",         count: counts.NORMAL,          color: "bg-blue-100",   textColor: "text-blue-700"   },
            { label: "Completed",         count: counts.COMPLETED,       color: "bg-green-100",  textColor: "text-green-700"  },
            { label: "Blocked",           count: counts.BLOCKED,         color: "bg-red-100",    textColor: "text-red-700"    },
            { label: "Behind Schedule",   count: counts.INCONSISTENT,    color: "bg-orange-100", textColor: "text-orange-700" },
            { label: "Has Dependencies",  count: counts.HAS_DEPENDENCIES,color: "bg-yellow-100", textColor: "text-yellow-700" },
        ];
    }, [pulses]);

    return (
        <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Feature Health</h3>
            <div className="flex flex-wrap gap-4">
                {healthBuckets.map(({ label, count, color, textColor }) => (
                    <div key={label} className={`${color} rounded-lg px-5 py-3 flex flex-col items-center min-w-[110px]`}>
                        <span className={`text-2xl font-bold ${textColor}`}>{count}</span>
                        <span className={`text-xs font-medium ${textColor} mt-1`}>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SprintProgress({ pulses }: { pulses: Pulse[] }) {
    const sprintRows: SprintRow[] = useMemo(() => {
        return SPRINT_OPTIONS.map(({ value, label }) => {
            const total = pulses.reduce((sum, p) => {
                const activeCount = p.userStories.filter(u => u.target === value).length;
                const completedCount = p.completedStories.filter(c => c.target === value).length;
                return sum + activeCount + completedCount;
            }, 0);
            const completed = pulses.reduce((sum, p) =>
                sum + p.completedStories.filter(c => c.target === value).length, 0);
            return { sprint: label, sprintNumber: value, total, completed };
        });
    }, [pulses]);

    return (
        <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Sprint Progress</h3>
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left px-4 py-2 font-semibold text-gray-600 w-28">Sprint</th>
                            <th className="text-left px-4 py-2 font-semibold text-gray-600">Progress</th>
                            <th className="text-right px-4 py-2 font-semibold text-gray-600 w-20">Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sprintRows.map(({ sprint, total, completed }) => {
                            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                            const isComplete = completed === total && total > 0;
                            return (
                                <tr key={sprint} className="border-t">
                                    <td className="px-4 py-2 text-gray-700 font-medium">{sprint}</td>
                                    <td className="px-4 py-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="h-2.5 rounded-full"
                                                style={{ width: `${pct}%`, backgroundColor: isComplete ? "#10B981" : "#3B82F6" }}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-right text-gray-600">{completed} / {total}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const CATEGORY_LABELS: Record<string, string> = {
    SCOPE_CHANGE: "Scope Change",
    DEPENDENCY_BLOCKED: "Dependency Blocked",
    UNDERESTIMATED: "Underestimated",
    RESOURCE_ISSUE: "Resource Issue",
    REQUIREMENT_CHANGE: "Requirement Change",
    OTHER: "Other",
};

const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

function LateCompletions({ reasons }: { reasons: ModificationReason[] }) {
    return (
        <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-1">Late Completions</h3>
            <p className="text-xs text-gray-400 mb-3">{reasons.length} late completion{reasons.length !== 1 ? "s" : ""} recorded</p>
            {reasons.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No late completions recorded.</p>
            ) : (
                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-4 py-2 font-semibold text-gray-600">Jira Key</th>
                                <th className="text-left px-4 py-2 font-semibold text-gray-600">Reason</th>
                                <th className="text-left px-4 py-2 font-semibold text-gray-600">Category</th>
                                <th className="text-left px-4 py-2 font-semibold text-gray-600">Planned For</th>
                                <th className="text-left px-4 py-2 font-semibold text-gray-600">Completed In</th>
                                <th className="text-left px-4 py-2 font-semibold text-gray-600">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reasons.map((r, i) => (
                                <tr key={i} className="border-t">
                                    <td className="px-4 py-2 font-mono text-xs text-gray-700">{r.jiraKey}</td>
                                    <td className="px-4 py-2 text-gray-700 max-w-xs truncate">{r.reason}</td>
                                    <td className="px-4 py-2 text-gray-600">{r.category ? CATEGORY_LABELS[r.category] ?? r.category : "—"}</td>
                                    <td className="px-4 py-2 text-gray-600">{r.previousValue ?? "—"}</td>
                                    <td className="px-4 py-2 text-gray-600">{r.activeSprint ?? "—"}</td>
                                    <td className="px-4 py-2 text-gray-500 text-xs">{r.timestamp ? formatDate(r.timestamp) : "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function BlockedReasons({ reasons }: { reasons: ModificationReason[] }) {
    return (
        <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-1">Blocked Reasons</h3>
            <p className="text-xs text-gray-400 mb-3">{reasons.length} blocked item{reasons.length !== 1 ? "s" : ""} recorded</p>
            {reasons.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No blocked items recorded.</p>
            ) : (
                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-4 py-2 font-semibold text-gray-600">Jira Key</th>
                                <th className="text-left px-4 py-2 font-semibold text-gray-600">Reason</th>
                                <th className="text-left px-4 py-2 font-semibold text-gray-600">Category</th>
                                <th className="text-left px-4 py-2 font-semibold text-gray-600">Sprint When Blocked</th>
                                <th className="text-left px-4 py-2 font-semibold text-gray-600">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reasons.map((r, i) => (
                                <tr key={i} className="border-t">
                                    <td className="px-4 py-2 font-mono text-xs text-gray-700">{r.jiraKey}</td>
                                    <td className="px-4 py-2 text-gray-700 max-w-xs truncate">{r.reason}</td>
                                    <td className="px-4 py-2 text-gray-600">{r.category ? CATEGORY_LABELS[r.category] ?? r.category : "—"}</td>
                                    <td className="px-4 py-2 text-gray-600">{r.activeSprint ?? "—"}</td>
                                    <td className="px-4 py-2 text-gray-500 text-xs">{r.timestamp ? formatDate(r.timestamp) : "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
