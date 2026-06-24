export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-6 py-3 text-[11px] text-center text-slate-600">
        <a href="/">🏠<br />Inicio</a>
        <a href="/quiniela">⚽<br />Quiniela</a>
        <a href="/pronosticos">👤<br />Mis</a> 
        <a href="/resultados">📊<br />Resultados</a>
        <a href="/ranking">🏆<br />Ranking</a>
        <a href="/admin">⚙️<br />Admin</a>
      </div>
    </div>
  );
}



