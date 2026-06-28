import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { partidos } from "@/lib/partidos";

const sql = neon(process.env.POSTGRES_URL!);

export async function GET() {
  const pronosticos = await sql`
    SELECT nombre, partido, goles_local, goles_visitante
    FROM pronosticos;
  `;

  const orden = new Map(
    partidos.map((p) => [`${p.local} vs ${p.visitante}`, p.orden])
  );

  const ordenados = [...pronosticos].sort((a, b) => {
    const ordenA = orden.get(a.partido) ?? 999;
    const ordenB = orden.get(b.partido) ?? 999;

    if (ordenA !== ordenB) return ordenA - ordenB;

    return String(a.nombre).localeCompare(String(b.nombre));
  });

  return NextResponse.json(ordenados);
}

