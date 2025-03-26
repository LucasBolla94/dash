'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { XCircle, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

const frases = [
  "Você estava tão perto... 😢",
  "Seus $PRV estão chorando no blockchain...",
  "A liberdade financeira fugiu por pouco...",
  "A Solana sentiu sua falta...",
  "Talvez agora não... mas e daqui a 5 minutos? 🤔",
  "Volte... ainda há tempo de se tornar lendário 🚀",
]

export default function CancelPage() {
  const [mensagemIndex, setMensagemIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMensagemIndex((prev) => (prev + 1) % frases.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 to-purple-900 text-white px-4 py-10 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 p-8 rounded-2xl shadow-xl max-w-md text-center space-y-6 relative overflow-hidden"
      >
        <XCircle className="text-red-400 mx-auto w-16 h-16 animate-pulse" />
        <h1 className="text-3xl font-bold text-red-300">Compra cancelada</h1>

        <motion.p
          key={mensagemIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
          className="text-white/70 h-12 flex items-center justify-center text-sm"
        >
          {frases[mensagemIndex]}
        </motion.p>

        <Link
          href="/dash/buy"
          className="inline-flex items-center gap-2 bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl hover:bg-yellow-300 transition hover:scale-105"
        >
          <RotateCcw className="w-4 h-4" />
          Tentar novamente
        </Link>
      </motion.div>
    </main>
  )
}
