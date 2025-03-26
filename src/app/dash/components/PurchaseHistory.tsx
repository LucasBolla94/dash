"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface Compra {
  valor: number;
  data: string; // ISO string
}

interface Props {
  compras: Compra[];
}

export default function PurchaseHistory({ compras }: Props) {
  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatarValor = (valor: number) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  if (!compras || compras.length === 0) {
    return (
      <div className="max-w-xl mx-auto mb-6 text-center text-gray-300">
        <p>Você ainda não realizou nenhuma compra.</p>
      </div>
    );
  }

  const comprasOrdenadas = [...compras].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 rounded-2xl shadow-md p-6 max-w-xl mx-auto mb-6"
    >
      <h2 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
        <Clock size={24} />
        Histórico de Compras
      </h2>

      <ul className="space-y-4">
        {comprasOrdenadas.map((compra, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-white/5 p-4 rounded-xl text-lg text-white"
          >
            <span className="text-gray-200">{formatarData(compra.data)}</span>
            <span className="font-bold text-yellow-400">
              {formatarValor(compra.valor)}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
