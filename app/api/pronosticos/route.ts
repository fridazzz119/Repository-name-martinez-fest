import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nombre = searchParams.get("nombre");

  if (!nombre) {
    return NextResponse.json([]);
  }

  const nombreNormalizado = normalizarNombre(nombre);

  const pronosticos = await sql`
    SELECT nombre, partido, goles_local, goles_visitante
    FROM pronosticos
    WHERE nombre = ${nombreNormalizado}
    ORDER BY partido;
  `;

  return NextResponse.json(pronosticos);
}
