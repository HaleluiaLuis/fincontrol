import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Página não encontrada</h1>
      <p className="text-gray-600 mb-6 max-w-md">A página que você procura pode ter sido removida, teve o nome alterado ou está temporariamente indisponível.</p>
      <Link href="/" className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium">Voltar ao Dashboard</Link>
    </div>
  );
}
