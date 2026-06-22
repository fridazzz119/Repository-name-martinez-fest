"use client";

import { useState } from "react";
import BottomNav from "../components/BottomNav";

const partidos = [
  "Suiza vs Canadá",
  "Bosnia vs Catar",
  "Escocia vs Brasil",
  "Marruecos vs Haití",
  "República Checa vs México",
  "Sudáfrica vs Corea del Sur",
  "Ecuador vs Alemania",
  "Curazao vs Costa de Marfil",
  "Túnez vs Países Bajos",
  "Japón vs Suecia",
  "Turquía vs Estados Unidos",
  "Paraguay vs Australia",
  "Noruega vs Francia",
  "Senegal vs Irak",
  "Uruguay vs España",
  "Cabo Verde vs Arabia Saudita",
  "Nueva Zelanda vs Bélgica",
  "Egipto vs Irán",
  "Panamá vs Inglaterra",
  "Croacia vs Ghana",
  "Colombia vs Portugal",
  "RD Congo vs Uzbekistán",
  "Jordania vs Argentina",
  "Argelia vs Austria",
];

export default function AdminPage() {
  const [clave, setClave] = useState("");
  const [autorizada, setAutorizada] = useState(false);

  const [partido, setPartido] = useState(partidos[0]);
  const [golesLocal, setGolesLocal] = useState("");
  const [golesVisitante, setGolesVisitante] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function guardarResultado() {
    const res = await fetch("/api/resultados", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        partido,
        golesLocal,
        golesVisitante,
      }),
    });

    if (res.ok) {
      setMensaje("✅ Resultado guardado");
      setGolesLocal("");
      setGolesVisitante("");
    } else {
      setMensaje("❌ Error al guardar");
    }
  }

  if (!autorizada) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900 rounded-3xl p-6">
          <h1 className="text-3xl font-bold mb-4">
            Acceso Admin
          </h1>

          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="Clave de administrador"
            className="w-full p-3 rounded-xl bg-slate-800 mb-4"
          />

          <button
            onClick={() => {
              if (clave === "martinez2026") {
                setAutorizada(true);
              } else {
                alert("Clave incorrecta");
              }
            }}
            className="w-full bg-green-600 py-3 rounded-xl font-bold"
          >
            Entrar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 pb-28">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          Admin
        </h1>

        <p className="text-slate-400 mb-6">
          Captura resultados oficiales
        </p>

        {mensaje && (
          <div className="bg-slate-800 rounded-xl p-3 mb-4 text-center">
            {mensaje}
          </div>
        )}

        <div className="bg-slate-900 rounded-3xl p-4 space-y-4">
          <select
            value={partido}
            onChange={(e) => setPartido(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-800"
          >
            {partidos.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              value={golesLocal}
              onChange={(e) => setGolesLocal(e.target.value)}
              className="w-20 p-3 rounded-xl bg-slate-800 text-center"
            />

            <span>-</span>

            <input
              type="number"
              min="0"
              value={golesVisitante}
              onChange={(e) => setGolesVisitante(e.target.value)}
              className="w-20 p-3 rounded-xl bg-slate-800 text-center"
            />
          </div>

          <button
            onClick={guardarResultado}
            className="w-full bg-green-600 py-3 rounded-xl font-bold"
          >
            Guardar Resultado
          </button>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
