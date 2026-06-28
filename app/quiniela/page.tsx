"use client";

import { useState } from "react";
import { Clock, Lock, Timer, Save } from "lucide-react";
import BottomNav from "../components/BottomNav";

type Partido = {
  local: string;
  visitante: string;
  inicio: string;
};

const grupos: { dia: string; fecha: string; partidos: Partido[] }[] = [
  {
    dia: "DOMINGO",
    fecha: "28 JUNIO",
    partidos: [
      { local: "🇿🇦 Sudáfrica", visitante: "🇨🇦 Canadá", inicio: "2026-06-28T13:00:00-06:00" },
    ],
  },
  {
    dia: "LUNES",
    fecha: "29 JUNIO",
    partidos: [
      { local: "🇧🇷 Brasil", visitante: "🇯🇵 Japón", inicio: "2026-06-29T11:00:00-06:00" },
      { local: "🇩🇪 Alemania", visitante: "🇵🇾 Paraguay", inicio: "2026-06-29T14:30:00-06:00" },
      { local: "🇳🇱 Países Bajos", visitante: "🇲🇦 Marruecos", inicio: "2026-06-29T19:00:00-06:00" },
    ],
  },
  {
    dia: "MARTES",
    fecha: "30 JUNIO",
    partidos: [
      { local: "🇨🇮 Costa de Marfil", visitante: "🇳🇴 Noruega", inicio: "2026-06-30T11:00:00-06:00" },
      { local: "🇫🇷 Francia", visitante: "🇸🇪 Suecia", inicio: "2026-06-30T15:00:00-06:00" },
      { local: "🇲🇽 México", visitante: "🇪🇨 Ecuador", inicio: "2026-06-30T19:00:00-06:00" },
    ],
  },
  {
    dia: "MIÉRCOLES",
    fecha: "1 JULIO",
    partidos: [
      { local: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra", visitante: "🇨🇩 RD Congo", inicio: "2026-07-01T10:00:00-06:00" },
      { local: "🇧🇪 Bélgica", visitante: "🇸🇳 Senegal", inicio: "2026-07-01T14:00:00-06:00" },
      { local: "🇺🇸 Estados Unidos", visitante: "🇧🇦 Bosnia y Herzegovina", inicio: "2026-07-01T18:00:00-06:00" },
    ],
  },
  {
    dia: "JUEVES",
    fecha: "2 JULIO",
    partidos: [
      { local: "🇪🇸 España", visitante: "🇦🇹 Austria", inicio: "2026-07-02T13:00:00-06:00" },
      { local: "🇵🇹 Portugal", visitante: "🇭🇷 Croacia", inicio: "2026-07-02T17:00:00-06:00" },
      { local: "🇨🇭 Suiza", visitante: "🇩🇿 Argelia", inicio: "2026-07-02T21:00:00-06:00" },
    ],
  },
  {
    dia: "VIERNES",
    fecha: "3 JULIO",
    partidos: [
      { local: "🇦🇺 Australia", visitante: "🇪🇬 Egipto", inicio: "2026-07-03T12:00:00-06:00" },
      { local: "🇦🇷 Argentina", visitante: "🇨🇻 Cabo Verde", inicio: "2026-07-03T16:00:00-06:00" },
      { local: "🇨🇴 Colombia", visitante: "🇬🇭 Ghana", inicio: "2026-07-03T19:30:00-06:00" },
    ],
  },
];

function quitarBandera(texto: string) {
  return texto.replace(/^(\S+)\s/, "");
}

function obtenerBandera(texto: string) {
  return texto.split(" ")[0];
}

function partidoTexto(partido: Partido) {
  return `${quitarBandera(partido.local)} vs ${quitarBandera(partido.visitante)}`;
}

function estaCerrado(inicio: string) {
  const inicioPartido = new Date(inicio).getTime();
  const cierre = inicioPartido - 30 * 60 * 1000;
  return Date.now() >= cierre;
}

function horaTexto(inicio: string) {
  return new Date(inicio).toLocaleTimeString("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Mexico_City",
  });
}

function cierreTexto(inicio: string) {
  const cierre = new Date(new Date(inicio).getTime() - 30 * 60 * 1000);

  return cierre.toLocaleTimeString("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Mexico_City",
  });
}

