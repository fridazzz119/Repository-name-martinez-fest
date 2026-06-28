"use client";

import { useEffect, useState } from "react";
import { ChartColumn, Clock, Timer } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { nombrePartido, partidos } from "@/lib/partidos";

type Resultado = {
  partido: string;
  goles_local: number;
  goles_visitante: number;
};

function horaTexto(inicio: string) {
  return new Date(inicio).toLocaleTimeString("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Mexico_City",
  });
}

function agruparPorDia() {
  const grupos: Record<string, typeof partidos> = {};

  for (const partido of partidos) {
    const clave = `${partido.dia}|${partido.fecha}`;

    if (!grupos[clave]) {
      grupos[clave] = [];
    }

    grupos[clave].push(partido);
  }

  return Object.entries(grupos).map(([clave, lista]) => {
    const [dia, fecha] = clave.split("|");

    return {
      dia,
      fecha,
      partidos: lista,
    };
  });
}

export default function ResultadosPage() {
  const [resultados, setResultados] = useState<Resultado[]>([]);

  useEffect(() => {
    fetch("/api/resultados")
      .then((res) => res.json())
      .then((data) => setResultados(data));
  }, []);

  const grupos = agruparPorDia();

  const mapaResultados = new Map(
    resultados.map((r) => [r.partido, r])
  );

  return (
    <main className="min-h-screen bg-slate-50 text-black p-4 pb-32">
      <div className="max-w-md mx-auto">
        <div className="pt-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 text-white rounded-2xl p-2">
              <ChartColumn size={26} />
            </div>

            <h1 className="text-3xl font-black">Resultados</h1>
          </div>

          <p className="text-slate-500 font-semibold">
            Resultados oficiales de la eliminatoria
          </p>
        </div>

        {grupos.map((grupo) => (
          <div key={`${grupo.dia}-${grupo.fecha}`} className="mb-8">
            <div className="bg-blue-600 text-white rounded-full py-3 px-4 text-center shadow-md mb-4">
              <p className="text-xs font-extrabold tracking-[0.25em]">
                {grupo.dia}
              </p>

              <p className="text-lg font-black tracking-wide">
                {grupo.fecha}
              </p>
            </div>

            <div className="space-y-4">
              {grupo.partidos.map((partido) => {
                const clave = nombrePartido(partido);
                const resultado = mapaResultados.get(clave);
                const pendiente = !resultado;

                return (
                  <div
                    key={clave}
                    className="bg-white border border-slate-200 rounded-[30px] shadow-sm overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500 font-extrabold text-xs">
                        <Clock size={15} />
                        <span>{horaTexto(partido.inicio)}</span>
                      </div>

                      <div
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-black border ${
                          pendiente
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : "bg-blue-50 text-blue-600 border-blue-100"
                        }`}
                      >
                        <Timer size={13} />
                        <span>
                          {pendiente ? "RESULTADO PENDIENTE" : "RESULTADO OFICIAL"}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                        <div className="text-left min-w-0">
                          <div className="text-4xl mb-2">
                            {partido.banderaLocal}
                          </div>

                          <p className="font-black text-sm text-black leading-tight">
                            {partido.local}
                          </p>
                        </div>

                        <div className="flex items-center justify-center gap-2">
                          <div
                            className={`w-14 h-12 rounded-2xl border flex items-center justify-center font-black text-xl ${
                              pendiente
                                ? "bg-slate-50 border-slate-200 text-slate-300"
                                : "bg-blue-600 border-blue-600 text-white"
                            }`}
                          >
                            {pendiente ? "-" : resultado.goles_local}
                          </div>

                          <span className="font-black text-xl text-slate-300">
                            -
                          </span>

                          <div
                            className={`w-14 h-12 rounded-2xl border flex items-center justify-center font-black text-xl ${
                              pendiente
                                ? "bg-slate-50 border-slate-200 text-slate-300"
                                : "bg-blue-600 border-blue-600 text-white"
                            }`}
                          >
                            {pendiente ? "-" : resultado.goles_visitante}
                          </div>
                        </div>

                        <div className="text-right min-w-0">
                          <div className="text-4xl mb-2">
                            {partido.banderaVisitante}
                          </div>

                          <p className="font-black text-sm text-black leading-tight">
                            {partido.visitante}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </main>
  );
} 
