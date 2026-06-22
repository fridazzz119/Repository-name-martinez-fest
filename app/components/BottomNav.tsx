export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800">
      <div className="max-w-md mx-auto grid grid-cols-5 py-3 text-xs text-center">
        <a href="/">🏠<br />Inicio</a>
        <a href="/quiniela">⚽<br />Quiniela</a>
        <a href="/pronosticos">👀<br />Pronósticos</a>
        <a href="/resultados">📊<br />Resultados</a>
        <a href="/ranking">🏆<br />Ranking</a>
      </div>
    </div>
  );
}

