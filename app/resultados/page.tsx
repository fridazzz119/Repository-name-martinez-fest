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
    <main className="min-h-screen bg-slate-950 text-white p-4 pb-28">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2">📊 Resultados</h1>

        <p className="text-slate-400 mb-6">
          Resultados oficiales capturados
        </p>

        <div className="space-y-3">
          {resultados.length === 0 ? (
            <div className="bg-slate-900 rounded-2xl p-6 text-center">
              Aún no hay resultados capturados.
            </div>
          ) : (
            resultados.map((r) => (
              <div key={r.partido} className="bg-slate-900 rounded-2xl p-4">
                <p className="font-semibold mb-2">{r.partido}</p>

                <p className="text-3xl font-bold text-green-400">
                  {r.goles_local} - {r.goles_visitante}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
