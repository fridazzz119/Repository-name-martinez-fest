import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { horariosPartidos } from "@/lib/partidos";

function normalizarNombre(nombre: string) {
  return nombre
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\.\s+/g, ".");
}

function getDatabaseUrl() {
  const url =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL;

  if (!url) {
    throw new Error("No existe POSTGRES_URL, DATABASE_URL o POSTGRES_PRISMA_URL");
  }

  return url;
}

function estaCerrado(partido: string) {
  const inicio = horariosPartidos[partido];

  if (!inicio) {
    return true;
  }

  const inicioPartido = new Date(inicio).getTime();
  const cierre = inicioPartido - 30 * 60 * 1000;

  return Date.now() >= cierre;
}

export async function POST(request: Request) {
  try {
    const sql = neon(getDatabaseUrl());

    const body = await request.json();
    const { nombre, pronosticos } = body;

    if (!nombre || !pronosticos) {
      return NextResponse.json(
        { error: "Falta nombre o pronósticos" },
        { status: 400 }
      );
    }

    const nombreNormalizado = normalizarNombre(nombre);

    await sql`
      CREATE TABLE IF NOT EXISTS pronosticos (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        partido TEXT NOT NULL,
        goles_local INTEGER NOT NULL,
        goles_visitante INTEGER NOT NULL,
        creado_en TIMESTAMP DEFAULT NOW(),
        UNIQUE(nombre, partido)
      );
    `;

    let guardados = 0;
    let bloqueados = 0;

    for (const partido of Object.keys(pronosticos)) {
      const marcador = pronosticos[partido];

      if (marcador.local === "" || marcador.visitante === "") {
        continue;
      }

      if (estaCerrado(partido)) {
        bloqueados++;
        continue;
      }

      await sql`
        INSERT INTO pronosticos (
          nombre,
          partido,
          goles_local,
          goles_visitante
        )
        VALUES (
          ${nombreNormalizado},
          ${partido},
          ${Number(marcador.local)},
          ${Number(marcador.visitante)}
        )
        ON CONFLICT (nombre, partido)
        DO UPDATE SET
          goles_local = EXCLUDED.goles_local,
          goles_visitante = EXCLUDED.goles_visitante,
          creado_en = NOW();
      `;

      guardados++;
    }

    if (guardados === 0 && bloqueados > 0) {
      return NextResponse.json(
        { error: "Los partidos seleccionados ya están cerrados" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      ok: true,
      mensaje: "Pronósticos guardados correctamente",
      guardados,
      bloqueados,
    });
  } catch (error) {
    console.error("ERROR GUARDAR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al guardar pronósticos",
      },
      { status: 500 }
    );
  }
}



