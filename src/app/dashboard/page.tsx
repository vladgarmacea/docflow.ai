import { createClient } from '@/lib/supabase/server'
import { Workflow } from '@/types/database'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data, error } = await supabase
  .from('workflows')
  .select('*')
  .order('created_at', { ascending: false })

const workflows = data as Workflow[] | null
  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <Link href="/" className="text-xs text-slate-500 hover:text-teal-light mb-2 block">← Acasa</Link>
          <h1 className="font-display text-3xl font-extrabold text-white">Workflows</h1>
          <p className="text-slate-500 text-sm mt-1">Fluxuri de procesare documente configurate</p>
        </div>
        <div className="text-xs text-slate-600 text-right">
          <div className="text-teal-light font-bold text-lg">{workflows?.length ?? 0}</div>
          <div className="tracking-wider">workflows</div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6 text-red-400 text-sm">
          Supabase error: {error.message}
        </div>
      )}

      <div className="grid gap-4">
        {workflows?.map(w => (
          <div key={w.id} className="bg-navy-950 border border-white/5 rounded-xl p-6 hover:border-teal/30 transition-colors group">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-display text-lg font-bold text-white group-hover:text-teal-light transition-colors">
                    {w.name}
                  </h2>
                  <span className={`text-xs px-2 py-0.5 rounded border font-bold tracking-wide ${w.is_active ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-slate-500 border-slate-600/30'}`}>
                    {w.is_active ? 'ACTIV' : 'INACTIV'}
                  </span>
                </div>
                {w.description && <p className="text-slate-400 text-sm">{w.description}</p>}
              </div>
              <div className="text-xs text-slate-600 text-right ml-6 shrink-0">
                <div>{new Date(w.created_at).toLocaleDateString('ro-RO')}</div>
                <div className="text-teal/60 mt-1">{(w.config as any)?.steps?.length ?? 0} pasi</div>
              </div>
            </div>
            {(w.config as any)?.steps && (
              <div className="flex gap-2 mt-4 flex-wrap">
                {(w.config as any).steps.map((step: any, i: number) => (
                  <span key={step.id} className="text-xs px-2 py-1 rounded bg-navy-900 border border-white/5 text-slate-500">
                    {i + 1}. {step.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 border border-white/5 rounded-xl bg-navy-950/50">
        <div className="text-xs text-teal-light tracking-[3px] mb-3 font-bold">STEP 2 — IN CURAND</div>
        <div className="grid grid-cols-3 gap-4 text-sm text-slate-500">
          {['🤖 AI workflow execution', '📄 PDF upload + processing', '⚙️ Visual workflow builder'].map(f => (
            <div key={f}>{f}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
