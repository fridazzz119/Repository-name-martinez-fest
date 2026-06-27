"use client";

import { useState } from "react";
import BottomNav from "../components/BottomNav";

type Pronostico = {
  nombre: string;
  partido: string;
  goles_local: number;
  goles_visitante: number;
  creado_en: string;
  resultado_local: number | null;
  resultado_visitante: number | null;
  puntos: number;
  estado: "pendiente" | "exacto" | "acierto" | "fallo";
  texto: string;
};

type RespuestaPronosticos = {
  pronosticos: Pronostico[];
  total: number;
  registrados: number;
};

function colorEstado(estado: Pronostico["estado"]) {
  if (estado === "exacto") {
    return "bg-green-50 border-green-200 text-green-700";
  }

  if (estado === "acierto") {
    return "bg-blue-50 border-blue-200 text-blue-700";
  }

  if (estado === "fallo") {
    return "bg-red-50 border-red-200 text-red-600";
  }

  return "bg-amber-50 border-amber-200 text-amber-600";
}

export default function PronosticosPage() {
  const [nombre, setNombre] = useState("");
  const [pronosticos, setPronosticos] = useState<Pronostico[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [registrados, setRegistrados] = useState(0);
  const [total, setTotal] = useState(24);
  const [buscado, setBuscado] = useState(false);

  const porcentaje = total > 0 ? Math.round((registrados / total) * 100) : 0;
  const pendientes = total - registrados;
  const puntosTotales = pronosticos.reduce((acc, p) => acc + p.puntos, 0);

  async function buscarPronosticos() {
    if (!nombre.trim()) {
      setMensaje("⚠️ Escribe tu nombre");
      return;
    }

    setMensaje("");
    setBuscado(true);

    const res = await fetch(
      `/api/pronosticos?nombre=${encodeURIComponent(nombre)}`
    );

    const data: RespuestaPronosticos = await res.json();

    setPronosticos(data.pronosticos || []);
    setRegistrados(data.registrados || 0);
    setTotal(data.total || 24);

    if (!data.pronosticos || data.pronosticos.length === 0) {
      setMensaje("No encontramos pronósticos con ese nombre");
    }
  }

  return (
    <main className="min-h-screen bg-white text-black p-4 pb-32">
      <div className="max-w-md mx-auto">
        <div className="mb-6 pt-2">
          <h1 className="text-3xl font-extrabold text-black">
            ⚽ Mis Pronósticos
          </h1>

          <p className="text-slate-500 font-semibold">
            Revisa tus marcadores, resultados y puntos
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 mb-5 shadow-sm">
          <label className="block text-sm text-slate-500 mb-2 font-semibold">
            Tu nombre
          </label>

          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Frida"
            className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-black outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />

          <button
            onClick={buscarPronosticos}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-2xl font-extrabold"
          >
            Ver mis pronósticos
          </button>
        </div>

        {buscado && (
          <div className="bg-white border border-slate-200 rounded-3xl p-4 mb-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-slate-500 font-semibold">
                  Pronósticos registrados
                </p>

                <p className="text-3xl font-extrabold text-black">
                  {registrados}
                  <span className="text-slate-400 text-xl"> / {total}</span>
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-500 font-semibold">
                  Avance
                </p>

                <p className="text-2xl font-extrabold text-blue-600">
                  {porcentaje}%
                </p>
              </div>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-200">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${porcentaje}%` }}
              />
            </div>

            <div className="grid grid-cols-3 border border-slate-200 rounded-2xl overflow-hidden text-center">
              <div className="p-3">
                <p className="text-xs text-slate-500 font-semibold">
                  Registrados
                </p>
                <p className="text-xl font-extrabold text-black">
                  {registrados}
                </p>
              </div>

              <div className="p-3 border-x border-slate-200">
                <p className="text-xs text-slate-500 font-semibold">
                  Pendientes
                </p>
                <p className="text-xl font-extrabold text-black">
                  {pendientes}
                </p>
              </div>

              <div className="p-3">
                <p className="text-xs text-slate-500 font-semibold">
                  Puntos
                </p>
                <p className="text-xl font-extrabold text-blue-600">
                  {puntosTotales}
                </p>
              </div>
            </div>
          </div>
        )}

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
              <div className="flex justify-between gap-3 mb-4">
                <div>
                  <p className="font-extrabold text-black">
                    {p.partido}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500 font-semibold">
                    Puntos
                  </p>

                  <p
                    className={`text-2xl font-extrabold ${
                      p.puntos > 0 ? "text-blue-600" : "text-slate-400"
                    }`}
                  >
                    {p.estado === "pendiente" ? "-" : p.puntos}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                  <p className="text-xs text-slate-500 font-semibold mb-1">
                    Tu pronóstico
                  </p>

                  <p className="text-2xl font-extrabold text-black">
                    {p.goles_local} - {p.goles_visitante}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                  <p className="text-xs text-slate-500 font-semibold mb-1">
                    Resultado oficial
                  </p>

                  <p className="text-2xl font-extrabold text-black">
                    {p.resultado_local === null ||
                    p.resultado_visitante === null
                      ? "-"
                      : `${p.resultado_local} - ${p.resultado_visitante}`}
                  </p>
                </div>
              </div>

              <div
                className={`border rounded-2xl p-3 text-center font-extrabold ${colorEstado(
                  p.estado
                )}`}
              >
                {p.texto}
              </div>

              <div className="border-t border-slate-100 mt-4 pt-3">
  <p className="text-[11px] text-slate-400 font-semibold">
    🕒 Última modificación
  </p>

  <p className="text-sm text-slate-600 font-semibold">
    {new Date(p.creado_en).toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    })}
  </p>
</div>
            </div>
          ))}
        </div>

        {buscado && pronosticos.length > 0 && (
          <div className="mt-5 bg-blue-50 border border-blue-100 rounded-3xl p-4 text-sm text-slate-600 font-semibold">
            ℹ️ Los puntos se actualizan automáticamente cuando se capturan los
            resultados oficiales.
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}




