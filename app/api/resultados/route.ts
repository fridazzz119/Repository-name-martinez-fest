import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

function getDatabaseUrl() {
  return (
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL
  );
}

export async function GET() {
  const sql = neon(getDatabaseUrl()!);

  await sql`
    CREATE TABLE IF NOT EXISTS resultados (
      id SERIAL PRIMARY KEY,
      partido TEXT NOT NULL UNIQUE,
      goles_local INTEGER NOT NULL,
      goles_visitante INTEGER NOT NULL,
      actualizado_en TIMESTAMP DEFAULT NOW()
    );
  `;

  const resultados = await sql`
    SELECT partido, goles_local, goles_visitante
    FROM resultados
    ORDER BY partido;
  `;

  return NextResponse.json(resultados);
}

export async function POST(request: Request) {
  const sql = neon(getDatabaseUrl()!);
  const body = await request.json();

  const { partido, golesLocal, golesVisitante } = body;

  await sql`
    CREATE TABLE IF NOT EXISTS resultados (
      id SERIAL PRIMARY KEY,
      partido TEXT NOT NULL UNIQUE,
      goles_local INTEGER NOT NULL,
      goles_visitante INTEGER NOT NULL,
      actualizado_en TIMESTAMP DEFAULT NOW()
    );
  `;

  await sql`
    INSERT INTO resultados (
      partido,
      goles_local,
      goles_visitante
    )
    VALUES (
      ${partido},
      ${Number(golesLocal)},
      ${Number(golesVisitante)}
    )
    ON CONFLICT (partido)
    DO UPDATE SET
      goles_local = EXCLUDED.goles_local,
      goles_visitante = EXCLUDED.goles_visitante,
      actualizado_en = NOW();
  `;

  return NextResponse.json({ ok: true });
}
