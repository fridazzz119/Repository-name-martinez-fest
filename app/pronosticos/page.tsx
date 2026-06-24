"use client";

import { useState } from "react";
import BottomNav from "../components/BottomNav";

type Pronostico = {
  nombre: string;
  partido: string;
  goles_local: number;
  goles_visitante: number;
};

export default function PronosticosPage() {
  const [nombre, setNombre] = useState("");
  const [pronosticos, setPronosticos] = useState<Pronostico[]>([]);
  const [mensaje, setMensaje] = useState("");

  async function buscarPronosticos() {
    if (!nombre.trim()) {
      setMensaje("⚠️ Escribe tu nombre");
      return;
    }

    setMensaje("");

    const res = await fetch(
      `/api/pronosticos?nombre=${encodeURIComponent(nombre)}`
    );

    const data = await res.json();
    setPronosticos(data);

    if (data.length === 0) {
      setMensaje("No encontramos pronósticos con ese nombre");
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 p-4 pb-32">
      <div className="max-w-md mx-auto">
        <div className="mb-6 pt-2">
          <h1 className="text-3xl font-extrabold text-blue-700">
            👤 Mis Pronósticos
          </h1>

          <p className="text-slate-500 font-semibold">
            Escribe tu nombre para ver solo tus marcadores
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-4 mb-5 shadow-sm">
          <label className="block text-sm text-slate-500 mb-2">
            Tu nombre
          </label>

          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Frida"
            className="w-full p-3 rounded-2xl bg-white border border-blue-100 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />

          <button
            onClick={buscarPronosticos}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl font-extrabold"
          >
            Ver mis pronósticos
          </button>
        </div>

        {mensaje && (
          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-4 text-center text-slate-500 font-semibold mb-5">
            {mensaje}
          </div>
        )}

        <div className="space-y-4">
          {pronosticos.map((p) => (
            <div
              key={p.partido}
              className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm"
            >
              <p className="font-bold text-slate-800 mb-2">
                {p.partido}
              </p>

              <div className="flex justify-center">
                <div className="bg-blue-600 text-white px-5 py-2 rounded-2xl text-2xl font-extrabold">
                  {p.goles_local} - {p.goles_visitante}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}



