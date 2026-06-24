"use client";

import { useState } from "react";
import BottomNav from "../components/BottomNav";

type Partido = {
  local: string;
  visitante: string;
  inicio: string;
};

const grupos: { fecha: string; partidos: Partido[] }[] = [
  {
    fecha: "Miércoles 24 de junio",
    partidos: [
      { local: "🇨🇭 Suiza", visitante: "🇨🇦 Canadá", inicio: "2026-06-24T13:00:00-06:00" },
      { local: "🇧🇦 Bosnia y Herzegovina", visitante: "🇶🇦 Catar", inicio: "2026-06-24T13:00:00-06:00" },
      { local: "🏴 Escocia", visitante: "🇧🇷 Brasil", inicio: "2026-06-24T16:00:00-06:00" },
      { local: "🇲🇦 Marruecos", visitante: "🇭🇹 Haití", inicio: "2026-06-24T16:00:00-06:00" },
      { local: "🇨🇿 República Checa", visitante: "🇲🇽 México", inicio: "2026-06-24T19:00:00-06:00" },
      { local: "🇿🇦 Sudáfrica", visitante: "🇰🇷 Corea del Sur", inicio: "2026-06-24T19:00:00-06:00" },
    ],
  },
  {
    fecha: "Jueves 25 de junio",
    partidos: [
      { local: "🇩🇪 Alemania", visitante: "🇪🇨 Ecuador", inicio: "2026-06-25T13:00:00-06:00" },
      { local: "🇨🇼 Curazao", visitante: "🇨🇮 Costa de Marfil", inicio: "2026-06-25T13:00:00-06:00" },
      { local: "🇹🇳 Túnez", visitante: "🇳🇱 Países Bajos", inicio: "2026-06-25T17:00:00-06:00" },
      { local: "🇯🇵 Japón", visitante: "🇸🇪 Suecia", inicio: "2026-06-25T17:00:00-06:00" },
      { local: "🇺🇸 Estados Unidos", visitante: "🇹🇷 Turquía", inicio: "2026-06-25T20:00:00-06:00" },
      { local: "🇦🇺 Australia", visitante: "🇵🇾 Paraguay", inicio: "2026-06-25T20:00:00-06:00" },
    ],
  },
  {
    fecha: "Viernes 26 de junio",
    partidos: [
      { local: "🇳🇴 Noruega", visitante: "🇫🇷 Francia", inicio: "2026-06-26T13:00:00-06:00" },
      { local: "🇸🇳 Senegal", visitante: "🇮🇶 Irak", inicio: "2026-06-26T13:00:00-06:00" },
      { local: "🇺🇾 Uruguay", visitante: "🇪🇸 España", inicio: "2026-06-26T18:00:00-06:00" },
      { local: "🇨🇻 Cabo Verde", visitante: "🇸🇦 Arabia Saudita", inicio: "2026-06-26T18:00:00-06:00" },
      { local: "🇪🇬 Egipto", visitante: "🇮🇷 Irán", inicio: "2026-06-26T21:00:00-06:00" },
      { local: "🇳🇿 Nueva Zelanda", visitante: "🇧🇪 Bélgica", inicio: "2026-06-26T21:00:00-06:00" },
    ],
  },
  {
    fecha: "Sábado 27 de junio",
    partidos: [
      { local: "🇵🇦 Panamá", visitante: "🏴 Inglaterra", inicio: "2026-06-27T15:00:00-06:00" },
      { local: "🇭🇷 Croacia", visitante: "🇬🇭 Ghana", inicio: "2026-06-27T15:00:00-06:00" },
      { local: "🇨🇴 Colombia", visitante: "🇵🇹 Portugal", inicio: "2026-06-27T17:30:00-06:00" },
      { local: "🇨🇩 RD Congo", visitante: "🇺🇿 Uzbekistán", inicio: "2026-06-27T17:30:00-06:00" },
      { local: "🇩🇿 Argelia", visitante: "🇦🇹 Austria", inicio: "2026-06-27T20:00:00-06:00" },
      { local: "🇯🇴 Jordania", visitante: "🇦🇷 Argentina", inicio: "2026-06-27T20:00:00-06:00" },
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
    hour: "2-digit",
    minute: "2-digit",
  });
}

