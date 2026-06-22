export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-6">
          Iniciar Sesión
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Correo"
            className="w-full p-3 rounded-xl bg-slate-800"
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 rounded-xl bg-slate-800"
          />

          <button className="w-full bg-blue-600 py-3 rounded-xl">
            Entrar
          </button>
        </div>
      </div>
    </main>
  );
}