function tiempoRestante(inicio: string) {
  const cierre = new Date(inicio).getTime() - 30 * 60 * 1000;
  const diferencia = cierre - Date.now();

  if (diferencia <= 0) return "cerrado";

  const minutosTotales = Math.floor(diferencia / 60000);
  const horas = Math.floor(minutosTotales / 60);
  const minutos = minutosTotales % 60;

  if (horas <= 0) return `${minutos} min`;
  return `${horas} h ${minutos} min`;
}

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
      setMensaje("Escribe tu nombre antes de guardar");
      return;
    }

    const partidosAbiertos = grupos.flatMap((grupo) =>
      grupo.partidos.filter((partido) => !estaCerrado(partido.inicio))
    );

    const pronosticosPermitidos: Record<
      string,
      { local: string; visitante: string }
    > = {};

    for (const partido of partidosAbiertos) {
      const clave = partidoTexto(partido);

      if (pronosticos[clave]) {
        pronosticosPermitidos[clave] = pronosticos[clave];
      }
    }

    if (Object.keys(pronosticosPermitidos).length === 0) {
      setMensaje("No hay pronósticos abiertos para guardar");
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
        pronosticos: pronosticosPermitidos,
      }),
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      setMensaje(data.error || "Error al guardar");
      setCargando(false);
      return;
    }

    setMensaje("Pronósticos guardados correctamente");
    setCargando(false);
  }

  return (
    <main className="min-h-screen bg-white text-slate-950 p-4 pb-32">
      <div className="max-w-md mx-auto">
        <div className="mb-6 pt-3">
          <img src="/logo.png" alt="CEJUDO FEST" className="w-24 mb-3" />

          <h1 className="text-3xl font-extrabold text-black">
            CEJUDO FEST
          </h1>

          <p className="text-slate-500 font-semibold">
            Segunda edición · Eliminatoria de 32
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 mb-6 shadow-sm">
          <label className="block text-sm text-slate-500 mb-2 font-semibold">
            Tu nombre
          </label>

          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Frida"
            className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-black outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {mensaje && (
          <div className="mb-5 bg-blue-600 text-white p-3 rounded-2xl text-center font-bold shadow">
            {mensaje}
          </div>
        )}

        {grupos.map((grupo) => (
          <div key={`${grupo.dia}-${grupo.fecha}`} className="mb-8">
            <div className="bg-blue-600 text-white rounded-full py-3 px-4 text-center shadow-md mb-4">
              <p className="text-xs font-bold tracking-[0.25em]">
                {grupo.dia}
              </p>
              <p className="text-lg font-extrabold tracking-wide">
                {grupo.fecha}
              </p>
            </div>

            <div className="space-y-4">
              {grupo.partidos.map((partido) => {
                const clave = partidoTexto(partido);
                const cerrado = estaCerrado(partido.inicio);
                const restante = tiempoRestante(partido.inicio);

                return (
                  <div
                    key={clave}
                    className={`border rounded-3xl p-4 shadow-sm ${
                      cerrado
                        ? "bg-slate-50 border-slate-200 opacity-80"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                        <Clock size={15} />
                        <span>Inicia {horaTexto(partido.inicio)}</span>
                      </div>

                      <div
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-extrabold ${
                          cerrado
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : "bg-green-50 text-green-700 border border-green-100"
                        }`}
                      >
                        {cerrado ? <Lock size={13} /> : <Timer size={13} />}
                        <span>{cerrado ? "CERRADO" : `CIERRA EN ${restante}`}</span>
                      </div>
                    </div>

                    {!cerrado && (
                      <p className="text-[11px] text-slate-400 font-semibold text-center mb-4">
                        Cierre oficial {cierreTexto(partido.inicio)}
                      </p>
                    )}

                    <div className="grid grid-cols-3 items-center gap-3">
                      <div className="text-center">
                        <div className="text-4xl mb-2">
                          {obtenerBandera(partido.local)}
                        </div>

                        <p className="font-extrabold text-sm text-black">
                          {quitarBandera(partido.local)}
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="number"
                          min="0"
                          disabled={cerrado}
                          value={pronosticos[clave]?.local || ""}
                          onChange={(e) =>
                            cambiarMarcador(clave, "local", e.target.value)
                          }
                          className="w-14 p-2 rounded-xl bg-slate-50 border border-slate-200 text-center font-extrabold text-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-200 disabled:text-slate-400"
                        />

                        <span className="font-extrabold text-slate-400">-</span>

                        <input
                          type="number"
                          min="0"
                          disabled={cerrado}
                          value={pronosticos[clave]?.visitante || ""}
                          onChange={(e) =>
                            cambiarMarcador(clave, "visitante", e.target.value)
                          }
                          className="w-14 p-2 rounded-xl bg-slate-50 border border-slate-200 text-center font-extrabold text-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-200 disabled:text-slate-400"
                        />
                      </div>

                      <div className="text-center">
                        <div className="text-4xl mb-2">
                          {obtenerBandera(partido.visitante)}
                        </div>

                        <p className="font-extrabold text-sm text-black">
                          {quitarBandera(partido.visitante)}
                        </p>
                      </div>
                    </div>

                    <p
                      className={`text-center text-xs font-extrabold mt-4 ${
                        cerrado ? "text-red-500" : "text-blue-600"
                      }`}
                    >
                      {cerrado ? "Pronóstico cerrado" : "Tu pronóstico"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <button
          onClick={guardarPronosticos}
          disabled={cargando}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-extrabold text-lg disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {cargando ? "Guardando..." : "Guardar Pronósticos"}
        </button>
      </div>

      <BottomNav />
    </main>
  );
}



