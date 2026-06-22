"use client";

import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";

type Jugador = {
  nombre: string;
  puntos: number;
  exactos: number;
  aciertos: number;
};

export default function RankingPage() {
  const [ranking, setRanking] = useState<Jugador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/ranking")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setRanking(data);
        }

        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 pb-28">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2">🏆 Ranking</h1>

        <p className="text-slate-400 mb-6">
          Clasificación en tiempo real
        </p>

        {loading ? (
          <div className="text-center py-10">Cargando ranking...</div>
        ) : error ? (
          <div className="bg-red-900 rounded-2xl p-4">
            <p className="font-bold">Error en ranking:</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        ) : ranking.length === 0 ? (
          <div className="bg-slate-900 rounded-2xl p-6 text-center">
            Aún no hay resultados capturados.
          </div>
        ) : (
          <div className="space-y-4">
            {ranking.map((jugador, index) => (
              <div
                key={jugador.nombre}
                className="bg-slate-900 rounded-3xl p-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">
                      {index === 0 && "🥇 "}
                      {index === 1 && "🥈 "}
                      {index === 2 && "🥉 "}
                      {jugador.nombre}
                    </h2>

                    <p className="text-slate-400 text-sm">
                      Exactos: {jugador.exactos} · Aciertos:{" "}
                      {jugador.aciertos}
                    </p>
                  </div>

                  <div className="text-3xl font-bold text-green-400">
                    {jugador.puntos}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}


