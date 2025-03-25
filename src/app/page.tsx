// /src/app/page.tsx - Página de Login
"use client";
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dash');
    } catch (err) {
      setError('Credenciais inválidas ou usuário não encontrado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white px-6 py-10 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img 
            src="https://gateway.pinata.cloud/ipfs/bafkreifwuo5wd5x2liwbkeklcguw4t63cjbuu3jqf47om22uoqqwjypdm4" 
            alt="Token PRV"
            className="h-32 w-32 mx-auto mb-8 rounded-full border-4 border-yellow-400/50 shadow-xl"
          />
          <h1 className="text-4xl font-bold mb-4">Acesso ao Dashboard</h1>
          <p className="text-gray-300">Controle completo do seu investimento</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-white/10 rounded-lg focus:ring-2 focus:ring-yellow-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Senha</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-white/10 rounded-lg focus:ring-2 focus:ring-yellow-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-3 rounded-xl font-bold hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {loading ? 'Carregando...' : 'Acessar Dashboard'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-300">
          <Link href="/reset-password" className="text-yellow-400 hover:underline">
            Esqueceu a senha?
          </Link>
        </div>
      </div>
    </main>
  );
}