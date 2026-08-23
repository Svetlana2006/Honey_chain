import { useState, useEffect } from 'react'
import { api } from '../api'
import { Card, LiveDot, ScoreBar, ErrorBanner } from '../components/UI'

const FLORAL_OPTIONS = ['Mixed flora','Mustard (Sarson)','Litchi','Sunflower','Jamun','Eucalyptus','Neem','Acacia (Kikar)']
const NOTES = ['Raw','Wildflower','Unfiltered','Organic']

function InputRow({ icon, label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] uppercase tracking-widest text-on-surface-variant">{label}</label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">{icon}</span>
        {children}
      </div>
    </div>
  )
}

function RecentBatch({ batch }) {
  return (
    <div className="bg-surface-container-lowest p-3 rounded-lg border border-secondary/10 border-l-4 border-l-secondary flex justify-between items-center shadow-sm">
      <div>
        <div className="font-mono text-sm text-on-surface">{batch.id.substring(0, 8)}…</div>
        <div className="text-[11px] uppercase tracking-widest text-on-surface-variant mt-1">{batch.harvestDate} · {batch.quantity}kg</div>
      </div>
      <div className="flex items-center gap-1 text-secondary bg-secondary-container px-2 py-1 rounded text-[11px] font-bold uppercase">
        <span className="material-symbols-outlined text-[13px]">verified</span> Verified
      </div>
    </div>
  )
}

