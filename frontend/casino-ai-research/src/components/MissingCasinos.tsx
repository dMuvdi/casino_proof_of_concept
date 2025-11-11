import { ResearchResult } from "@/types/research";

interface MissingCasinosProps {
    data: ResearchResult["result_json"]["missing_casinos"];
}

export default function MissingCasinos({ data }: MissingCasinosProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
                Casino Discovery by State
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(data).map(([state, casinos]) => (
                    <div
                        key={state}
                        className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                    >
                        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">
                                {state}
                            </h3>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                                {casinos.length} {casinos.length === 1 ? "Casino" : "Casinos"}
                            </span>
                        </div>

                        {casinos.length > 0 ? (
                            <div className="p-4 max-h-64 overflow-y-auto">
                                <div className="grid grid-cols-3 gap-2">
                                    {casinos.map((casino, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors text-center"
                                        >
                                            <span className="text-xs text-gray-700 font-medium">
                                                {casino}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 text-center">
                                <p className="text-sm text-gray-500 italic">No casinos found</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

