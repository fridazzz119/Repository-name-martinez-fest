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
    <main className="min-h-screen bg-slate-950 text-white p-4 pb-28">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2">👀 Pronósticos</h1>

        <p className="text-slate-400 mb-6">
          Pronósticos organizados por partido
        </p>

        <div className="space-y-6">
          {Object.entries(pronosticosPorPartido).map(([partido, lista]) => (
            <div key={partido} className="bg-slate-900 rounded-3xl p-4">
              <h2 className="text-lg font-bold text-green-400 mb-4">
                {partido}
              </h2>

              <div className="space-y-3">
                {lista.map((p, index) => (
                  <div
                    key={index}
                    className="bg-slate-800 rounded-2xl p-3 flex items-center justify-between"
                  >
                    <span className="font-semibold">{p.nombre}</span>

                    <span className="text-xl font-bold">
                      {p.goles_local} - {p.goles_visitante}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}