export default function RegisterBatch() {
  const [recentBatches, setRecentBatches] = useState([])
  const [activeNotes, setActiveNotes]     = useState(['Raw'])
  const [photoLabel, setPhotoLabel]       = useState('Drag & drop or click to browse')
  const [submitting, setSubmitting]       = useState(false)
  const [error, setError]                 = useState('')
  const [result, setResult]               = useState(null)

  useEffect(() => {
    api.getBatches().then(b => setRecentBatches(b.slice(-3).reverse())).catch(() => {})
  }, [result])

  function toggleNote(note) {
    setActiveNotes(prev => prev.includes(note) ? prev.filter(n => n !== note) : [...prev, note])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.target)

    const required = ['beekeeperName', 'hiveId', 'location', 'harvestDate', 'quantity']
    for (const f of required) {
      if (!fd.get(f)?.toString().trim()) {
        setError(`Please fill in: ${f.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return
      }
    }

    setSubmitting(true)
    try {
      const data = await api.registerBatch(fd)
      setResult(data)
      e.target.reset()
      e.target.harvestDate.value = new Date().toISOString().split('T')[0]
      setPhotoLabel('Drag & drop or click to browse')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10">

      {/* Page header */}
      <div className="pt-6 md:pt-0">
        <h2 className="text-4xl md:text-5xl font-bold text-primary">Register New Batch</h2>
        <p className="text-base text-on-surface-variant mt-2">Log your harvest on the immutable ledger.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ---- Form ---- */}
        <div className="lg:col-span-8 glass rounded-xl p-6">
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <InputRow icon="person" label="Beekeeper Name *">
                <input className="honey-input" name="beekeeperName" type="text" placeholder="e.g. Ramesh Kumar" required />
              </InputRow>

              <InputRow icon="home_pin" label="Village / District">
                <input className="honey-input" name="beekeeperVillage" type="text" placeholder="e.g. Sitapur, UP" />
              </InputRow>

              <InputRow icon="location_on" label="GPS Location / Place *">
                <input className="honey-input" name="location" type="text" placeholder="e.g. 27.89° N, 80.97° E" required />
              </InputRow>

              <InputRow icon="calendar_today" label="Harvest Date *">
                <input className="honey-input" name="harvestDate" type="date"
                  defaultValue={new Date().toISOString().split('T')[0]} required />
              </InputRow>

              <InputRow icon="tag" label="Hive ID *">
                <input className="honey-input font-mono" name="hiveId" type="text" placeholder="e.g. HIVE-UP-042" required />
              </InputRow>

              <InputRow icon="scale" label="Quantity (kg) *">
                <input className="honey-input" name="quantity" type="number" placeholder="0.00" min="0.1" step="0.1" required />
              </InputRow>

              <InputRow icon="local_florist" label="Floral Source">
                <select className="honey-input" name="floralSource">
                  {FLORAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </InputRow>

              {/* Photo upload */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-widest text-on-surface-variant">Harvest Evidence</label>
                <label className="border-2 border-dashed border-secondary/20 rounded-lg p-4 flex flex-col items-center text-center bg-surface-container-lowest hover:bg-surface-container-low cursor-pointer transition-colors">
                  <input type="file" name="photo" accept="image/*" className="hidden"
                    onChange={e => setPhotoLabel(e.target.files[0]?.name || 'Drag & drop or click to browse')} />
                  <span className="material-symbols-outlined text-4xl text-primary/40 mb-1">cloud_upload</span>
                  <p className="text-sm text-on-surface-variant">{photoLabel}</p>
                  <p className="text-[11px] uppercase tracking-widest text-outline mt-1">JPEG, PNG up to 5MB</p>
                </label>
              </div>

            </div>

            {/* Floral chips */}
            <div className="mt-6 space-y-2">
              <p className="text-[11px] uppercase tracking-widest text-on-surface-variant">Floral Notes</p>
              <div className="flex flex-wrap gap-2">
                {NOTES.map(note => (
                  <button key={note} type="button" onClick={() => toggleNote(note)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all
                      ${activeNotes.includes(note)
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-surface-container-high text-on-surface-variant border-transparent hover:bg-surface-variant'}`}>
                    {note}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="mt-4"><ErrorBanner message={error} /></div>}

            <div className="pt-4 flex justify-end mt-2">
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 bg-primary-container text-on-primary-container text-[11px] font-bold uppercase tracking-widest px-6 py-3 rounded-full hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50">
                <span className="material-symbols-outlined text-[18px]">link</span>
                {submitting ? 'Writing to chain…' : 'Write to Blockchain'}
              </button>
            </div>
          </form>
        </div>

        {/* ---- Right panel ---- */}
        <div className="lg:col-span-4 space-y-5">

          {/* Recent batches */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-primary">Recent Batches</h3>
              <LiveDot />
            </div>
            <div className="space-y-3">
              {recentBatches.length === 0
                ? <p className="text-[11px] uppercase tracking-widest text-on-surface-variant text-center py-4">No batches yet</p>
                : recentBatches.map(b => <RecentBatch key={b.id} batch={b} />)}
            </div>
            <a href="/ledger" className="mt-4 w-full block text-center text-secondary text-[11px] font-bold uppercase tracking-widest py-2 border border-secondary/20 rounded-lg hover:bg-surface-variant/50 transition-colors">
              View Full Ledger →
            </a>
          </Card>

          {/* QR result */}
          {result && (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-secondary">qr_code_2</span>
                <h3 className="text-xl font-bold text-primary">Batch QR Code</h3>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img src={result.qrCode} alt="QR Code" className="rounded-lg border border-secondary/10 bg-white p-2" width={180} />
                <p className="text-[11px] uppercase tracking-widest text-on-surface-variant">Scan to verify authenticity</p>
                <p className="font-mono text-xs text-outline break-all text-center">{result.batch.id}</p>
                <div className="w-full space-y-2">
                  <a href={`/verify?id=${result.batch.id}`} target="_blank" rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 border border-secondary text-secondary text-[11px] font-bold uppercase rounded-full hover:bg-secondary/5 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span> Open Verify Page
                  </a>
                  <button onClick={() => {
                    const a = document.createElement('a')
                    a.href = result.qrCode
                    a.download = `honey-${result.batch.id.substring(0,8)}.png`
                    a.click()
                  }} className="w-full flex items-center justify-center gap-2 py-2 bg-surface-container text-on-surface-variant text-[11px] font-bold uppercase rounded-full hover:bg-surface-variant transition-colors">
                    <span className="material-symbols-outlined text-[16px]">download</span> Download QR
                  </button>
                </div>
              </div>
              {/* Hash + purity */}
              <div className="mt-4 pt-4 border-t border-secondary/10 space-y-3">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">Block Hash</p>
                  <p className="font-mono text-[11px] text-secondary break-all">{result.block.hash}</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-on-surface-variant">Purity Score</span>
                    <strong className="text-secondary">{result.batch.purityScore}%</strong>
                  </div>
                  <ScoreBar value={result.batch.purityScore} />
                </div>
              </div>
            </Card>
          )}

        </div>
      </div>
    </div>
  )
}
