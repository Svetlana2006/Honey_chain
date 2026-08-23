import { useState, useEffect, useCallback } from 'react'
import { api } from '../api'
import { LiveDot, PageSpinner, ErrorBanner, HashPill } from '../components/UI'

const TAMPERABLE = ['quantity','location','harvestDate','beekeeperName','hiveId','purityScore']

/* ---------- Block card ---------- */
function BlockCard({ block, batch, result, isLatest }) {
  const isTampered = !result?.valid

  function fieldCls(field) {
    if (!isTampered) return 'text-on-surface'
    const live  = String(batch?.[field] ?? '')
    const chain = String(block.data[field] ?? '')
    return live !== chain
      ? 'text-error line-through'
      : 'text-on-surface'
  }

  return (
    <div className={`relative rounded-2xl p-6 overflow-hidden transition-all duration-400
      border-l-4 shadow-sm
      ${isTampered
        ? 'bg-error-container/70 backdrop-blur-md border-l-error anim-shake'
        : 'glass border-l-secondary'}`}>

      {isLatest && (
        <div className="absolute top-0 right-0 bg-primary-container text-on-primary-container px-3 py-1 rounded-bl-lg text-[11px] font-bold uppercase tracking-widest flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">check_circle</span> Current Tip
        </div>
      )}

      <div className="flex justify-between items-center border-b border-surface-variant pb-4 mb-4">
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined ${isTampered ? 'text-error' : 'text-secondary'}`}>
            inventory_2
          </span>
          <h3 className="text-xl font-semibold text-on-surface">Block #{block.blockIndex}</h3>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center gap-1
            ${isTampered
              ? 'bg-error-container text-on-error-container'
              : 'bg-secondary-container text-on-secondary-container'}`}>
            <span className="material-symbols-outlined text-[12px]">{isTampered ? 'warning' : 'verified'}</span>
            {isTampered ? 'Tampered' : 'Valid'}
          </span>
        </div>
        <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-3 py-1 rounded-md hidden sm:block">
          {new Date(block.timestamp).toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {[
          ['Beekeeper',    'beekeeperName'],
          ['Hive ID',      'hiveId'],
          ['Location',     'location'],
          ['Quantity',     'quantity'],
          ['Harvest Date', 'harvestDate'],
          ['Purity Score', 'purityScore'],
        ].map(([label, field]) => (
          <div key={field}>
            <p className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">{label}</p>
            <p className={`text-sm font-medium ${fieldCls(field)}`}>
              {batch?.[field] ?? '—'}{field === 'purityScore' && batch?.[field] ? '%' : ''}
              {field === 'quantity' && batch?.[field] ? ' kg' : ''}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest p-3 rounded-lg space-y-2">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">Block Hash</p>
          <HashPill hash={block.hash} />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">Previous Hash</p>
          <HashPill hash={block.previousHash} dim />
        </div>
      </div>

      {isTampered && result.issues.length > 0 && (
        <div className="mt-3 bg-error-container text-on-error-container rounded-lg p-3 text-sm flex items-start gap-2">
          <span className="material-symbols-outlined text-[16px] mt-0.5 flex-shrink-0">gpp_bad</span>
          <ul>{result.issues.map((iss, i) => <li key={i}>{iss}</li>)}</ul>
        </div>
      )}
    </div>
  )
}

/* ---------- Tamper panel ---------- */
function TamperPanel({ batches, onTampered, log }) {
  const [batchId,  setBatchId]  = useState('')
  const [field,    setField]    = useState('quantity')
  const [newValue, setNewValue] = useState('')
  const [loading,  setLoading]  = useState(false)

  async function execute() {
    if (!batchId || !newValue.trim()) { alert('Select a batch and enter a value.'); return }
    setLoading(true)
    try {
      await api.tamperBatch(batchId, field, newValue)
      onTampered(`TAMPER: ${batchId.substring(0,8)}… field="${field}" → "${newValue}"`, true)
      setNewValue('')
    } catch(e) {
      onTampered(`ERROR: ${e.message}`, false)
    } finally { setLoading(false) }
  }

  return (
    <aside className="space-y-5">
      {/* Main tamper card */}
      <div className="glass-heavy rounded-2xl p-6 shadow-sm">
        <h4 className="text-xl font-semibold text-on-surface mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-error">warning</span> Tamper Panel
        </h4>
        <p className="text-sm text-on-surface-variant mb-5">
          Edits the <strong>database</strong> without updating the <strong>ledger</strong> — simulates a bad actor.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-1 block">Select Batch</label>
            <select value={batchId} onChange={e => setBatchId(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-secondary/20 rounded-md text-sm outline-none focus:border-secondary">
              <option value="">— choose a batch —</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.id.substring(0,8)}… · {b.beekeeperName} · {b.harvestDate}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-1 block">Field to Edit</label>
            <select value={field} onChange={e => setField(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-secondary/20 rounded-md text-sm outline-none focus:border-secondary">
              {TAMPERABLE.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-1 block">New (Fake) Value</label>
            <input value={newValue} onChange={e => setNewValue(e.target.value)}
              placeholder="Enter fake value…"
              className="w-full px-3 py-2.5 bg-white border border-secondary/20 rounded-md text-sm outline-none focus:border-secondary" />
          </div>
        </div>

        <button onClick={execute} disabled={loading}
          className="mt-5 w-full flex items-center justify-center gap-2 bg-error-container text-on-error-container text-[11px] font-bold uppercase tracking-widest py-3 rounded-full hover:bg-error/20 transition-colors disabled:opacity-50">
          <span className="material-symbols-outlined text-[18px]">edit</span>
          {loading ? 'Tampering…' : 'Execute Tamper'}
        </button>

        {/* Log */}
        <div className="mt-4 bg-surface-container-low rounded-lg p-3 border border-secondary/10 font-mono text-[11px] max-h-40 overflow-y-auto space-y-1">
          {log.length === 0
            ? <span className="text-outline">// Action log</span>
            : log.map((entry, i) => (
              <div key={i} className={entry.isError ? 'text-error' : 'text-secondary'}>
                [{entry.ts}] {entry.msg}
              </div>
            ))}
        </div>
      </div>

      {/* How it works */}
      <div className="glass rounded-2xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-on-surface mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">info</span> How it works
        </h4>
        <p className="text-sm text-on-surface-variant mb-3">
          Each block contains a SHA-256 hash of its data. Modifying any field changes the hash, breaking the chain link to all subsequent blocks.
        </p>
        <div className="bg-surface-container-low rounded-lg p-3 border-l-2 border-primary-container text-sm text-on-surface">
          The tamper endpoint writes only to <strong>batches.json</strong> — not <strong>ledger.json</strong>. The next verify call catches the mismatch instantly.
        </div>
      </div>
    </aside>
  )
}

/* ---------- Page ---------- */
export default function Ledger() {
  const [ledger,   setLedger]   = useState([])
  const [batches,  setBatches]  = useState([])
  const [verify,   setVerify]   = useState({ chainIntact: true, results: [] })
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [log,      setLog]      = useState([])

  const load = useCallback(async () => {
    try {
      const [l, b, v] = await Promise.all([api.getLedger(), api.getBatches(), api.verifyChain()])
      setLedger(l); setBatches(b); setVerify(v)
    } catch(e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  function addLog(msg, isError = false) {
    setLog(prev => [...prev, { msg, isError, ts: new Date().toLocaleTimeString() }])
  }

  async function handleTampered(msg, isError) {
    addLog(msg, isError)
    if (!isError) await load()
  }

  const batchMap = Object.fromEntries(batches.map(b => [b.id, b]))
  const verifyMap = Object.fromEntries(verify.results.map(r => [r.blockIndex, r]))
  const isIntact  = verify.chainIntact
  const brokenAt  = verify.brokenAt ?? []

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Page header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 lg:pt-0">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-secondary mb-2">Admin Demo Panel</p>
          <h2 className="text-4xl md:text-5xl font-bold text-on-surface">Tamper-Detection Simulation</h2>
          <p className="text-lg text-on-surface-variant mt-3 max-w-2xl">
            Edit a historical record to observe the cryptographic cascade failure.
          </p>
        </div>

        {/* Chain status widget */}
        <div className={`glass-heavy p-4 rounded-xl flex items-center gap-4 min-w-[220px] shadow-sm transition-all duration-300
          ${!isIntact ? 'bg-error-container/70' : ''}`}>
          <div className={`w-4 h-4 rounded-full flex-shrink-0 ${isIntact ? 'anim-pulse-green bg-secondary' : 'anim-pulse-red bg-error'}`} />
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-widest text-on-surface-variant">Chain Status</p>
            <p className={`text-xl font-bold ${isIntact ? 'text-secondary' : 'text-error'}`}>
              {loading ? 'Loading…' : isIntact ? 'Secure' : `Breach Detected`}
            </p>
            {!isIntact && <p className="text-[11px] text-error">Block{brokenAt.length > 1 ? 's' : ''} #{brokenAt.join(', #')} tampered</p>}
          </div>
          <button onClick={load} className="text-outline hover:text-secondary transition-colors" title="Refresh">
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </header>

      {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chain column */}
        <div className="lg:col-span-8">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xl font-semibold text-on-background">Live Ledger</h3>
            <LiveDot />
            <span className="ml-auto text-[11px] uppercase tracking-widest text-outline">{ledger.length} blocks</span>
          </div>

          {loading ? <PageSpinner label="Loading ledger…" /> : ledger.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-5xl text-outline">link_off</span>
              <p className="mt-3 text-on-surface-variant">No batches registered yet.</p>
              <a href="/" className="mt-4 inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-5 py-2 rounded-full text-sm font-bold">
                Register First Batch
              </a>
            </div>
          ) : (
            <div>
              {[...ledger].reverse().map((block, i) => {
                const result   = verifyMap[block.blockIndex]
                const batch    = batchMap[block.batchId]
                const isLatest = block.blockIndex === ledger.length - 1
                const isLast   = i === ledger.length - 1
                const isTampered = !result?.valid

                return (
                  <div key={block.blockIndex}>
                    <BlockCard block={block} batch={batch} result={result} isLatest={isLatest} />
                    {!isLast && <div className={`chain-line ${isTampered ? 'broken' : ''}`} />}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Tamper sidebar */}
        <div className="lg:col-span-4">
          <TamperPanel batches={batches} onTampered={handleTampered} log={log} />
        </div>
      </div>
    </div>
  )
}
