import { useState } from "react";
import { OfferComparison } from "@/types/research";
import { safeGetString, safeGetNumber } from "@/lib/utils";

interface OfferComparisonsProps {
    comparisons: OfferComparison[];
}

// Helper to safely display offer text
function getOfferDisplay(offer: string): string {
    return safeGetString(offer, "No offer details");
}

type FilterType = "all" | "Better" | "New Casino" | "Alternative";

const statusColors: Record<OfferComparison["status"], string> = {
    Better: "bg-green-100 text-green-800 border-green-300",
    Worse: "bg-red-100 text-red-800 border-red-300",
    Same: "bg-gray-100 text-gray-800 border-gray-300",
    Alternative: "bg-yellow-100 text-yellow-800 border-yellow-300",
    "New Casino": "bg-blue-100 text-blue-800 border-blue-300",
};

const statusIcons: Record<OfferComparison["status"], string> = {
    Better: "↑",
    Worse: "↓",
    Same: "=",
    Alternative: "~",
    "New Casino": "★",
};

export default function OfferComparisons({ comparisons }: OfferComparisonsProps) {
    const [filter, setFilter] = useState<FilterType>("all");

    const filteredComparisons = filter === "all"
        ? comparisons
        : comparisons.filter(c => c.status === filter);

    const betterOffers = comparisons.filter((c) => c.status === "Better");
    const newCasinos = comparisons.filter((c) => c.status === "New Casino");
    const alternativeOffers = comparisons.filter((c) => c.status === "Alternative");

    return (
        <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase font-medium">Total Reviewed</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{comparisons.length}</p>
                </div>
                <div className="bg-green-50 rounded-lg border border-green-200 p-4 shadow-sm">
                    <p className="text-xs text-green-700 uppercase font-medium">Better Offers</p>
                    <p className="text-3xl font-bold text-green-900 mt-1">{betterOffers.length}</p>
                </div>
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 shadow-sm">
                    <p className="text-xs text-blue-700 uppercase font-medium">New Casinos</p>
                    <p className="text-3xl font-bold text-blue-900 mt-1">{newCasinos.length}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4 shadow-sm">
                    <p className="text-xs text-yellow-700 uppercase font-medium">Alternative</p>
                    <p className="text-3xl font-bold text-yellow-900 mt-1">{alternativeOffers.length}</p>
                </div>
            </div>

            {/* Comparisons List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Offer Comparisons
                    </h2>

                    {/* Filters */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === "all"
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter("Better")}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === "Better"
                                ? "bg-green-600 text-white"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                        >
                            Better
                        </button>
                        <button
                            onClick={() => setFilter("New Casino")}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === "New Casino"
                                ? "bg-blue-600 text-white"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                }`}
                        >
                            New Casino
                        </button>
                        <button
                            onClick={() => setFilter("Alternative")}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === "Alternative"
                                ? "bg-yellow-600 text-white"
                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                }`}
                        >
                            Alternative
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {filteredComparisons.map((comparison, idx) => {
                        const statusStyle = statusColors[comparison.status];
                        const bonusDiff = comparison.new_bonus - comparison.current_bonus;
                        const diffPercentage = comparison.current_bonus > 0
                            ? ((bonusDiff / comparison.current_bonus) * 100).toFixed(0)
                            : "0";

                        return (
                            <div
                                key={idx}
                                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Header */}
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {comparison.casino}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {comparison.state}
                                            </p>
                                        </div>
                                        <span className={`${statusStyle} px-3 py-1 rounded-full text-xs font-medium border`}>
                                            {statusIcons[comparison.status]} {comparison.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Comparison Body */}
                                <div className="p-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {/* Current Offer */}
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                                                Current Offer
                                            </p>
                                            <p className="text-sm text-gray-900 mb-3 min-h-[40px]">
                                                {getOfferDisplay(comparison.current_offer) || "No current offer"}
                                            </p>
                                            <p className="text-2xl font-bold text-gray-700">
                                                ${safeGetNumber(comparison.current_bonus, 0).toFixed(0)}
                                            </p>
                                        </div>

                                        {/* Discovered Offer */}
                                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs font-medium text-blue-700 uppercase">
                                                    Discovered Offer
                                                </p>
                                                {bonusDiff !== 0 && (
                                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${bonusDiff > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                                        }`}>
                                                        {bonusDiff > 0 ? '+' : ''}{diffPercentage}%
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-900 mb-3 min-h-[40px]">
                                                {getOfferDisplay(comparison.new_offer)}
                                            </p>
                                            <p className="text-2xl font-bold text-blue-700">
                                                ${safeGetNumber(comparison.new_bonus, 0).toFixed(0)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Additional Details */}
                                    {comparison.new_details?.description && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                                                Details
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {comparison.new_details.description}
                                            </p>
                                            <div className="flex gap-2 mt-2">
                                                {comparison.new_details.bonus_amount > 0 && (
                                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                                                        Bonus: ${comparison.new_details.bonus_amount}
                                                    </span>
                                                )}
                                                {comparison.new_details.match_percent > 0 && (
                                                    <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                                                        Match: {comparison.new_details.match_percent}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

