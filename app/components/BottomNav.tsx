export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800">
      <div className="max-w-md mx-auto flex justify-around py-4 text-sm">
        <a href="/">🏠 Inicio</a>
        <a href="/quiniela">⚽ Quiniela</a>
        <a href="/ranking">🏆 Ranking</a>
      </div>
    </div>
  );
}