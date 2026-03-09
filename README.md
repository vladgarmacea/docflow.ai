# DocFlow AI

> Configure any document processing workflow with AI — no code required.

DocFlow AI is a platform where you define how documents should be analyzed, and AI does the rest. Upload a contract, a procurement spec, an invoice, or any structured document — and get back exactly what you configured: extracted fields, risk analysis, compliance scores, summaries, or any custom output.

---

## What it does

Instead of building a separate tool for each document type, DocFlow AI lets you configure a reusable **workflow** — a pipeline of AI-powered steps that runs against any uploaded document.

A workflow for a procurement document might look like:
1. Extract all technical and financial requirements
2. Run gap analysis against the company profile
3. Return an eligibility score and a compliance matrix

The same platform can run a completely different workflow for contracts:
1. Identify all parties and their obligations
2. Flag high-risk clauses
3. Write an executive summary

The workflow definition drives everything. No code changes needed between use cases.

---

## Key concepts

**Workflow** — A named, reusable pipeline with one or more AI steps. Defined as JSON, generated from a spec PDF, or built in the UI editor.

**Step** — A single Claude AI instruction within a workflow. Each step has a type (`extract`, `analyze`, `summarize`, `classify`, `validate`, `transform`), a prompt, and an output key in the result.

**Run** — One document processed through one workflow. Results are stored and queryable.

**Context File** — A PDF, JSON, or text file attached to a workflow to give the AI background knowledge — company profiles, standards documents, reference data.

---

## Built with

- **Next.js 14** — full-stack React framework, App Router, TypeScript
- **Supabase** — Postgres database, file storage, authentication
- **Anthropic Claude** — AI engine for all document analysis steps
- **Vercel** — deployment and serverless functions
- **Tailwind CSS** — styling

---

## Use cases

- 🏛️ **Government procurement** — analyze Romanian SEAP licitații, extract requirements, score eligibility
- 📋 **Contract review** — identify parties, obligations, risks, and generate summaries
- 🧾 **Invoice processing** — extract structured data from unstructured documents
- 📄 **CV screening** — evaluate candidates against job requirements
- 📑 **Compliance checking** — validate documents against internal standards or regulations

---

## Status

| Step | Status |
|------|--------|
| Infrastructure (Next.js + Supabase + Vercel) | ✅ Done |
| AI execution engine | 🔨 In progress |
| Workflow configuration UI | ⏳ Planned |
| AI-generated workflow from spec PDF | ⏳ Planned |
| Authentication | ⏳ Planned |
| Excel / Word export | ⏳ Planned |

---

## License

Private — all rights reserved.
