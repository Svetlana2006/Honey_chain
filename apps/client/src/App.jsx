import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Sidebar, TopBar, BottomNav } from './components/Nav'
import RegisterBatch from './pages/RegisterBatch'
import Ledger        from './pages/Ledger'
import Verify        from './pages/Verify'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col md:flex-row min-h-screen bg-background">
        <Sidebar />
        <TopBar />

        <main className="flex-1 p-4 md:p-16 mt-20 md:mt-0 pb-24 md:pb-16 overflow-y-auto">
          <Routes>
            <Route path="/"       element={<RegisterBatch />} />
            <Route path="/ledger" element={<Ledger />} />
            <Route path="/verify" element={<Verify />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
