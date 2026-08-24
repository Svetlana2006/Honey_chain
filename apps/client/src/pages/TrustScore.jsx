import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api";
import { ErrorBanner, PageSpinner, ScoreBar } from "../components/UI";

const METRIC_STYLES = {
  purity: {
    icon: "science",
    border: "border-primary-container",
    iconBackground: "bg-primary-container/10",
    iconColor: "text-primary-container",
  },
  chainCompleteness: {
    icon: "link",
    border: "border-secondary",
    iconBackground: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  beekeeperHistory: {
    icon: "history",
    border: "border-tertiary-container",
    iconBackground: "bg-tertiary-container/10",
    iconColor: "text-tertiary-container",
  },
};

function MetricCard({ name, metric }) {
  const style = METRIC_STYLES[name];
  const progress = Math.min(100, Number(metric.score) || 0);

  return (
    <article
      className={`bg-surface-container-lowest p-5 rounded-lg border-l-4 ${style.border} shadow-sm flex items-start gap-4`}
    >
      <div
        className={`w-12 h-12 rounded-full ${style.iconBackground} flex items-center justify-center shrink-0`}
      >
        <span
          className={`material-symbols-outlined ${style.iconColor} text-2xl icon-fill`}
        >
          {style.icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h2 className="text-lg font-semibold text-on-background">
            {metric.label}
          </h2>
          <span
            className={`font-mono text-sm font-bold shrink-0 ${style.iconColor}`}
          >
            {metric.displayScore}
          </span>
        </div>
        <p className="text-sm leading-6 text-on-surface-variant mb-3">
          {metric.detail}
        </p>
        {name !== "beekeeperHistory" && <ScoreBar value={progress} />}
      </div>
    </article>
  );
}

export default function TrustScore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const batchId = searchParams.get("id");
  const [state, setState] = useState("loading");
  const [report, setReport] = useState(null);
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setState("loading");
    setError("");

    Promise.all([api.getBatches(), api.getTrustScore(batchId)])
      .then(([batchData, reportData]) => {
        if (!active) return;
        setBatches(batchData);
        setReport(reportData);
        setState("result");
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message);
        setState("error");
      });

    return () => {
      active = false;
    };
  }, [batchId]);

  if (state === "loading")
    return <PageSpinner label="Building trust score report..." />;

  if (state === "error") {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <ErrorBanner message={error || "Unable to load trust score report."} />
        <Link
          to="/verify"
          className="mt-6 inline-flex items-center gap-2 text-secondary text-sm font-bold"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>{" "}
          Verify another batch
        </Link>
      </div>
    );
  }

  const { metrics, batch } = report;
  const score = report.overallScore;

  function handleBatchChange(event) {
    setSearchParams({ id: event.target.value });
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-2 md:px-10 py-8 md:py-10">
      <header className="text-center mb-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-secondary font-bold mb-3">
          Honey Chain / Verified Analysis
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-on-background mb-3">
          Batch Verification Report
        </h1>
        <p className="text-lg leading-7 text-on-surface-variant max-w-2xl mx-auto">
          Comprehensive analysis of Batch #{report.batchLabel}. Verified through
          blockchain immutability and batch quality records.
        </p>
      </header>

      <div className="max-w-xl mx-auto mb-8">
        <label
          htmlFor="trust-score-batch"
          className="block text-[11px] uppercase tracking-widest text-on-surface-variant font-bold mb-2"
        >
          Choose batch ID
        </label>
        <div className="relative">
          <select
            id="trust-score-batch"
            value={report.batchId}
            onChange={handleBatchChange}
            className="w-full appearance-none bg-surface-container-lowest border border-secondary/20 rounded-lg px-4 py-3 pr-10 text-sm font-mono text-on-surface focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
          >
            {batches.map((availableBatch) => (
              <option key={availableBatch.id} value={availableBatch.id}>
                {availableBatch.id} - {availableBatch.beekeeperName} (
                {availableBatch.floralSource})
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-secondary">
            expand_more
          </span>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-5 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-xl shadow-sm -z-10 border border-secondary/5" />

        <div className="md:col-span-5 bg-surface-container-lowest rounded-xl p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden border border-secondary/10 shadow-sm min-h-[500px]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl" />
          <div className="text-center relative z-10">
            <span className="block text-[11px] uppercase tracking-[0.2em] text-secondary font-bold mb-4">
              Overall Trust Score
            </span>
            <div className="w-48 h-48 rounded-full border-4 border-secondary flex items-center justify-center bg-surface-container-lowest/80 mx-auto mb-6 shadow-inner relative">
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 100 100"
                aria-hidden="true"
              >
                <circle
                  className="text-secondary-fixed-dim/40"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="46"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <circle
                  className="text-secondary"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="46"
                  stroke="currentColor"
                  strokeDasharray="289"
                  strokeDashoffset={289 - (289 * score) / 100}
                  strokeLinecap="round"
                  strokeWidth="4"
                />
              </svg>
              <span className="text-7xl font-bold text-secondary">
                {report.grade}
              </span>
            </div>
            <h2 className="text-3xl font-semibold text-on-background">
              {report.summary}
            </h2>
            <p className="text-base text-on-surface-variant mt-2 max-w-xs">
              {report.summaryDetail}
            </p>
          </div>
          <div className="mt-10 flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20">
            <span className="material-symbols-outlined text-secondary icon-fill">
              verified
            </span>
            <span className="text-[11px] uppercase tracking-widest text-secondary font-bold">
              Blockchain Verified
            </span>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col gap-3 justify-center p-3 md:p-6">
          {Object.entries(metrics).map(([name, metric]) => (
            <MetricCard key={name} name={name} metric={metric} />
          ))}
        </div>
      </section>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="bg-primary-container text-on-primary-container text-[11px] uppercase tracking-widest font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined icon-fill">download</span>
          Download Certificate
        </button>
        <Link
          to="/ledger"
          className="border border-secondary text-secondary text-[11px] uppercase tracking-widest font-bold px-6 py-3 rounded-lg hover:bg-secondary/5 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">dataset</span>
          View Raw Ledger Data
        </Link>
      </div>

      {batch && (
        <p className="text-center text-[11px] uppercase tracking-widest text-outline mt-6">
          {batch.beekeeperName} / {batch.floralSource} / {batch.harvestDate}
        </p>
      )}
    </div>
  );
}
