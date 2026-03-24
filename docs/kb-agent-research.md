# Knowledge Base Agent for 3301dev.com — Research & Recommendation

## Context

The support page (`support.html`) has a demo AI chat widget using client-side keyword pattern matching (ADR-005). The PRD and memory-bank both track this as a known gap: "AI chat is demo-only — needs a real backend (LLM API) for production." This document researches how to replace it with a real knowledge base agent, prioritizing simplicity and low cost.

## Key Finding: The KB Is Tiny

| Content | Source | ~Words |
|---------|--------|--------|
| Service descriptions (4 categories) | `index.html` / `i18n.js` | 80 |
| Pricing tiers + features + comparison | `pricing.html` / `i18n.js` | 260 |
| FAQ (5 Q&A pairs) | `support.html` / `i18n.js` | 150 |
| Team info (Human vs AI agents) | `index.html` / `i18n.js` | 80 |
| Platform vision / company description | `i18n.js` | 60 |
| Trial benefits | `try-free.html` / `i18n.js` | 60 |
| Contact info | `support.html` | 20 |
| **Total** | | **~710 words (~1,000 tokens)** |

This eliminates the need for any RAG infrastructure. The entire KB fits trivially in a system prompt — even a 4K context window has room to spare.

## 8 Approaches Evaluated

| # | Approach | $/month | Impl hours | Quality | Verdict |
|---|----------|---------|------------|---------|---------|
| 1 | Cloudflare Workers AI + Vectorize | $0-15 | 12-20 | Moderate | Over-engineered |
| 2 | OpenAI Assistants API + retrieval | $2-5 | 8-14 | High | Unnecessary layers |
| 3 | Vercel AI SDK + Edge Functions | $2-5 | 6-10 | High | SDK is overkill for vanilla JS |
| 4 | n8n / Flowise (self-hosted) | $6-11 | 8-16 | High | Server management burden |
| 5 | Client-side WebLLM (browser inference) | $0 | 6-10 | Poor | 500MB+ download, bad UX |
| 6 | Pre-computed embeddings + serverless | $2-5 | 10-16 | Med-High | Engineering for engineering's sake |
| 7 | Supabase + pgvector + Edge Functions | $2-5 | 14-22 | High | Forklift for a coffee cup |
| **8** | **Prompt-stuffing + serverless proxy** | **$0-2** | **3-5** | **Excellent** | **Clear winner** |

## Recommended Approach: Prompt-Stuffing + Serverless Proxy

### Why This Wins

- **$0-2/month** at 100-1,000 queries/day (GPT-4o-mini or Gemini Flash)
- **3-5 hours** to implement — minimal code change to existing site
- **No RAG needed** — model sees ALL knowledge every time (better than retrieval for tiny KBs)
- **No infrastructure** — no databases, no vector stores, no embedding pipelines
- **Perfect fit** for static site — one serverless function, one `fetch()` call from frontend
- **0.5-1.5s latency** with streaming (fastest of all options)

### Architecture

```
Browser (support.html)       Serverless Function          LLM API
┌──────────────────┐        ┌─────────────────┐        ┌──────────┐
│ Chat Widget (JS) │─POST──>│ /api/chat       │──────> │ GPT-4o   │
│ - User types msg │        │ - System prompt │        │ -mini    │
│ - Shows history  │<─SSE───│ - History + msg │<────── │          │
│ - Streams resp.  │        │ - Streams back  │        │          │
└──────────────────┘        └─────────────────┘        └──────────┘
        │
   uses window.i18n
   for lang detection
```

### Hosting Options for the Serverless Function

| Platform | Free Tier | Fits Static Site? | Notes |
|----------|-----------|-------------------|-------|
| **Cloudflare Workers** | 100K req/day, free | Yes (Pages + Workers) | Best free tier, edge-deployed |
| **Vercel Edge Functions** | 100K invocations/month | Yes (static + functions) | Easy deploy from GitHub |
| **Netlify Functions** | 125K invocations/month | Yes (static + functions) | Simple setup |

### LLM Provider Options (cheapest first)

| Provider | Model | Input/1M tokens | Output/1M tokens | Notes |
|----------|-------|-----------------|-------------------|-------|
| Google | Gemini 2.0 Flash | $0.10 | $0.40 | Cheapest, free tier available |
| OpenAI | GPT-4o-mini | $0.15 | $0.60 | Best quality/price ratio |
| Anthropic | Claude 3.5 Haiku | $0.25 | $1.25 | Strong quality |

At ~2K tokens per exchange and 1,000 queries/day: **~$0.60-1.00/month with GPT-4o-mini**.

### Implementation Steps

1. **Write the system prompt** (~30 min)
   - Compile all KB content from `i18n.js` and HTML pages into structured markdown
   - Create EN and UA versions
   - Add behavioral rules (stay on topic, quote correct prices, recommend plans)

2. **Create serverless function** (~1-2 hours)
   - Single file: receives `{ message, history, lang }`, calls LLM, streams response
   - API key stored in environment variables (never in browser)
   - Rate limiting: 10 req/IP/min to prevent abuse

3. **Modify `support.html` chat widget** (~1-2 hours)
   - Replace pattern-matching block (lines 234-283) with `fetch()` to serverless function
   - Add streaming response rendering (tokens appear as they arrive)
   - Maintain conversation history in JS array (per session, client-side)
   - Keep existing DOM structure, CSS, XSS sanitization, and i18n integration

4. **Update tests** (~30 min)
   - Update `__tests__/interactive.test.js` to mock `fetch()` instead of testing pattern matching

5. **Deploy & test** (~30 min)
   - Deploy function, set API key env var, test end-to-end in both EN and UA

### Files to Modify

| File | Change |
|------|--------|
| `support.html` | Replace inline chat script (pattern matching -> fetch + stream) |
| `__tests__/interactive.test.js` | Update chat tests to mock fetch |
| `docs/ADR.md` | Add ADR-012: LLM-backed chat replacing pattern matching |
| `.memory-bank/project.md` | Resolve "AI chat demo-only" known gap |
| **New:** `api/chat.js` (or `functions/chat.js`) | Serverless function — the only new file |

### Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| API key exposure | Serverless proxy keeps key server-side; never in browser |
| Wrong pricing/service info | System prompt lists exact values; rule: "only quote listed prices" |
| Cost spike from bot abuse | Rate limiting (10 req/IP/min); `max_tokens: 500` cap |
| LLM goes off-topic | Strict behavioral boundaries in system prompt |
| Tests break | Update chat tests to mock `fetch()` |

### Verification

1. Open `support.html` in browser, send a message, verify streamed response appears
2. Test in both EN and UA languages
3. Ask about pricing — verify exact dollar amounts match `pricing.html`
4. Ask off-topic question — verify polite redirect
5. Run `npm test` — all 240+ tests pass
6. Check browser DevTools Network tab — confirm API key is NOT in any client request
