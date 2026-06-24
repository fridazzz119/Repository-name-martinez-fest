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
  ORDER BY
CASE partido
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
END,
nombre;
  `;

  return NextResponse.json(pronosticos);
}
