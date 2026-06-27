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
      total: 24,
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
    WHERE p.nombre = ${nombreNormalizado}
    ORDER BY
      CASE p.partido
        WHEN 'Suiza vs Canadá' THEN 1
        WHEN 'Bosnia y Herzegovina vs Catar' THEN 2
        WHEN 'Escocia vs Brasil' THEN 3
        WHEN 'Marruecos vs Haití' THEN 4
        WHEN 'República Checa vs México' THEN 5
        WHEN 'Sudáfrica vs Corea del Sur' THEN 6

        WHEN 'Alemania vs Ecuador' THEN 7
        WHEN 'Curazao vs Costa de Marfil' THEN 8
        WHEN 'Túnez vs Países Bajos' THEN 9
        WHEN 'Japón vs Suecia' THEN 10
        WHEN 'Estados Unidos vs Turquía' THEN 11
        WHEN 'Australia vs Paraguay' THEN 12

        WHEN 'Noruega vs Francia' THEN 13
        WHEN 'Senegal vs Irak' THEN 14
        WHEN 'Uruguay vs España' THEN 15
        WHEN 'Cabo Verde vs Arabia Saudita' THEN 16
        WHEN 'Egipto vs Irán' THEN 17
        WHEN 'Nueva Zelanda vs Bélgica' THEN 18

        WHEN 'Panamá vs Inglaterra' THEN 19
        WHEN 'Croacia vs Ghana' THEN 20
        WHEN 'Colombia vs Portugal' THEN 21
        WHEN 'RD Congo vs Uzbekistán' THEN 22
        WHEN 'Argelia vs Austria' THEN 23
        WHEN 'Jordania vs Argentina' THEN 24
      END;
  `;

  const pronosticos = filas.map((fila) => {
    const predLocal = Number(fila.goles_local);
    const predVisitante = Number(fila.goles_visitante);

    const hayResultado =
      fila.resultado_local !== null && fila.resultado_visitante !== null;

    if (!hayResultado) {
      return {
        ...fila,
        puntos: 0,
        estado: "pendiente",
        texto: "⏳ Resultado pendiente",
      };
    }

    const realLocal = Number(fila.resultado_local);
    const realVisitante = Number(fila.resultado_visitante);

    if (predLocal === realLocal && predVisitante === realVisitante) {
      return {
        ...fila,
        puntos: 3,
        estado: "exacto",
        texto: "🎯 Marcador exacto +3",
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
        texto: "✅ Ganador/empate correcto +1",
      };
    }

    return {
      ...fila,
      puntos: 0,
      estado: "fallo",
      texto: "❌ Sin puntos",
    };
  });

  return NextResponse.json({
    pronosticos,
    total: 24,
    registrados: pronosticos.length,
  });
}
