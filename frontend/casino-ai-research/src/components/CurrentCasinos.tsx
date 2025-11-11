import { CurrentCasino } from "@/types/research";

interface CurrentCasinosProps {
    casinos: CurrentCasino[];
    isLoading: boolean;
}

export default function CurrentCasinos({ casinos, isLoading }: CurrentCasinosProps) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Casinos in System</h2>
                <p className="text-sm text-gray-500">Loading casinos...</p>
            </div>
        );
    }

    // Group casinos by state
    const casinosByState: Record<string, CurrentCasino[]> = {};
    casinos.forEach(casino => {
        const stateName = casino.state?.Name || "Unknown";
        if (!casinosByState[stateName]) {
            casinosByState[stateName] = [];
        }
        casinosByState[stateName].push(casino);
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                    Current Casinos in System
                </h2>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {casinos.length} Total
                </span>
            </div>

            {casinos.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <p className="text-gray-500">No casinos found in the system</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {casinos.map((casino, index) => (
                        <div
                            key={`casino-${casino.casinodb_id}-${casino.states_id}-${casino.offer_type}-${index}`}
                            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 text-lg">
                                        {casino.Name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-500">
                                            {casino.state?.Name || "Unknown"}
                                        </span>
                                        {casino.state?.Abbreviation && (
                                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
                                                {casino.state.Abbreviation}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Offer Type Badge */}
                            {casino.offer_type && (
                                <div className="mb-3">
                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                                        {casino.offer_type}
                                    </span>
                                </div>
                            )}

                            {/* Offer Details */}
                            {casino.Offer_Name && (
                                <div className="mb-3">
                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        {casino.Offer_Name}
                                    </p>
                                </div>
                            )}

                            {/* Financial Details */}
                            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase mb-1">Expected Deposit</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        ${casino.Expected_Deposit?.toLocaleString() || 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase mb-1">Expected Bonus</p>
                                    <p className="text-lg font-bold text-green-700">
                                        ${casino.Expected_Bonus?.toLocaleString() || 0}
                                    </p>
                                </div>
                            </div>

                            {/* Casino ID */}
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-400">
                                    ID: {casino.casinodb_id}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Summary by State */}
            {Object.keys(casinosByState).length > 0 && (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mt-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Summary by State</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(casinosByState).map(([state, stateCasinos]) => (
                            <div key={state} className="bg-white rounded-lg p-3 border border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">{state}</p>
                                <p className="text-2xl font-bold text-gray-900">{stateCasinos.length}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

