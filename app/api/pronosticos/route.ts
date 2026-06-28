import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { partidos } from "@/lib/partidos";

const sql = neon(process.env.POSTGRES_URL!);

function normalizarNombre(nombre: string) {
  return nombre
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\.\s+/g, ".");
}

function resultado(local: number, visitante: number) {
  if (local > visitante) return "local";
  if (local < visitante) return "visitante";
  return "empate";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nombre = searchParams.get("nombre");

  if (!nombre) {
    return NextResponse.json({
      pronosticos: [],
      total: partidos.length,
      registrados: 0,
    });
  }

  const nombreNormalizado = normalizarNombre(nombre);

  const filas = await sql`
    SELECT
      p.nombre,
      p.partido,
      p.goles_local,
      p.goles_visitante,
      p.creado_en,
      r.goles_local AS resultado_local,
      r.goles_visitante AS resultado_visitante
    FROM pronosticos p
    LEFT JOIN resultados r
      ON p.partido = r.partido
    WHERE p.nombre = ${nombreNormalizado};
  `;

  const orden = new Map(
    partidos.map((p) => [`${p.local} vs ${p.visitante}`, p.orden])
  );

  const filasOrdenadas = [...filas].sort((a, b) => {
    const ordenA = orden.get(a.partido) ?? 999;
    const ordenB = orden.get(b.partido) ?? 999;

    return ordenA - ordenB;
  });

  const pronosticos = filasOrdenadas.map((fila) => {
    const predLocal = Number(fila.goles_local);
    const predVisitante = Number(fila.goles_visitante);

    const hayResultado =
      fila.resultado_local !== null && fila.resultado_visitante !== null;

    if (!hayResultado) {
      return {
        ...fila,
        puntos: 0,
        estado: "pendiente",
        texto: "Resultado pendiente",
      };
    }

    const realLocal = Number(fila.resultado_local);
    const realVisitante = Number(fila.resultado_visitante);

    if (predLocal === realLocal && predVisitante === realVisitante) {
      return {
        ...fila,
        puntos: 3,
        estado: "exacto",
        texto: "Marcador exacto +3",
      };
    }

    if (
      resultado(predLocal, predVisitante) ===
      resultado(realLocal, realVisitante)
    ) {
      return {
        ...fila,
        puntos: 1,
        estado: "acierto",
        texto: "Ganador/empate correcto +1",
      };
    }

    return {
      ...fila,
      puntos: 0,
      estado: "fallo",
      texto: "Sin puntos",
    };
  });

  return NextResponse.json({
    pronosticos,
    total: partidos.length,
    registrados: pronosticos.length,
  });
}
