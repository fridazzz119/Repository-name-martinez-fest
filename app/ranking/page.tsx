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
        if (data.error) setError(data.error);
        else setRanking(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900 p-4 pb-32">
      <div className="max-w-md mx-auto">
        <div className="mb-6 pt-2">
          <h1 className="text-3xl font-extrabold text-blue-700">
            🏆 Ranking
          </h1>

          <p className="text-slate-500 font-semibold">
            Clasificación en tiempo real
          </p>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-500 font-semibold">
            Cargando ranking...
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl p-4">
            <p className="font-bold">Error en ranking:</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        ) : ranking.length === 0 ? (
          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 text-center text-slate-500 font-semibold">
            Aún no hay resultados capturados.
          </div>
        ) : (
          <div className="space-y-4">
            {ranking.map((jugador, index) => (
              <div
                key={jugador.nombre}
                className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      {index === 0 && "🥇 "}
                      {index === 1 && "🥈 "}
                      {index === 2 && "🥉 "}
                      {jugador.nombre}
                    </h2>

                    <p className="text-slate-500 text-sm font-semibold">
                      Exactos: {jugador.exactos} · Aciertos:{" "}
                      {jugador.aciertos}
                    </p>
                  </div>

                  <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl text-2xl font-extrabold">
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



