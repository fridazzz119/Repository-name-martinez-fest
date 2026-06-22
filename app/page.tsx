export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-center mb-2">
            MARTÍNEZ FEST
          </h1>

          <p className="text-center text-slate-400 mb-8">
            Quiniela Mundial 2026
          </p>

          <div className="space-y-3">
            <a href="/login" className="block w-full bg-blue-600 py-3 rounded-xl font-semibold text-center">
              Iniciar Sesión
            </a>

            <a href="/registro" className="block w-full bg-green-600 py-3 rounded-xl font-semibold text-center">
              Registrarse
            </a>

            <a href="/ranking" className="block w-full bg-slate-700 py-3 rounded-xl font-semibold text-center">
              Ver Ranking
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