function cierreTexto(inicio: string) {
  const cierre = new Date(new Date(inicio).getTime() - 30 * 60 * 1000);

  return cierre.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function tiempoRestante(inicio: string) {
  const cierre = new Date(inicio).getTime() - 30 * 60 * 1000;
  const diferencia = cierre - Date.now();

  if (diferencia <= 0) {
    return "cerrado";
  }

  const minutosTotales = Math.floor(diferencia / 60000);
  const horas = Math.floor(minutosTotales / 60);
  const minutos = minutosTotales % 60;

  if (horas <= 0) {
    return `${minutos} min`;
  }

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
      setMensaje("⚠️ Escribe tu nombre antes de guardar");
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
      setMensaje("⚠️ No hay pronósticos abiertos para guardar");
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

    setMensaje("✅ Pronósticos guardados correctamente");
    setCargando(false);
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 p-4 pb-32">
      <div className="max-w-md mx-auto">
      <div className="mb-4 pt-2">
  <img
    src="/logo.png"
    alt="Martínez Fest"
    className="w-24"
  />

  <p className="text-slate-500 font-semibold mt-2">
    Quiniela Mundial 2026
  </p>
</div>


        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-4 mb-6 shadow-sm">
          <label className="block text-sm text-slate-500 mb-2">
            Tu nombre
          </label>

          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Frida"
            className="w-full p-3 rounded-2xl bg-white border border-blue-100 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {mensaje && (
          <div className="mb-4 bg-blue-600 text-white p-3 rounded-2xl text-center font-semibold shadow">
            {mensaje}
          </div>
        )}

        {grupos.map((grupo) => (
          <div key={grupo.fecha} className="mb-8">
            <h2 className="text-lg font-extrabold mb-3 text-blue-700">
              📅 {grupo.fecha}
            </h2>

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
                        ? "bg-slate-100 border-slate-200 opacity-70"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="mb-3 text-center">
                      <p className="text-xs font-bold text-slate-500">
                        🕒 Inicia {horaTexto(partido.inicio)}
                      </p>

                      <p
                        className={`text-xs font-bold ${
                          cerrado ? "text-red-500" : "text-blue-500"
                        }`}
                      >
                        {cerrado
                          ? "🔒 Pronóstico cerrado"
                          : `⏳ Cierra en ${restante}`}
                      </p>

                      {!cerrado && (
                        <p className="text-[11px] text-slate-400">
                          Cierre oficial {cierreTexto(partido.inicio)}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 items-center gap-3">
                      <div className="text-center">
                        <div className="text-4xl mb-2">
                          {obtenerBandera(partido.local)}
                        </div>

                        <p className="font-bold text-sm">
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
                          className="w-14 p-2 rounded-xl bg-blue-50 border border-blue-100 text-center font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-200 disabled:text-slate-400"
                        />

                        <span className="font-bold text-slate-400">-</span>

                        <input
                          type="number"
                          min="0"
                          disabled={cerrado}
                          value={pronosticos[clave]?.visitante || ""}
                          onChange={(e) =>
                            cambiarMarcador(clave, "visitante", e.target.value)
                          }
                          className="w-14 p-2 rounded-xl bg-blue-50 border border-blue-100 text-center font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-200 disabled:text-slate-400"
                        />
                      </div>

                      <div className="text-center">
                        <div className="text-4xl mb-2">
                          {obtenerBandera(partido.visitante)}
                        </div>

                        <p className="font-bold text-sm">
                          {quitarBandera(partido.visitante)}
                        </p>
                      </div>
                    </div>

                    <p
                      className={`text-center text-sm font-bold mt-3 ${
                        cerrado ? "text-red-500" : "text-blue-600"
                      }`}
                    >
                      {cerrado ? "🔒 Cerrado" : "⚽ Tu pronóstico"}
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
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-extrabold text-lg disabled:opacity-50 shadow-lg"
        >
          {cargando ? "Guardando..." : "Guardar Pronósticos"}
        </button>
      </div>

      <BottomNav />
    </main>
  );
}


