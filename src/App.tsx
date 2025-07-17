import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StockDashboard } from './components/StockDashboard'
import { Toaster } from 'sonner'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <StockDashboard />
        <Toaster position="top-right" />
      </div>
    </QueryClientProvider>
  )
}

export default App