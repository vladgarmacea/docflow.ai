-- ============================================================
-- DocFlow AI — Initial Schema
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- Or via: supabase db push
-- ============================================================

-- ── Extensions ────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Workflows ─────────────────────────────────────────────────────────────────
-- A workflow is a reusable document processing pipeline.
-- config (jsonb) stores the full WorkflowConfig.

create table if not exists public.workflows (
  id          uuid        primary key default uuid_generate_v4(),
  name        text        not null,
  description text,
  config      jsonb       not null default '{}',
  is_active   boolean     not null default true,
  created_by  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.workflows is 'Reusable document processing pipelines';
comment on column public.workflows.config is 'WorkflowConfig JSON — defines steps, prompts, output schema';

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger workflows_updated_at
  before update on public.workflows
  for each row execute function public.set_updated_at();

-- ── Runs ──────────────────────────────────────────────────────────────────────
-- Each time a document is processed through a workflow, a run is created.

create table if not exists public.runs (
  id           uuid        primary key default uuid_generate_v4(),
  workflow_id  uuid        not null references public.workflows(id) on delete cascade,
  filename     text        not null,
  file_path    text,                        -- path in Supabase Storage
  status       text        not null default 'pending'
                           check (status in ('pending','processing','done','error')),
  result       jsonb,                       -- full analysis output
  error        text,
  created_by   text,
  created_at   timestamptz not null default now(),
  completed_at timestamptz
);

comment on table public.runs is 'Individual document processing runs';

create index runs_workflow_id_idx on public.runs(workflow_id);
create index runs_status_idx      on public.runs(status);
create index runs_created_at_idx  on public.runs(created_at desc);

-- ── Context Files ─────────────────────────────────────────────────────────────
-- Files attached to a workflow to provide AI context
-- (e.g. company profile PDF, standards doc, past results JSON)

create table if not exists public.context_files (
  id          uuid        primary key default uuid_generate_v4(),
  workflow_id uuid        not null references public.workflows(id) on delete cascade,
  name        text        not null,
  description text,
  file_path   text        not null,
  file_type   text        not null check (file_type in ('pdf','json','txt','csv')),
  parsed_text text,
  created_at  timestamptz not null default now()
);

comment on table public.context_files is 'Context files attached to workflows (company profiles, specs, etc.)';

-- ── Storage Buckets ───────────────────────────────────────────────────────────
-- Create via Supabase Dashboard → Storage → New Bucket
-- Or run these (requires Supabase admin privileges):

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('documents', 'documents', false, 10485760,  -- 10MB
   array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain','application/json','text/csv']),
  ('context',   'context',   false, 10485760,
   array['application/pdf','application/json','text/plain','text/csv'])
on conflict (id) do nothing;

-- ── Row Level Security ────────────────────────────────────────────────────────
-- For now: open access (no auth yet — Step 2 will add Supabase Auth)
-- These policies allow the anon key to do everything.
-- IMPORTANT: tighten these when you add authentication.

alter table public.workflows     enable row level security;
alter table public.runs          enable row level security;
alter table public.context_files enable row level security;

-- Workflows: full access (tighten later)
create policy "allow all workflows" on public.workflows
  for all using (true) with check (true);

-- Runs: full access
create policy "allow all runs" on public.runs
  for all using (true) with check (true);

-- Context files: full access
create policy "allow all context_files" on public.context_files
  for all using (true) with check (true);

-- Storage: full access on both buckets
create policy "allow all documents storage" on storage.objects
  for all using (bucket_id = 'documents') with check (bucket_id = 'documents');

create policy "allow all context storage" on storage.objects
  for all using (bucket_id = 'context') with check (bucket_id = 'context');

-- ── Seed: Built-in Workflow Examples ─────────────────────────────────────────
-- 2 starter workflows so the app isn't empty on first load

insert into public.workflows (name, description, config) values

-- 1. The BidBot workflow we already built
(
  'Analiză Licitații SEAP',
  'Extrage cerințele dintr-un caiet de sarcini și calculează eligibilitatea companiei',
  '{
    "version": "1.0",
    "name": "Analiză Licitații SEAP",
    "description": "Extrage cerințele dintr-un caiet de sarcini și calculează eligibilitatea companiei",
    "input": {
      "type": "pdf",
      "description": "Caiet de sarcini sau documentație licitație publică"
    },
    "context": {
      "companyProfile": true
    },
    "steps": [
      {
        "id": "extract_requirements",
        "name": "Extragere cerințe",
        "type": "extract",
        "prompt": "Extrage toate cerințele din acest caiet de sarcini: tehnice, financiare, administrative, de personal și certificate. Pentru fiecare cerință returnează: id, categorie, descriere, obligatorie (bool), document_dovada, nota.",
        "outputKey": "cerinte",
        "required": true
      },
      {
        "id": "gap_analysis",
        "name": "Gap Analysis",
        "type": "analyze",
        "prompt": "Compară cerințele extrase cu profilul companiei din context. Pentru fiecare cerință determină statusul: indeplinit/partial/lipsa/neclar. Calculează scorul de eligibilitate (0-100) și recomandarea finală: participa/analizeaza/evita.",
        "outputKey": "gap_analysis",
        "required": true,
        "dependsOn": ["extract_requirements"]
      }
    ],
    "output": {
      "format": "json"
    }
  }'
),

-- 2. Generic contract review workflow
(
  'Analiză Contract',
  'Extrage clauzele cheie dintr-un contract, identifică riscurile și sumarizează obligațiile',
  '{
    "version": "1.0",
    "name": "Analiză Contract",
    "description": "Extrage clauzele cheie, identifică riscuri și sumarizează obligațiile",
    "input": {
      "type": "pdf",
      "description": "Contract în format PDF"
    },
    "steps": [
      {
        "id": "extract_parties",
        "name": "Identificare părți",
        "type": "extract",
        "prompt": "Identifică toate părțile contractante, reprezentanții legali, datele de identificare și rolul fiecăreia în contract.",
        "outputKey": "parti",
        "required": true
      },
      {
        "id": "extract_obligations",
        "name": "Extragere obligații",
        "type": "extract",
        "prompt": "Extrage toate obligațiile fiecărei părți: livrabile, termene, penalități, condiții de plată.",
        "outputKey": "obligatii",
        "required": true
      },
      {
        "id": "risk_analysis",
        "name": "Analiză riscuri",
        "type": "analyze",
        "prompt": "Identifică clauzele cu risc ridicat: penalități disproporționate, termene nerealiste, clauze unilaterale, lipsa limitărilor de răspundere. Clasifică fiecare risc: critic/major/minor.",
        "outputKey": "riscuri",
        "required": true,
        "dependsOn": ["extract_obligations"]
      },
      {
        "id": "summary",
        "name": "Sumar executiv",
        "type": "summarize",
        "prompt": "Scrie un sumar de maxim 200 cuvinte al contractului: obiect, valoare, durată, obligații cheie și recomandare de semnare.",
        "outputKey": "sumar",
        "required": true,
        "dependsOn": ["extract_parties", "extract_obligations", "risk_analysis"]
      }
    ],
    "output": {
      "format": "json"
    }
  }'
);

-- ============================================================
-- Done. Tables created:
--   public.workflows      — workflow definitions
--   public.runs           — processing history
--   public.context_files  — context/profile files per workflow
-- Storage buckets:
--   documents             — uploaded input files
--   context               — workflow context files
-- ============================================================
