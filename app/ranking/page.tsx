"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, LoaderCircle } from "lucide-react";
import BottomNav from "../components/BottomNav";

type Jugador = {
  nombre: string;
  puntos: number;
  exactos: number;
  aciertos: number;
};

function bordePodio(index: number) {
  if (index === 0) return "border-yellow-300";
  if (index === 1) return "border-slate-300";
  if (index === 2) return "border-orange-300";
  return "border-slate-200";
}

function fondoNumero(index: number) {
  if (index === 0) return "bg-yellow-50 text-yellow-700 border-yellow-200";
  if (index === 1) return "bg-slate-100 text-slate-700 border-slate-300";
  if (index === 2) return "bg-orange-50 text-orange-700 border-orange-200";
  return "bg-blue-600 text-white border-blue-600";
}

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
    <main className="min-h-screen bg-slate-50 text-black p-4 pb-32">
      <div className="max-w-md mx-auto">
        <div className="pt-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 text-white rounded-2xl p-2">
              <Trophy size={26} />
            </div>

            <h1 className="text-3xl font-black">Ranking</h1>
          </div>

          <p className="text-slate-500 font-semibold">
            Clasificación general en tiempo real
          </p>
        </div>

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 text-center text-slate-500 font-semibold flex items-center justify-center gap-2">
            <LoaderCircle size={20} className="animate-spin text-blue-600" />
            Cargando ranking...
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-[28px] p-4">
            <p className="font-black">Error en ranking</p>
            <p className="text-sm mt-2 font-semibold">{error}</p>
          </div>
        ) : ranking.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 text-center text-slate-500 font-semibold">
            Aún no hay resultados capturados.
          </div>
        ) : (
          <div className="space-y-4">
            {ranking.map((jugador, index) => (
              <div
                key={jugador.nombre}
                className={`bg-white border ${bordePodio(
                  index
                )} rounded-[30px] p-4 shadow-sm`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-black text-lg shrink-0 ${fondoNumero(
                      index
                    )}`}
                  >
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {index < 3 && (
                        <Medal
                          size={19}
                          className={
                            index === 0
                              ? "text-yellow-600"
                              : index === 1
                              ? "text-slate-500"
                              : "text-orange-600"
                          }
                        />
                      )}

                      <h2 className="text-xl font-black text-black truncate">
                        {jugador.nombre}
                      </h2>
                    </div>

                    <p className="text-slate-500 text-sm font-semibold mt-1">
                      {jugador.exactos} exactos · {jugador.aciertos} aciertos
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-bold">
                      Puntos
                    </p>

                    <p className="text-3xl font-black text-blue-600">
                      {jugador.puntos}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                    <p className="text-xs text-slate-500 font-bold">
                      Posición
                    </p>
                    <p className="text-lg font-black">{index + 1}</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                    <p className="text-xs text-slate-500 font-bold">
                      Exactos
                    </p>
                    <p className="text-lg font-black">{jugador.exactos}</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                    <p className="text-xs text-slate-500 font-bold">
                      Aciertos
                    </p>
                    <p className="text-lg font-black">{jugador.aciertos}</p>
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



