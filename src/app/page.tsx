import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <div className="text-xs tracking-[4px] text-teal-light mb-3 font-bold">
          DOCFLOW AI
        </div>
        <h1 className="font-display text-5xl font-extrabold text-white mb-4 leading-tight">
          Procesare documente<br />
          <span className="text-teal-light">configurabila cu AI</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-md leading-relaxed">
          Defineste orice flux de analiza documente fara a scrie cod.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10 w-full max-w-xl">
        {[
          { label: 'Infrastructura', status: '✓ Live',     color: 'text-green-400' },
          { label: 'Baza de date',   status: '✓ Supabase', color: 'text-green-400' },
          { label: 'AI Engine',      status: '◌ Step 2',   color: 'text-amber-400' },
        ].map(c => (
          <div key={c.label} className="bg-navy-950 border border-white/5 rounded-lg p-4 text-center">
            <div className={`text-base font-bold ${c.color} font-display`}>{c.status}</div>
            <div className="text-xs text-slate-500 mt-1 tracking-wider">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Link href="/dashboard"
          className="px-6 py-3 bg-teal text-white rounded-lg font-bold text-sm hover:bg-teal-light transition-colors tracking-wide">
          → Dashboard
        </Link>
        <a href="/api/health" target="_blank"
          className="px-6 py-3 border border-white/10 text-slate-400 rounded-lg font-bold text-sm hover:border-teal/50 hover:text-teal-light transition-colors tracking-wide">
          ⚡ Health Check
        </a>
      </div>
    </main>
  )
}
