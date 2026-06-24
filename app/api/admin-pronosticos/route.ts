import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const sql = neon(process.env.POSTGRES_URL!);

export async function GET() {
  const pronosticos = await sql`
    SELECT nombre, partido, goles_local, goles_visitante
    FROM pronosticos
    ORDER BY partido, nombre;
  `;

  return NextResponse.json(pronosticos);
}
