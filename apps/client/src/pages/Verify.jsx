import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";
import { PageSpinner, HashPill, ScoreBar, Chip } from "../components/UI";

const JOURNEY_STEPS = (batch, block) => [
  {
    icon: "agriculture",
    title: "Harvested",
    sub: `Extracted from Hive ${batch.hiveId} by ${batch.beekeeperName}.`,
    date: batch.harvestDate,
  },
  {
    icon: "schema",
    title: "Ledger Registration",
    sub: `Batch committed to the immutable hash-chain as Block #${block?.blockIndex ?? "?"}.`,
    date: batch.registeredAt?.split("T")[0],
  },
  {
    icon: "science",
    title: "Quality Tested",
    sub: `Purity score: ${batch.purityScore}% — lab-integration ready.`,
    date: "—",
  },
  {
    icon: "qr_code_2",
    title: "Bottled & QR Sealed",
    sub: "Cryptographic QR code generated for consumer verification.",
    date: "—",
  },
];

function TimelineStep({ step, index }) {
  const isRight = index % 2 !== 0;
  return (
    <div
      className={`relative flex flex-col ${isRight ? "md:flex-row-reverse" : "md:flex-row"} items-start md:items-center justify-between mb-12 group`}
    >
      {/* Date label (desktop) */}
      <div
        className={`hidden md:block w-5/12 ${isRight ? "text-left pl-6" : "text-right pr-6"}`}
      >
        <p className="text-[11px] uppercase tracking-widest text-secondary mb-1">
          {step.date}
        </p>
      </div>
      {/* Dot */}
      <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-secondary border-4 border-surface-container-lowest shadow-sm md:-ml-2 z-10" />
      {/* Card */}
      <div
        className={`w-full md:w-5/12 pl-6 ${isRight ? "md:pr-6 md:pl-0" : ""} glass rounded-lg p-4 transition-transform group-hover:scale-[1.02]`}
      >
        <div className="md:hidden mb-2">
          <p className="text-[11px] uppercase tracking-widest text-secondary">
            {step.date}
          </p>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-on-surface-variant">
            {step.icon}
          </span>
          <h4 className="text-lg font-semibold text-on-surface">
            {step.title}
          </h4>
        </div>
        <p className="text-sm text-on-surface-variant">{step.sub}</p>
      </div>
    </div>
  );
}

