"use client";

import { useState } from "react";
import BottomNav from "../components/BottomNav";

const partidos = [
  "Suiza vs Canadá",
  "Bosnia y Herzegovina vs Catar",
  "Escocia vs Brasil",
  "Marruecos vs Haití",
  "República Checa vs México",
  "Sudáfrica vs Corea del Sur",
  "Alemania vs Ecuador",
  "Curazao vs Costa de Marfil",
  "Túnez vs Países Bajos",
  "Japón vs Suecia",
  "Estados Unidos vs Turquía",
  "Australia vs Paraguay",
  "Noruega vs Francia",
  "Senegal vs Irak",
  "Uruguay vs España",
  "Cabo Verde vs Arabia Saudita",
  "Egipto vs Irán",
  "Nueva Zelanda vs Bélgica",
  "Panamá vs Inglaterra",
  "Croacia vs Ghana",
  "Colombia vs Portugal",
  "RD Congo vs Uzbekistán",
  "Argelia vs Austria",
  "Jordania vs Argentina",
];

export default function AdminPage() {
  const [clave, setClave] = useState("");
  const [autorizada, setAutorizada] = useState(false);
  const [partido, setPartido] = useState(partidos[0]);
  const [golesLocal, setGolesLocal] = useState("");
  const [golesVisitante, setGolesVisitante] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function guardarResultado() {
    if (golesLocal === "" || golesVisitante === "") {
      setMensaje("⚠️ Captura ambos marcadores");
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
      setMensaje("✅ Resultado guardado correctamente");
      setGolesLocal("");
      setGolesVisitante("");
    } else {
      setMensaje("❌ Error al guardar resultado");
    }
  }

  if (!autorizada) {
    return (
      <main className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-2">
            🔒 Admin
          </h1>

          <p className="text-slate-500 font-semibold mb-6">
            Acceso para capturar resultados oficiales
          </p>

          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="Clave de administrador"
            className="w-full p-3 rounded-2xl bg-blue-50 border border-blue-100 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />

          <button
            onClick={() => {
              if (clave === "martinez2026") {
                setAutorizada(true);
                setMensaje("");
              } else {
                setMensaje("❌ Clave incorrecta");
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
    <main className="min-h-screen bg-white text-slate-900 p-4 pb-32">
      <div className="max-w-md mx-auto">
        <div className="mb-6 pt-2">
          <h1 className="text-3xl font-extrabold text-blue-700">
            ⚙️ Administración
          </h1>

          <p className="text-slate-500 font-semibold">
            Captura resultados oficiales
          </p>
        </div>

        {mensaje && (
          <div className="mb-4 bg-blue-600 text-white p-3 rounded-2xl text-center font-semibold shadow">
            {mensaje}
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-4">
          <label className="block">
            <span className="block text-sm font-bold text-slate-500 mb-2">
              Partido
            </span>

            <select
              value={partido}
              onChange={(e) => setPartido(e.target.value)}
              className="w-full p-3 rounded-2xl bg-blue-50 border border-blue-100 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {partidos.map((p) => (
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
                className="w-full p-3 rounded-2xl bg-blue-50 border border-blue-100 text-center text-xl font-extrabold outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <div className="text-center text-2xl font-extrabold pb-3">-</div>

            <label>
              <span className="block text-sm font-bold text-slate-500 mb-2">
                Visitante
              </span>
              <input
                type="number"
                min="0"
                value={golesVisitante}
                onChange={(e) => setGolesVisitante(e.target.value)}
                className="w-full p-3 rounded-2xl bg-blue-50 border border-blue-100 text-center text-xl font-extrabold outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>

          <button
            onClick={guardarResultado}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-extrabold text-lg shadow-lg"
          >
            Guardar Resultado
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Los resultados guardados actualizan automáticamente el ranking.
        </p>
      </div>

      <BottomNav />
    </main>
  );
}

