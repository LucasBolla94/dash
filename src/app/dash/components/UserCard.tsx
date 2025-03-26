"use client";

import { motion } from "framer-motion";

interface UserData {
  nome: string;
  sobrenome: string;
  email: string;
  cpf: string;
  dataNascimento: string; // formato ISO: "1990-01-01"
}

interface Props {
  user: UserData;
}

export default function UserCard({ user }: Props) {
  // Formatar CPF e data de nascimento
  const formatCPF = (cpf?: string) =>
    cpf
      ? cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")
      : "CPF não informado";

      const formatData = (iso?: string) => {
        if (!iso) return "Data não informada";
        const data = new Date(iso);
        return data.toLocaleDateString("pt-BR");
      };
      

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 rounded-2xl shadow-lg p-6 mb-6 max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-yellow-300 mb-4">Informações do Sócio</h2>

      <div className="space-y-2 text-lg">
        <p>
          <strong className="text-yellow-400">Nome:</strong>{" "}
          {user.nome} {user.sobrenome}
        </p>
        <p>
          <strong className="text-yellow-400">Email:</strong>{" "}
          {user.email}
        </p>
        <p>
          <strong className="text-yellow-400">CPF:</strong>{" "}
          {formatCPF(user.cpf)}
        </p>
        <p>
          <strong className="text-yellow-400">Nascimento:</strong>{" "}
          {formatData(user.dataNascimento)}
        </p>
      </div>
    </motion.div>
  );
}
