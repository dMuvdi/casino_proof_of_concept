"use client";

import { SupabaseResearchRun } from "@/types/research";

interface ReportHistoryProps {
    runs: SupabaseResearchRun[];
    selectedRunId: number | null;
    onSelectRun: (run: SupabaseResearchRun) => void;
    isLoading: boolean;
}

const modeColors: Record<string, string> = {
    manual: "bg-blue-100 text-blue-800",
    scheduled: "bg-purple-100 text-purple-800",
};

export default function ReportHistory({ runs, selectedRunId, onSelectRun, isLoading }: ReportHistoryProps) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Report History</h2>
                <p className="text-sm text-gray-500">Loading reports...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="border-b border-gray-200 px-4 py-3">
                <h2 className="text-lg font-semibold text-gray-900">Report History</h2>
                <p className="text-xs text-gray-500 mt-1">Select a report to view</p>
            </div>

            <div className="max-h-96 overflow-y-auto">
                {runs.length === 0 ? (
                    <div className="p-6 text-center">
                        <p className="text-sm text-gray-500">No reports found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {runs.map((run) => (
                            <button
                                key={run.id}
                                onClick={() => onSelectRun(run)}
                                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${selectedRunId === run.id ? "bg-blue-50" : ""
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${modeColors[run.mode] || "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {run.mode}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                #{run.id}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1">
                                            {new Date(run.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    {selectedRunId === run.id && (
                                        <div className="ml-2">
                                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Quick Stats */}
                                <div className="flex gap-3 mt-2 text-xs">
                                    <span className="text-gray-500">
                                        {run.result_json.offer_comparisons?.length || 0} comparisons
                                    </span>
                                    <span className="text-gray-500">
                                        {Object.keys(run.result_json.missing_casinos || {}).length} states
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