export default function Verify() {
  const [searchParams] = useSearchParams();
  const batchId = searchParams.get("id");

  const [state, setState] = useState(batchId ? "loading" : "lookup"); // lookup | loading | error | result
  const [batch, setBatch] = useState(null);
  const [block, setBlock] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [isRepeatScan, setIsRepeatScan] = useState(false);
  const [verifiedAt, setVerifiedAt] = useState(null);
  const [issues, setIssues] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [lookupId, setLookupId] = useState("");

  useEffect(() => {
    if (batchId) loadBatch(batchId);
  }, [batchId]);

  async function loadBatch(id) {
    setState("loading");
    try {
      const [batchRes, verifyRes] = await Promise.all([
        api.getBatch(id),
        api.verifyChain(),
      ]);
      const result = verifyRes.results.find((r) => r.batchId === id);
      setBatch(batchRes.batch);
      setBlock(batchRes.block);
      setIsRepeatScan(batchRes.scan?.alreadyVerified ?? false);
      setVerifiedAt(batchRes.scan?.verifiedAt ?? null);
      setIsValid(result?.valid ?? true);
      setIssues(result?.issues ?? []);
      setState("result");
    } catch (e) {
      setErrMsg(
        e.message === "HTTP 404"
          ? "No batch with this ID exists on the ledger."
          : e.message,
      );
      setState("error");
    }
  }

  function handleLookup(e) {
    e.preventDefault();
    if (lookupId.trim())
      window.location.href = `/verify?id=${encodeURIComponent(lookupId.trim())}`;
  }

  /* ---- Trust score & grade ---- */
  const trust = batch
    ? Math.round(batch.purityScore * 0.6 + (isValid ? 40 : 0))
    : 0;
  const grade = trust >= 90 ? "A" : trust >= 75 ? "B" : "C";
  const gradeColor =
    trust >= 90
      ? "text-secondary"
      : trust >= 75
        ? "text-primary"
        : "text-error";
  const hasWarning = !isValid || isRepeatScan;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-16 py-10">
      {/* Hero */}
      <header className="text-center mb-10">
        <div
          className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6
          ${
            !hasWarning || state === "lookup" || state === "loading"
              ? "bg-secondary-container/20 anim-verified"
              : "bg-error-container anim-pulse-red"
          }`}
        >
          <span
            className={`material-symbols-outlined icon-fill text-5xl
            ${
              !hasWarning || state === "lookup" || state === "loading"
                ? "text-secondary"
                : "text-error"
            }`}
          >
            {state === "result" && hasWarning ? "gpp_bad" : "verified"}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-on-surface mb-2">
          {state === "result" && !isValid
            ? "⚠ Tampering Detected"
            : state === "result" && isRepeatScan
              ? "Possible Counterfeit"
              : "Verify Your Honey"}
        </h1>
        <p className="text-lg text-on-surface-variant">
          {state === "result" && !isValid
            ? "This batch record does not match the immutable ledger."
            : state === "result" && isRepeatScan
              ? "This QR code was already verified elsewhere."
              : "Cryptographically secured on the Honey Chain"}
        </p>

        {/* Trust score pill (shown when result) */}
        {state === "result" && (
          <div className="inline-flex items-center gap-3 glass-heavy px-6 py-3 rounded-full shadow-sm mt-5">
            <span className="text-[11px] uppercase tracking-widest text-on-surface-variant">
              Trust Score
            </span>
            <span className="text-2xl font-bold text-secondary">
              {trust}/100
            </span>
          </div>
        )}
      </header>

      {/* Lookup panel */}
      {state === "lookup" && (
        <div className="glass-heavy rounded-2xl p-6 max-w-md mx-auto shadow-sm mb-10">
          <p className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-3">
            Enter Batch ID
          </p>
          <form onSubmit={handleLookup} className="flex gap-2">
            <input
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              placeholder="Paste batch ID from QR…"
              className="flex-1 px-4 py-3 bg-surface-container-lowest border-b border-secondary/30 focus:border-secondary outline-none rounded-t-sm text-base text-on-surface placeholder:text-outline"
            />
            <button
              type="submit"
              className="flex items-center gap-1 bg-primary-container text-on-primary-container text-[11px] font-bold uppercase tracking-widest px-5 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[18px]">
                search
              </span>{" "}
              Verify
            </button>
          </form>
          <p className="text-[11px] uppercase tracking-widest text-outline mt-3">
            Or scan the QR code on the bottle — it opens this page
            automatically.
          </p>
        </div>
      )}

      {state === "loading" && <PageSpinner label="Fetching from ledger…" />}

      {state === "error" && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-5xl text-error">
            gpp_bad
          </span>
          <h2 className="mt-3 text-2xl font-bold text-error">
            Batch Not Found
          </h2>
          <p className="mt-2 text-on-surface-variant">{errMsg}</p>
          <a
            href="/verify"
            className="mt-6 inline-flex items-center gap-2 border border-secondary text-secondary text-[11px] font-bold uppercase px-6 py-3 rounded-full hover:bg-secondary/5 transition-colors"
          >
            Try Another ID
          </a>
        </div>
      )}

      {state === "result" && batch && (
        <>
          {/* Chain validity banner */}
          <div
            className={`rounded-2xl p-6 mb-10 flex flex-wrap items-center gap-4 shadow-sm
            ${
              !hasWarning
                ? "bg-secondary-container/20 border border-secondary/20"
                : "bg-error-container border border-error/30 anim-pulse-red"
            }`}
          >
            <span
              className={`material-symbols-outlined icon-fill text-4xl ${!hasWarning ? "text-secondary" : "text-error"}`}
            >
              {!hasWarning ? "verified" : "gpp_bad"}
            </span>
            <div>
              <h2
                className={`text-xl font-bold ${!hasWarning ? "text-secondary" : "text-error"}`}
              >
                {!isValid
                  ? "WARNING: Tampering Detected!"
                  : isRepeatScan
                    ? "Possible Counterfeit — Already Verified Elsewhere"
                    : "Chain Intact — Record Verified"}
              </h2>
              <p className="text-sm mt-1 text-on-surface-variant">
                {!isValid
                  ? issues.join(" | ")
                  : isRepeatScan
                    ? `First verified at ${new Date(verifiedAt).toLocaleString()}.`
                    : "First scan recorded. All fields match the immutable ledger."}
              </p>
            </div>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
            {/* Product details */}
            <section className="md:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm p-6 border border-secondary/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
              <h3 className="text-xl font-semibold text-on-surface mb-5">
                Product Details
              </h3>
              <div className="space-y-4">
                {[
                  ["Batch Number", batch.id],
                  ["Beekeeper", batch.beekeeperName],
                  ["Village", batch.beekeeperVillage || "—"],
                  ["Origin", batch.location],
                  ["Harvest Date", batch.harvestDate],
                  ["Quantity", `${batch.quantity} kg`],
                ].map(([l, v]) => (
                  <div
                    key={l}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pb-4 border-b border-surface-variant last:border-0"
                  >
                    <span className="text-sm text-on-surface-variant">{l}</span>
                    <span className="font-mono text-sm text-on-surface bg-surface-container-low px-3 py-1 rounded-md break-all">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex gap-2 flex-wrap">
                {[batch.floralSource, "KVIC Beekeeper", "Honey Mission"].map(
                  (t) => (
                    <Chip key={t}>{t}</Chip>
                  ),
                )}
              </div>
            </section>

            {/* Right column — beekeeper + location */}
            <section className="md:col-span-5 flex flex-col gap-5">
              {/* Beekeeper */}
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-5 border border-secondary/5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined icon-fill text-on-primary-container text-3xl">
                    person
                  </span>
                </div>
                <div>
                  <div className="font-bold text-lg text-on-surface">
                    {batch.beekeeperName}
                  </div>
                  <div className="text-sm text-on-surface-variant">
                    {batch.beekeeperVillage || "KVIC Beekeeper"}
                  </div>
                  <Chip color="green" className="mt-2 inline-block">
                    KVIC Certified
                  </Chip>
                </div>
              </div>

              {/* Location */}
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-5 border border-secondary/5 flex-1">
                <h3 className="text-lg font-semibold text-on-surface mb-3">
                  Hive Location
                </h3>
                <div className="rounded-lg bg-surface-container-high min-h-[140px] relative flex flex-col items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-5xl text-outline/50">
                    map
                  </span>
                  <p className="text-[11px] uppercase tracking-widest text-outline">
                    Origin Map
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 glass px-4 py-3 flex items-center gap-3 rounded-b-lg">
                    <span className="material-symbols-outlined icon-fill text-secondary">
                      pin_drop
                    </span>
                    <div>
                      <p className="font-mono text-xs text-on-surface">
                        {batch.location}
                      </p>
                      <p className="text-[11px] uppercase tracking-widest text-secondary">
                        Verified GPS Coordinates
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Journey timeline */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-on-surface mb-10 text-center">
              Journey of Your Honey
            </h2>
            <div className="max-w-2xl mx-auto relative pl-12 md:pl-0">
              <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-secondary/20" />
              {JOURNEY_STEPS(batch, block).map((step, i) => (
                <TimelineStep key={i} step={step} index={i} />
              ))}
            </div>
          </section>

          {/* Block detail + quality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Chain block */}
            <div className="bg-surface-container-lowest rounded-xl p-5 border border-secondary/10 shadow-sm">
              <h3 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">
                  link
                </span>{" "}
                Ledger Block
              </h3>
              {block && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Block #</span>
                    <strong className="text-primary">{block.blockIndex}</strong>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Timestamp</span>
                    <span className="font-mono text-xs">
                      {new Date(block.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">
                      Block Hash
                    </p>
                    <HashPill hash={block.hash} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">
                      Previous Hash
                    </p>
                    <HashPill hash={block.previousHash} dim />
                  </div>
                  {!isValid && (
                    <div className="bg-error-container text-on-error-container rounded-lg p-3 text-sm flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px]">
                        warning
                      </span>
                      <div>{issues.join(". ")}</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quality */}
            <div className="bg-surface-container-lowest rounded-xl p-5 border border-secondary/10 shadow-sm">
              <h3 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">
                  science
                </span>{" "}
                Quality Report
              </h3>
              <div className="text-center mb-5">
                <div className={`text-6xl font-black ${gradeColor}`}>
                  {grade}
                </div>
                <div className="text-[11px] uppercase tracking-widest text-on-surface-variant mt-1">
                  Honey Grade
                </div>
              </div>
              {[
                ["Purity", batch.purityScore, "%"],
                ["Trust Score", trust, "/100"],
              ].map(([l, v, unit]) => (
                <div key={l} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-on-surface-variant">{l}</span>
                    <strong
                      className={v > 80 ? "text-secondary" : "text-error"}
                    >
                      {v}
                      {unit}
                    </strong>
                  </div>
                  <ScoreBar value={v} />
                </div>
              ))}
              <div className="flex justify-between text-sm mt-3 items-center">
                <span className="text-on-surface-variant">Chain Status</span>
                <span
                  className={`flex items-center gap-1 text-[11px] font-bold uppercase ${isValid ? "text-secondary" : "text-error"}`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {isValid ? "verified" : "gpp_bad"}
                  </span>
                  {isValid ? "Verified" : "Tampered"}
                </span>
              </div>
              <p className="text-[11px] uppercase tracking-widest text-outline mt-4">
                Purity: simulated — lab-integration ready API stub.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pb-10">
            <a
              href="/ledger"
              className="bg-primary-container text-on-primary-container px-8 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest inline-flex items-center gap-2 shadow-sm hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-sm">
                account_tree
              </span>{" "}
              View Full Ledger
            </a>
          </div>
        </>
      )}
    </div>
  );
}
