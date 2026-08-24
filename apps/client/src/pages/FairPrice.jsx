import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api'
import { ErrorBanner, PageSpinner } from '../components/UI'

const FACTORS = [
  { key: 'floralRarity', label: 'Floral Rarity', icon: 'local_florist', suffix: 'x' },
  { key: 'purityScore', label: 'Purity Score', icon: 'science', suffix: '%' },
  { key: 'batchSizeKg', label: 'Batch Size', icon: 'scale', suffix: ' kg' },
]

export default function FairPrice() {
  const [searchParams, setSearchParams] = useSearchParams()
  const batchId = searchParams.get('id')
  const [batches, setBatches] = useState([])
  const [suggestion, setSuggestion] = useState(null)
  const [state, setState] = useState('loading')
  const [error, setError] = useState('')
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    let active = true
    setState('loading')
    setError('')
    setAccepted(false)

    Promise.all([api.getBatches(), api.getFairPrice(batchId)])
      .then(([batchData, priceData]) => {
        if (!active) return
        setBatches(batchData)
        setSuggestion(priceData)
        setState('result')
      })
      .catch((err) => {
        if (!active) return
        setError(err.message)
        setState('error')
      })

    return () => { active = false }
  }, [batchId])

  if (state === 'loading') return <PageSpinner label="Calculating fair price..." />
  if (state === 'error') return <div className="max-w-2xl mx-auto py-16"><ErrorBanner message={error || 'Unable to load fair price suggestion.'} /></div>

  const { batch, formula, market } = suggestion
  const price = suggestion.suggestedPricePerKg

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-10 py-8 md:py-10">
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="flex items-center gap-2 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[11px] uppercase tracking-widest font-bold">
            <span className="w-2 h-2 rounded-full bg-secondary anim-pulse-green" /> Live Market Data
          </span>
          <span className="font-mono text-xs text-on-surface-variant">Batch ID: #{suggestion.batchId}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-on-background mb-2">Fair Price Suggestion</h1>
        <p className="text-lg leading-7 text-on-surface-variant max-w-2xl">Algorithmically derived floor price based on verified botanical purity, batch volume, and Indian market reference data.</p>
      </header>

      <div className="max-w-2xl mb-8">
        <label htmlFor="fair-price-batch" className="block text-[11px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Select batch to price</label>
        <select id="fair-price-batch" value={suggestion.batchId} onChange={event => setSearchParams({ id: event.target.value })}
          className="w-full bg-surface-container-lowest border border-secondary/20 rounded-lg px-4 py-3 text-sm font-mono text-on-surface focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20">
          {batches.map(item => <option key={item.id} value={item.id}>{item.id} - {item.beekeeperName} ({item.floralSource})</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <section className="md:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm p-6 md:p-8 border border-surface-variant relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="relative z-10 flex flex-wrap justify-between items-start gap-6 mb-8">
            <div><p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Suggested Floor Price</p><div className="flex items-baseline gap-2"><span className="text-5xl md:text-6xl font-bold text-on-background">₹{price.toLocaleString('en-IN')}</span><span className="text-lg text-on-surface-variant">/ kg</span></div></div>
            <div className="bg-surface-container rounded-lg p-4 text-right"><span className="block text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">Total Batch Value ({formula.batchSizeKg} kg)</span><span className="text-2xl font-bold text-primary">₹{suggestion.totalBatchValue.toLocaleString('en-IN')}</span></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10 mb-8">
            {FACTORS.map(factor => <div key={factor.key} className="glass rounded-lg p-3 flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary"><span className="material-symbols-outlined">{factor.icon}</span></div><div><span className="block text-[10px] uppercase tracking-widest text-on-surface-variant">{factor.label}</span><span className="font-mono text-sm font-semibold text-on-background">{formula[factor.key]}{factor.suffix}</span></div></div>)}
          </div>
          <div className="mt-auto flex flex-wrap gap-3 relative z-10 border-t border-surface-variant pt-6">
            <button type="button" onClick={() => setAccepted(true)} className="flex-1 min-w-[180px] bg-primary-container text-on-primary-container hover:opacity-90 py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition-opacity shadow-sm"><span className="material-symbols-outlined icon-fill">check_circle</span>{accepted ? 'Suggestion Accepted' : 'Accept Suggestion'}</button>
            <a href="https://www.enam.gov.in/" target="_blank" rel="noreferrer" className="flex-1 min-w-[180px] border border-secondary text-secondary hover:bg-secondary/5 py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition-colors"><span className="material-symbols-outlined">storefront</span> Link to Market</a>
          </div>
        </section>

        <aside className="md:col-span-4 bg-surface-container-low rounded-xl p-6 border border-secondary/10 flex flex-col">
          <h2 className="text-lg font-semibold text-on-background mb-5 flex items-center gap-2"><span className="material-symbols-outlined text-secondary">trending_up</span>Market Comparison</h2>
          <div className="space-y-3 flex-1"><div className="p-3 bg-surface-container-lowest rounded-lg border-l-4 border-surface-variant flex justify-between items-center"><div><span className="block text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">Reference market</span><span className="font-mono text-sm font-semibold">{market.range}</span></div><span className="material-symbols-outlined text-on-surface-variant">arrow_forward</span></div><div className="p-3 bg-surface-container-lowest rounded-lg border-l-4 border-secondary flex justify-between items-center"><div><span className="block text-[11px] uppercase tracking-widest text-secondary font-bold mb-1">Your verified batch</span><span className="font-mono text-base font-bold text-secondary">₹{price.toLocaleString('en-IN')} / kg</span></div><span className="material-symbols-outlined text-secondary">arrow_upward</span></div></div>
          <p className="text-xs text-on-surface-variant mt-5 leading-5">{market.note} The recommendation rewards verified purity and floral scarcity while applying a volume adjustment for larger lots.</p>
        </aside>
      </div>
      <p className="text-center text-[11px] uppercase tracking-widest text-outline mt-6">{batch.beekeeperName} / {batch.floralSource} / {batch.harvestDate}</p>
    </div>
  )
}