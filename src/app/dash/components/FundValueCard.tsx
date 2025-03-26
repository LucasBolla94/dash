"use client";

import { motion } from "framer-motion";
import { Banknote } from "lucide-react";

interface Props {
  patrimonio: number | null;
}

export default function FundValueCard({ patrimonio }: Props) {
  const formatarReal = (valor: number) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 border border-yellow-400/30 p-6 rounded-2xl shadow-lg max-w-xl mx-auto mb-6 flex items-center gap-6"
    >
      <div className="bg-yellow-400 text-purple-900 rounded-full p-4 shadow-md">
        <Banknote size={40} />
      </div>

      <div>
        <h2 className="text-xl text-yellow-300 font-semibold mb-1">Patrimônio do Fundo</h2>
        <p className="text-3xl font-bold text-white">
          {patrimonio !== null ? formatarReal(patrimonio) : "Carregando..."}
        </p>
        <p className="text-sm text-gray-300">Valor atualizado periodicamente pelo administrador</p>
      </div>
    </motion.div>
  );
}
