import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const horariosPartidos: Record<string, string> = {
  "Suiza vs Canadá": "2026-06-24T13:00:00-06:00",
  "Bosnia y Herzegovina vs Catar": "2026-06-24T13:00:00-06:00",
  "Escocia vs Brasil": "2026-06-24T16:00:00-06:00",
  "Marruecos vs Haití": "2026-06-24T16:00:00-06:00",
  "República Checa vs México": "2026-06-24T19:00:00-06:00",
  "Sudáfrica vs Corea del Sur": "2026-06-24T19:00:00-06:00",

  "Alemania vs Ecuador": "2026-06-25T13:00:00-06:00",
  "Curazao vs Costa de Marfil": "2026-06-25T13:00:00-06:00",
  "Túnez vs Países Bajos": "2026-06-25T17:00:00-06:00",
  "Japón vs Suecia": "2026-06-25T17:00:00-06:00",
  "Estados Unidos vs Turquía": "2026-06-25T20:00:00-06:00",
  "Australia vs Paraguay": "2026-06-25T20:00:00-06:00",

  "Noruega vs Francia": "2026-06-26T13:00:00-06:00",
  "Senegal vs Irak": "2026-06-26T13:00:00-06:00",
  "Uruguay vs España": "2026-06-26T18:00:00-06:00",
  "Cabo Verde vs Arabia Saudita": "2026-06-26T18:00:00-06:00",
  "Egipto vs Irán": "2026-06-26T21:00:00-06:00",
  "Nueva Zelanda vs Bélgica": "2026-06-26T21:00:00-06:00",

  "Panamá vs Inglaterra": "2026-06-27T15:00:00-06:00",
  "Croacia vs Ghana": "2026-06-27T15:00:00-06:00",
  "Colombia vs Portugal": "2026-06-27T17:30:00-06:00",
  "RD Congo vs Uzbekistán": "2026-06-27T17:30:00-06:00",
  "Argelia vs Austria": "2026-06-27T20:00:00-06:00",
  "Jordania vs Argentina": "2026-06-27T20:00:00-06:00",
};

function normalizarNombre(nombre: string) {
  return nombre
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
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


