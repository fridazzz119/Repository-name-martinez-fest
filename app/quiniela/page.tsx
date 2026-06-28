"use client";

import { useState } from "react";
import { Clock, Lock, Timer, Save } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { nombrePartido, partidos } from "@/lib/partidos";

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
  const grupos = agruparPorDia();

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

    const partidosAbiertos = partidos.filter(
      (partido) => !estaCerrado(partido.inicio)
    );

    const pronosticosPermitidos: Record<
      string,
      { local: string; visitante: string }
    > = {};

    for (const partido of partidosAbiertos) {
      const clave = nombrePartido(partido);

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
    <main className="min-h-screen bg-slate-50 text-black p-4 pb-32">
      <div className="max-w-md mx-auto">
        <div className="pt-4 mb-6 text-center">
          <p className="text-xs font-extrabold tracking-[0.35em] text-blue-600 mb-2">
            SEGUNDA EDICIÓN
          </p>

          <h1 className="text-4xl font-black tracking-tight text-black">
            CEJUDO FEST
          </h1>

          <p className="text-slate-500 font-semibold mt-2">
            Quiniela Mundial 2026 · Eliminatoria de 32
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[28px] p-4 mb-6 shadow-sm">
          <label className="block text-sm text-slate-500 mb-2 font-semibold">
            Tu nombre
          </label>

          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Frida"
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-black font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
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
                const cerrado = estaCerrado(partido.inicio);
                const restante = tiempoRestante(partido.inicio);

                return (
                  <div
                    key={clave}
                    className={`overflow-hidden border rounded-[30px] shadow-sm ${
                      cerrado
                        ? "bg-slate-100 border-slate-200 opacity-75"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500 font-extrabold text-xs">
                        <Clock size={15} />
                        <span>{horaTexto(partido.inicio)}</span>
                      </div>

                      <div
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-black ${
                          cerrado
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : "bg-blue-50 text-blue-600 border border-blue-100"
                        }`}
                      >
                        {cerrado ? <Lock size={13} /> : <Timer size={13} />}
                        <span>
                          {cerrado ? "CERRADO" : `CIERRA ${restante}`}
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
    <input
      type="number"
      min="0"
      disabled={cerrado}
      value={pronosticos[clave]?.local || ""}
      onChange={(e) =>
        cambiarMarcador(clave, "local", e.target.value)
      }
      className="w-14 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-center font-black text-xl outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-200 disabled:text-slate-400"
    />

    <span className="font-black text-xl text-slate-300">
      -
    </span>

    <input
      type="number"
      min="0"
      disabled={cerrado}
      value={pronosticos[clave]?.visitante || ""}
      onChange={(e) =>
        cambiarMarcador(clave, "visitante", e.target.value)
      }
      className="w-14 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-center font-black text-xl outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-200 disabled:text-slate-400"
    />
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

                      {!cerrado && (
                        <p className="text-[11px] text-slate-400 font-semibold text-center mt-5">
                          Cierre oficial {cierreTexto(partido.inicio)}
                        </p>
                      )}
                    </div>
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




