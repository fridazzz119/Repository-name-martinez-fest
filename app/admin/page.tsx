"use client";

import { useState } from "react";
import { ChartColumn, Eye, Save, ShieldCheck } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { nombrePartido, partidos } from "@/lib/partidos";

const listaPartidos = partidos.map((p) => nombrePartido(p));

type Pronostico = {
  nombre: string;
  partido: string;
  goles_local: number;
  goles_visitante: number;
};

export default function AdminPage() {
  const [clave, setClave] = useState("");
  const [autorizada, setAutorizada] = useState(false);
  const [partido, setPartido] = useState(listaPartidos[0]);
  const [golesLocal, setGolesLocal] = useState("");
  const [golesVisitante, setGolesVisitante] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [pronosticos, setPronosticos] = useState<Pronostico[]>([]);
  const [mostrandoPronosticos, setMostrandoPronosticos] = useState(false);

  async function guardarResultado() {
    if (golesLocal === "" || golesVisitante === "") {
      setMensaje("Captura ambos marcadores");
      return;
    }

    const res = await fetch("/api/resultados", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ partido, golesLocal, golesVisitante }),
    });

    if (res.ok) {
      setMensaje("Resultado guardado correctamente");
      setGolesLocal("");
      setGolesVisitante("");
    } else {
      setMensaje("Error al guardar resultado");
    }
  }

  async function cargarPronosticos() {
    const res = await fetch("/api/admin-pronosticos");
    const data = await res.json();

    setPronosticos(data);
    setMostrandoPronosticos(true);
  }

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

  if (!autorizada) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 text-white rounded-2xl p-2">
              <ShieldCheck size={24} />
            </div>

            <h1 className="text-3xl font-extrabold text-black">
              Admin
            </h1>
          </div>

          <p className="text-slate-500 font-semibold mb-6">
            Acceso para capturar resultados oficiales
          </p>

          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="Clave de administrador"
            className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-black outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />

          <button
            onClick={() => {
              if (clave === "martinez2026") {
                setAutorizada(true);
                setMensaje("");
              } else {
                setMensaje("Clave incorrecta");
              }
            }}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl font-extrabold"
          >
            Entrar
          </button>

          {mensaje && (
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-3 text-center font-semibold text-slate-700">
              {mensaje}
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black p-4 pb-32">
      <div className="max-w-md mx-auto">
        <div className="mb-6 pt-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 text-white rounded-2xl p-2">
              <ShieldCheck size={24} />
            </div>

            <h1 className="text-3xl font-extrabold text-black">
              Administración
            </h1>
          </div>

          <p className="text-slate-500 font-semibold">
            Captura resultados y revisa pronósticos
          </p>
        </div>

        {mensaje && (
          <div className="mb-4 bg-blue-600 text-white p-3 rounded-2xl text-center font-semibold shadow">
            {mensaje}
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <ChartColumn size={21} className="text-blue-600" />

            <h2 className="text-xl font-extrabold text-black">
              Capturar resultado
            </h2>
          </div>

          <label className="block">
            <span className="block text-sm font-bold text-slate-500 mb-2">
              Partido
            </span>

            <select
              value={partido}
              onChange={(e) => setPartido(e.target.value)}
              className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-black outline-none focus:ring-2 focus:ring-blue-500"
            >
              {listaPartidos.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-3 items-end gap-3">
            <label>
              <span className="block text-sm font-bold text-slate-500 mb-2">
                Local
              </span>
              <input
                type="number"
                min="0"
                value={golesLocal}
                onChange={(e) => setGolesLocal(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xl font-extrabold outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <div className="text-center text-2xl font-extrabold pb-3 text-slate-400">
              -
            </div>

            <label>
              <span className="block text-sm font-bold text-slate-500 mb-2">
                Visitante
              </span>
              <input
                type="number"
                min="0"
                value={golesVisitante}
                onChange={(e) => setGolesVisitante(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xl font-extrabold outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          <button
            onClick={guardarResultado}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-extrabold text-lg shadow-lg flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Guardar Resultado
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Eye size={21} className="text-blue-600" />

            <h2 className="text-xl font-extrabold text-black">
              Todos los pronósticos
            </h2>
          </div>

          <button
            onClick={cargarPronosticos}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl font-extrabold"
          >
            Ver todos los pronósticos
          </button>

          {mostrandoPronosticos && pronosticos.length === 0 && (
            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center text-slate-500 font-semibold">
              Aún no hay pronósticos guardados.
            </div>
          )}

          {mostrandoPronosticos && pronosticos.length > 0 && (
            <div className="mt-5 space-y-5">
              {Object.entries(pronosticosPorPartido).map(
                ([partido, lista]) => (
                  <div
                    key={partido}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-3"
                  >
                    <h3 className="font-extrabold text-black mb-3">
                      {partido}
                    </h3>

                    <div className="space-y-2">
                      {lista.map((p, index) => (
                        <div
                          key={index}
                          className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between"
                        >
                          <span className="font-bold text-slate-800">
                            {p.nombre}
                          </span>

                          <span className="font-extrabold text-blue-600">
                            {p.goles_local} - {p.goles_visitante}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Los resultados guardados actualizan automáticamente el ranking.
        </p>
      </div>

      <BottomNav />
    </main>
  );
}


