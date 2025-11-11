"use client";

import { useState, useEffect } from "react";
import { fetchFromAPI, fetchAllResearchRuns, triggerManualRun, fetchCurrentCasinos } from "@/lib/api";
import { ResearchResult, SupabaseResearchRun, CurrentCasino } from "@/types/research";
import MissingCasinos from "@/components/MissingCasinos";
import OfferComparisons from "@/components/OfferComparisons";
import ReportHistory from "@/components/ReportHistory";
import CurrentCasinos from "@/components/CurrentCasinos";

type ViewMode = "api" | "history" | "current";

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("api");
  const [data, setData] = useState<ResearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [researchRuns, setResearchRuns] = useState<SupabaseResearchRun[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<number | null>(null);
  const [isLoadingRuns, setIsLoadingRuns] = useState(false);

  const [isRunning, setIsRunning] = useState(false);

  const [currentCasinos, setCurrentCasinos] = useState<CurrentCasino[]>([]);
  const [isLoadingCurrentCasinos, setIsLoadingCurrentCasinos] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFromAPI("last");

      if (result) {
        setData(result);
      } else {
        setError("No data available");
      }
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const runManualResearch = async () => {
    setIsRunning(true);
    setError(null);

    try {
      // Trigger the manual run
      const success = await triggerManualRun();

      if (success) {
        // After manual run completes, fetch the last result
        const result = await fetchFromAPI("last");

        if (result) {
          setData(result);
        } else {
          setError("Research completed but failed to fetch results");
        }
      } else {
        setError("Failed to start research");
      }
    } catch (err) {
      setError("Failed to run research");
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const loadResearchRuns = async () => {
    setIsLoadingRuns(true);
    try {
      const runs = await fetchAllResearchRuns();
      setResearchRuns(runs);
    } catch (err) {
      console.error("Failed to load research runs:", err);
    } finally {
      setIsLoadingRuns(false);
    }
  };

  const handleSelectRun = (run: SupabaseResearchRun) => {
    setSelectedRunId(run.id);
    setData({ result_json: run.result_json });
    setError(null);
  };

  const loadCurrentCasinos = async () => {
    setIsLoadingCurrentCasinos(true);
    try {
      const casinos = await fetchCurrentCasinos();
      setCurrentCasinos(casinos);
    } catch (err) {
      console.error("Failed to load current casinos:", err);
    } finally {
      setIsLoadingCurrentCasinos(false);
    }
  };

  useEffect(() => {
    if (viewMode === "api") {
      fetchData();
    } else if (viewMode === "history") {
      loadResearchRuns();
    } else if (viewMode === "current") {
      loadCurrentCasinos();
    }
  }, [viewMode]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎰</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Casino AI Research Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                AI-powered casino discovery and promotional offer comparison
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* View Mode Toggle */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="inline-flex rounded-lg border border-gray-300 p-1">
                  <button
                    onClick={() => setViewMode("api")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === "api"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    Latest from API
                  </button>
                  <button
                    onClick={() => setViewMode("history")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === "history"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    Report History
                  </button>
                  <button
                    onClick={() => setViewMode("current")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${viewMode === "current"
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    Current Casinos
                  </button>
                </div>
              </div>
              {viewMode === "api" && (
                <div className="flex gap-2">
                  <button
                    onClick={runManualResearch}
                    disabled={isRunning || isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isRunning ? "Running Research..." : "Run New Research"}
                  </button>
                  <button
                    onClick={fetchData}
                    disabled={isLoading || isRunning}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? "Loading..." : "Refresh"}
                  </button>
                </div>
              )}
              {viewMode === "history" && (
                <button
                  onClick={loadResearchRuns}
                  disabled={isLoadingRuns}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoadingRuns ? "Loading..." : "Refresh List"}
                </button>
              )}
              {viewMode === "current" && (
                <button
                  onClick={loadCurrentCasinos}
                  disabled={isLoadingCurrentCasinos}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoadingCurrentCasinos ? "Loading..." : "Refresh Casinos"}
                </button>
              )}
            </div>
          </div>

          {/* Report History Sidebar */}
          {viewMode === "history" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ReportHistory
                  runs={researchRuns}
                  selectedRunId={selectedRunId}
                  onSelectRun={handleSelectRun}
                  isLoading={isLoadingRuns}
                />
              </div>
              <div className="lg:col-span-2 space-y-6">
                {!data && !isLoading && (
                  <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <p className="text-gray-500">Select a report from the history to view details</p>
                  </div>
                )}
                {data && (
                  <>
                    {/* Timestamp */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                      <p className="text-sm text-gray-600">
                        Report Date:{" "}
                        <span className="font-medium text-gray-900">
                          {new Date(data.result_json.timestamp).toLocaleString()}
                        </span>
                      </p>
                    </div>

                    {/* Missing Casinos */}
                    <MissingCasinos data={data.result_json.missing_casinos} />

                    {/* Offer Comparisons */}
                    <OfferComparisons comparisons={data.result_json.offer_comparisons} />
                  </>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {(isLoading || isRunning) && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                {isRunning ? "Running research... This may take a few minutes." : "Loading research data..."}
              </p>
              {isRunning && (
                <p className="mt-2 text-sm text-gray-500">
                  Discovering casinos and analyzing promotional offers across all states
                </p>
              )}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800 font-medium">Error: {error}</p>
              <p className="text-red-600 text-sm mt-1">
                Please check your configuration and try again.
              </p>
            </div>
          )}

          {/* Data Display for API Mode */}
          {viewMode === "api" && data && !isLoading && !isRunning && (
            <>
              {/* Timestamp */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                <p className="text-sm text-gray-600">
                  Last Updated:{" "}
                  <span className="font-medium text-gray-900">
                    {new Date(data.result_json.timestamp).toLocaleString()}
                  </span>
                </p>
              </div>

              {/* Missing Casinos */}
              <MissingCasinos data={data.result_json.missing_casinos} />

              {/* Offer Comparisons */}
              <OfferComparisons comparisons={data.result_json.offer_comparisons} />
            </>
          )}

          {/* Current Casinos View */}
          {viewMode === "current" && (
            <CurrentCasinos casinos={currentCasinos} isLoading={isLoadingCurrentCasinos} />
          )}
        </div>
      </main>
    </div>
  );
}
