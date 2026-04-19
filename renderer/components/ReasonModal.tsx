import React, { useState } from "react";
import { ModificationReasonCategory, REASON_CATEGORIES } from "../types/ModificationReason";

type ReasonModalProps = {
    title: string;
    onConfirm: (reason: string, category?: ModificationReasonCategory) => void;
}

export default function ReasonModal({ title, onConfirm }: ReasonModalProps) {
    const [reason, setReason] = useState("");
    const [category, setCategory] = useState<ModificationReasonCategory | "">("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!reason.trim()) {
            setError("Please provide a reason");
            return;
        }
        onConfirm(reason.trim(), category || undefined);
    };

    return (
        <div className="flex flex-col gap-4 min-w-[400px]">
            <button type="button" data-reason-confirm className="hidden" onClick={handleSubmit} />
            <p className="text-sm text-gray-600">{title}</p>

            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Reason *</label>
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm"
                    rows={3}
                    placeholder="Enter your reason..."
                    value={reason}
                    onChange={(e) => { setReason(e.target.value); setError(""); }}
                    autoFocus
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Category (optional)</label>
                <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ModificationReasonCategory)}
                >
                    <option value="">Select a category...</option>
                    {REASON_CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export { ReasonModal };
