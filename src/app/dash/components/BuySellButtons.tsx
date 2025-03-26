"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, ExternalLink } from "lucide-react";

export default function BuySellButtons() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto mb-6 flex flex-col sm:flex-row gap-4 justify-center"
    >
      <button
        onClick={() => router.push("/dash/buy")}
        className="flex items-center justify-center gap-2 bg-yellow-400 text-black px-6 py-4 rounded-xl font-bold text-lg shadow-md hover:bg-yellow-300 transition"
      >
        <ShoppingCart size={24} />
        Comprar PRV
      </button>

      <a
        href="https://orca.so"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-white text-purple-900 px-6 py-4 rounded-xl font-bold text-lg shadow-md hover:bg-gray-200 transition"
      >
        <ExternalLink size={24} />
        Vender PRV
      </a>
    </motion.div>
  );
}
