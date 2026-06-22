"use client";

import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";

type Pronostico = {
  nombre: string;
  partido: string;
  goles_local: number;
  goles_visitante: number;
};

export default function PronosticosPage() {
  const [pronosticos, setPronosticos] = useState<Pronostico[]>([]);

  useEffect(() => {
    fetch("/api/pronosticos")
      .then((res) => res.json())
      .then((data) => setPronosticos(data));
  }, []);

  const pronosticosPorPartido = pronosticos.reduce(
    (acc, pronostico) => {
      if (!acc[pronostico.partido]) {
        acc[pronostico.partido] = [];
      }

      acc[pronostico.partido].push(pronostico);
      return acc;
    },
    {} as Record<string, Pronostico[]>
  );

  return (
    <main className="min-h-screen bg-white text-slate-900 p-4 pb-32">
      <div className="max-w-md mx-auto">
        <div className="mb-6 pt-2">
          <h1 className="text-3xl font-extrabold text-blue-700">
            👀 Pronósticos
          </h1>

          <p className="text-slate-500 font-semibold">
            Pronósticos organizados por partido
          </p>
        </div>

        <div className="space-y-5">
          {Object.entries(pronosticosPorPartido).map(([partido, lista]) => (
            <div
              key={partido}
              className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm"
            >
              <h2 className="text-lg font-extrabold text-blue-700 mb-4">
                {partido}
              </h2>

              <div className="space-y-3">
                {lista.map((p, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 border border-blue-100 rounded-2xl p-3 flex items-center justify-between"
                  >
                    <span className="font-bold text-slate-800">
                      {p.nombre}
                    </span>

                    <span className="text-xl font-extrabold text-blue-700">
                      {p.goles_local} - {p.goles_visitante}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {pronosticos.length === 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 text-center text-slate-500 font-semibold">
            Aún no hay pronósticos guardados.
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}


