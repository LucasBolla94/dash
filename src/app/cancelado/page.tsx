// src/app/cancelado/page.tsx
'use client'

import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function CancelPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white px-4 py-10 flex items-center justify-center">
      <div className="bg-white/10 p-8 rounded-2xl shadow-xl max-w-md text-center space-y-6">
        <XCircle className="text-red-400 mx-auto w-16 h-16" />
        <h1 className="text-3xl font-bold">Pagamento cancelado ❌</h1>
        <p className="text-white/80">
          Parece que o pagamento não foi finalizado. Se quiser, você pode tentar novamente.
        </p>
        <Link href="/dash/buy" className="inline-block bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl hover:bg-yellow-300 transition">
          Tentar novamente
        </Link>
      </div>
    </main>
  )
}
