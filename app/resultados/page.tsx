"use client";

import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";

type Resultado = {
  partido: string;
  goles_local: number;
  goles_visitante: number;
};

export default function ResultadosPage() {
  const [resultados, setResultados] = useState<Resultado[]>([]);

  useEffect(() => {
    fetch("/api/resultados")
      .then((res) => res.json())
      .then((data) => setResultados(data));
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900 p-4 pb-32">
      <div className="max-w-md mx-auto">
        <div className="mb-6 pt-2">
          <h1 className="text-3xl font-extrabold text-blue-700">
            📊 Resultados
          </h1>

          <p className="text-slate-500 font-semibold">
            Resultados oficiales capturados
          </p>
        </div>

        <div className="space-y-4">
          {resultados.length === 0 ? (
            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 text-center text-slate-500 font-semibold">
              Aún no hay resultados capturados.
            </div>
          ) : (
            resultados.map((r) => (
              <div
                key={r.partido}
                className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm"
              >
                <p className="font-bold text-slate-800 mb-3">
                  {r.partido}
                </p>

                <div className="flex justify-center">
                  <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-3xl font-extrabold">
                    {r.goles_local} - {r.goles_visitante}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
