// Central API helper — all fetch calls go through here
// Vite proxies /api → http://localhost:3000

const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

export const api = {
  getBatches:    ()          => request('/batches'),
  getBatch:      (id)        => request(`/batches/${id}`),
  registerBatch: (formData)  => request('/batches', { method: 'POST', body: formData }),
  tamperBatch:   (id, field, newValue) =>
    request(`/batches/${id}/tamper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, newValue }),
    }),
  getLedger:     ()          => request('/ledger'),
  verifyChain:   ()          => request('/ledger/verify'),
}
