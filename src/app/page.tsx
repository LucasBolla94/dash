"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redireciona usuários já autenticados
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) router.push("/dash");
    });
    return unsubscribe;
  }, [router]);

  // Configura persistência local da sessão
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dash");
    } catch {
      setError("Email ou senha incorretos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white px-6 py-10 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full text-center">
        <Image
          src="https://gateway.pinata.cloud/ipfs/bafkreifwuo5wd5x2liwbkeklcguw4t63cjbuu3jqf47om22uoqqwjypdm4"
          alt="Token PRV"
          width={160}
          height={160}
          className="h-40 w-40 mx-auto mb-8 rounded-full border-4 border-yellow-400/50 shadow-xl"
          priority
        />

        <h1 className="text-5xl font-bold mb-10 text-yellow-300">
          Acesse sua Conta
        </h1>

        <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
          Digite seu <strong>email</strong> e <strong>senha</strong> para acessar o painel da PRV Investimentos.
          Interface simples e direta, pensada para você.
        </p>

        <form
          onSubmit={handleLogin}
          className="max-w-md mx-auto space-y-6 bg-white/10 p-8 rounded-2xl shadow-2xl"
        >
          <div>
            <label htmlFor="email" className="block text-xl font-semibold mb-3 text-yellow-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-6 py-4 bg-white/20 rounded-xl text-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xl font-semibold mb-3 text-yellow-400">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-6 py-4 bg-white/20 rounded-xl text-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-lg font-medium text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-4 rounded-xl font-bold text-2xl hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar no Painel"}
          </button>

          <div className="text-center text-lg mt-4">
            <Link
              href="/reset-password"
              className="text-yellow-300 hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
