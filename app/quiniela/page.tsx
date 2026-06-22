"use client";

import { useState } from "react";
import BottomNav from "../components/BottomNav";

const grupos = [
  {
    fecha: "24 de junio",
    partidos: [
      "Suiza vs Canadá",
      "Bosnia vs Catar",
      "Escocia vs Brasil",
      "Marruecos vs Haití",
      "República Checa vs México",
      "Sudáfrica vs Corea del Sur",
    ],
  },
  {
    fecha: "25 de junio",
    partidos: [
      "Ecuador vs Alemania",
      "Curazao vs Costa de Marfil",
      "Túnez vs Países Bajos",
      "Japón vs Suecia",
      "Turquía vs Estados Unidos",
      "Paraguay vs Australia",
    ],
  },
  {
    fecha: "26 de junio",
    partidos: [
      "Noruega vs Francia",
      "Senegal vs Irak",
      "Uruguay vs España",
      "Cabo Verde vs Arabia Saudita",
      "Nueva Zelanda vs Bélgica",
      "Egipto vs Irán",
    ],
  },
  {
    fecha: "27 de junio",
    partidos: [
      "Panamá vs Inglaterra",
      "Croacia vs Ghana",
      "Colombia vs Portugal",
      "RD Congo vs Uzbekistán",
      "Jordania vs Argentina",
      "Argelia vs Austria",
    ],
  },
];

export default function QuinielaPage() {
  const [nombre, setNombre] = useState("");
  const [pronosticos, setPronosticos] = useState<
    Record<string, { local: string; visitante: string }>
  >({});
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  function cambiarMarcador(
    partido: string,
    tipo: "local" | "visitante",
    valor: string
  ) {
    setPronosticos((actuales) => ({
      ...actuales,
      [partido]: {
        local: actuales[partido]?.local || "",
        visitante: actuales[partido]?.visitante || "",
        [tipo]: valor,
      },
    }));
  }

  async function guardarPronosticos() {
    if (!nombre.trim()) {
      setMensaje("⚠️ Escribe tu nombre antes de guardar");
      return;
    }

    setCargando(true);
    setMensaje("");

    const respuesta = await fetch("/api/guardar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        pronosticos,
      }),
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      setMensaje(data.error || "Error al guardar");
      setCargando(false);
      return;
    }

    setMensaje("✅ Pronósticos guardados correctamente");
    setCargando(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 pb-28">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold">MARTÍNEZ FEST</h1>

        <p className="text-slate-400 mb-6">Quiniela Mundial 2026</p>

        <div className="bg-slate-900 rounded-2xl p-4 mb-6">
          <label className="block text-sm text-slate-400 mb-2">
            Tu nombre
          </label>

          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Frida"
            className="w-full p-3 rounded-xl bg-slate-800 text-white"
          />
        </div>

        {mensaje && (
          <div className="mb-4 bg-slate-800 text-white p-3 rounded-xl text-center font-semibold">
            {mensaje}
          </div>
        )}

        {grupos.map((grupo) => (
          <div key={grupo.fecha} className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-green-400">
              {grupo.fecha}
            </h2>

            <div className="space-y-3">
              {grupo.partidos.map((partido) => (
                <div key={partido} className="bg-slate-900 rounded-2xl p-4">
                  <p className="font-medium mb-3">{partido}</p>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      value={pronosticos[partido]?.local || ""}
                      onChange={(e) =>
                        cambiarMarcador(partido, "local", e.target.value)
                      }
                      className="w-16 p-2 rounded bg-slate-800 text-center"
                    />

                    <span>-</span>

                    <input
                      type="number"
                      min="0"
                      value={pronosticos[partido]?.visitante || ""}
                      onChange={(e) =>
                        cambiarMarcador(partido, "visitante", e.target.value)
                      }
                      className="w-16 p-2 rounded bg-slate-800 text-center"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={guardarPronosticos}
          disabled={cargando}
          className="w-full bg-green-600 py-4 rounded-2xl font-bold text-lg disabled:opacity-50"
        >
          {cargando ? "Guardando..." : "Guardar Pronósticos"}
        </button>
      </div>

      <BottomNav />
    </main>
  );
}
