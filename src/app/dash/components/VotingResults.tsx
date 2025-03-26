"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { BarChart } from "lucide-react";

export default function VotingResults() {
  const [votacoes, setVotacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVotacoesEncerradas = async () => {
      const q = query(
        collection(db, "votacoes"),
        where("status", "==", false),
        orderBy("dataFim", "desc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVotacoes(lista);
      setLoading(false);
    };

    fetchVotacoesEncerradas();
  }, []);

  const getMaisVotado = (resultados: any) => {
    const opcoes = Object.entries(resultados);
    const maior = opcoes.reduce(
      (a: any, b: any) => (a[1] > b[1] ? a : b),
      ["", 0]
    );
    return maior[0];
  };

  if (loading) return null;
  if (!votacoes.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white/10 p-6 rounded-2xl shadow-md max-w-3xl mx-auto mb-6"
    >
      <h2 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
        <BarChart size={24} />
        Resultados das Últimas Votações
      </h2>

      <div className="space-y-6">
        {votacoes.map((votacao, idx) => {
          const maisVotado = getMaisVotado(votacao.resultados);

          return (
            <div
              key={idx}
              className="bg-white/5 rounded-xl p-4 space-y-2 text-white"
            >
              <h3 className="text-xl font-semibold text-yellow-300">
                {votacao.titulo}
              </h3>
              <p className="text-gray-300 text-sm">{votacao.descricao}</p>

              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 text-center">
                {["sim", "nao", "anular"].map((opcao) => (
                  <li
                    key={opcao}
                    className={`p-3 rounded-xl font-bold ${
                      maisVotado === opcao
                        ? "bg-yellow-400 text-purple-900"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {opcao === "sim" && "✅ Sim"}
                    {opcao === "nao" && "❌ Não"}
                    {opcao === "anular" && "⚪ Anular"}
                    <br />
                    {votacao.resultados[opcao] || 0} votos
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
