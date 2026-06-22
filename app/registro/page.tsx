export default function RegistroPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-6">Registrarse</h1>

        <div className="space-y-4">
          <input type="text" placeholder="Nombre completo" className="w-full p-3 rounded-xl bg-slate-800" />
          <input type="email" placeholder="Correo" className="w-full p-3 rounded-xl bg-slate-800" />
          <input type="password" placeholder="Contraseña" className="w-full p-3 rounded-xl bg-slate-800" />

          <a href="/quiniela" className="block w-full bg-green-600 py-3 rounded-xl text-center font-semibold">
            Crear cuenta
          </a>
        </div>
      </div>
    </main>
  );
}
