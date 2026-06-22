const jugadores = [
  { nombre: "Frida", puntos: 12 },
  { nombre: "Carlos", puntos: 9 },
  { nombre: "Ana", puntos: 7 },
];

export default function RankingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Ranking General
      </h1>

      <div className="space-y-3">
        {jugadores.map((jugador, index) => (
          <div
            key={index}
            className="bg-slate-900 rounded-xl p-4 flex justify-between"
          >
            <span>
              #{index + 1} {jugador.nombre}
            </span>

            <span>{jugador.puntos} pts</span>
          </div>
        ))}
      </div>
    </main>
  );
}