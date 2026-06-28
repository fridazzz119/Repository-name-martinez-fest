export type Partido = {
  orden: number;
  dia: string;
  fecha: string;
  local: string;
  visitante: string;
  banderaLocal: string;
  banderaVisitante: string;
  inicio: string;
};

export const partidos: Partido[] = [
  {
    orden: 1,
    dia: "DOMINGO",
    fecha: "28 JUNIO",
    local: "Sudáfrica",
    visitante: "Canadá",
    banderaLocal: "🇿🇦",
    banderaVisitante: "🇨🇦",
    inicio: "2026-06-28T13:00:00-06:00",
  },
  {
    orden: 2,
    dia: "LUNES",
    fecha: "29 JUNIO",
    local: "Brasil",
    visitante: "Japón",
    banderaLocal: "🇧🇷",
    banderaVisitante: "🇯🇵",
    inicio: "2026-06-29T11:00:00-06:00",
  },
  {
    orden: 3,
    dia: "LUNES",
    fecha: "29 JUNIO",
    local: "Alemania",
    visitante: "Paraguay",
    banderaLocal: "🇩🇪",
    banderaVisitante: "🇵🇾",
    inicio: "2026-06-29T14:30:00-06:00",
  },
  {
    orden: 4,
    dia: "LUNES",
    fecha: "29 JUNIO",
    local: "Países Bajos",
    visitante: "Marruecos",
    banderaLocal: "🇳🇱",
    banderaVisitante: "🇲🇦",
    inicio: "2026-06-29T19:00:00-06:00",
  },
  {
    orden: 5,
    dia: "MARTES",
    fecha: "30 JUNIO",
    local: "Costa de Marfil",
    visitante: "Noruega",
    banderaLocal: "🇨🇮",
    banderaVisitante: "🇳🇴",
    inicio: "2026-06-30T11:00:00-06:00",
  },
  {
    orden: 6,
    dia: "MARTES",
    fecha: "30 JUNIO",
    local: "Francia",
    visitante: "Suecia",
    banderaLocal: "🇫🇷",
    banderaVisitante: "🇸🇪",
    inicio: "2026-06-30T15:00:00-06:00",
  },
  {
    orden: 7,
    dia: "MARTES",
    fecha: "30 JUNIO",
    local: "México",
    visitante: "Ecuador",
    banderaLocal: "🇲🇽",
    banderaVisitante: "🇪🇨",
    inicio: "2026-06-30T19:00:00-06:00",
  },
  {
    orden: 8,
    dia: "MIÉRCOLES",
    fecha: "1 JULIO",
    local: "Inglaterra",
    visitante: "RD Congo",
    banderaLocal: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    banderaVisitante: "🇨🇩",
    inicio: "2026-07-01T10:00:00-06:00",
  },
  {
    orden: 9,
    dia: "MIÉRCOLES",
    fecha: "1 JULIO",
    local: "Bélgica",
    visitante: "Senegal",
    banderaLocal: "🇧🇪",
    banderaVisitante: "🇸🇳",
    inicio: "2026-07-01T14:00:00-06:00",
  },
  {
    orden: 10,
    dia: "MIÉRCOLES",
    fecha: "1 JULIO",
    local: "Estados Unidos",
    visitante: "Bosnia y Herzegovina",
    banderaLocal: "🇺🇸",
    banderaVisitante: "🇧🇦",
    inicio: "2026-07-01T18:00:00-06:00",
  },
  {
    orden: 11,
    dia: "JUEVES",
    fecha: "2 JULIO",
    local: "España",
    visitante: "Austria",
    banderaLocal: "🇪🇸",
    banderaVisitante: "🇦🇹",
    inicio: "2026-07-02T13:00:00-06:00",
  },
  {
    orden: 12,
    dia: "JUEVES",
    fecha: "2 JULIO",
    local: "Portugal",
    visitante: "Croacia",
    banderaLocal: "🇵🇹",
    banderaVisitante: "🇭🇷",
    inicio: "2026-07-02T17:00:00-06:00",
  },
  {
    orden: 13,
    dia: "JUEVES",
    fecha: "2 JULIO",
    local: "Suiza",
    visitante: "Argelia",
    banderaLocal: "🇨🇭",
    banderaVisitante: "🇩🇿",
    inicio: "2026-07-02T21:00:00-06:00",
  },
  {
    orden: 14,
    dia: "VIERNES",
    fecha: "3 JULIO",
    local: "Australia",
    visitante: "Egipto",
    banderaLocal: "🇦🇺",
    banderaVisitante: "🇪🇬",
    inicio: "2026-07-03T12:00:00-06:00",
  },
  {
    orden: 15,
    dia: "VIERNES",
    fecha: "3 JULIO",
    local: "Argentina",
    visitante: "Cabo Verde",
    banderaLocal: "🇦🇷",
    banderaVisitante: "🇨🇻",
    inicio: "2026-07-03T16:00:00-06:00",
  },
  {
    orden: 16,
    dia: "VIERNES",
    fecha: "3 JULIO",
    local: "Colombia",
    visitante: "Ghana",
    banderaLocal: "🇨🇴",
    banderaVisitante: "🇬🇭",
    inicio: "2026-07-03T19:30:00-06:00",
  },
];

export function nombrePartido(partido: Partido) {
  return `${partido.local} vs ${partido.visitante}`;
}

export const horariosPartidos = Object.fromEntries(
  partidos.map((p) => [nombrePartido(p), p.inicio])
);
