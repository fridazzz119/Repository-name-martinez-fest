import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

function getDatabaseUrl() {
  const url =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL;

  if (!url) {
    throw new Error("No existe URL de base de datos");
  }

  return url;
}

function resultado(local: number, visitante: number) {
  if (local > visitante) return "local";
  if (local < visitante) return "visitante";
  return "empate";
}

export async function GET() {
  try {
    const sql = neon(getDatabaseUrl());

    const filas = await sql`
      SELECT
        p.nombre,
        p.partido,
        p.goles_local AS pred_local,
        p.goles_visitante AS pred_visitante,
        r.goles_local AS real_local,
        r.goles_visitante AS real_visitante
      FROM pronosticos p
      INNER JOIN resultados r
        ON p.partido = r.partido;
    `;

    const ranking: Record<
      string,
      { nombre: string; puntos: number; exactos: number; aciertos: number }
    > = {};

    for (const fila of filas) {
      const nombre = String(fila.nombre);

      if (!ranking[nombre]) {
        ranking[nombre] = {
          nombre,
          puntos: 0,
          exactos: 0,
          aciertos: 0,
        };
      }

      const predLocal = Number(fila.pred_local);
      const predVisitante = Number(fila.pred_visitante);
      const realLocal = Number(fila.real_local);
      const realVisitante = Number(fila.real_visitante);

      if (predLocal === realLocal && predVisitante === realVisitante) {
        ranking[nombre].puntos += 3;
        ranking[nombre].exactos += 1;
      } else if (
        resultado(predLocal, predVisitante) ===
        resultado(realLocal, realVisitante)
      ) {
        ranking[nombre].puntos += 1;
        ranking[nombre].aciertos += 1;
      }
    }

    const rankingOrdenado = Object.values(ranking).sort(
      (a, b) => b.puntos - a.puntos
    );

    return NextResponse.json(rankingOrdenado);
  } catch (error) {
    console.error("ERROR RANKING:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido en ranking",
      },
      { status: 500 }
    );
  }
}
