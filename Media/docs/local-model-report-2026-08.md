# Local model report — Tempus assistant

**Date:** 2026-08-26
**Hardware (verified via `nvidia-smi`):** NVIDIA GeForce RTX 5080 Laptop GPU · 16,303 MiB VRAM · 896 GB/s GDDR7 · driver 610.47 · Windows 11
**Runtime (verified):** Ollama **0.33.0**, `/api/chat` with a `tools` array
**Installed right now (verified via `/api/tags`):** `qwen3.5:9b` only — 6.59 GB on disk, Q4_K_M, 9.7B params, capabilities `vision, completion, tools, thinking`

Supersedes `docs/local-model-comparison.md` (2026-08-25), which was Qwen-only and used estimated speeds. This one uses **measured** speeds from your machine.

---

## The headline, before the tables

You said the assistant is "really ass at managing the site" and assumed the fix was a bigger model. I measured it before shopping, and **the measurement does not support that diagnosis.**

On your GPU, `qwen3.5:9b` answered a clean tool-calling prompt **4 times out of 4 with a perfect, schema-valid function call, in 2.7–2.9 s warm.** That is not a model that can't tool-call. See [Measured baseline](#measured-baseline-your-box-not-a-benchmark) below for the raw numbers, and [Where it actually broke](#where-it-actually-broke) for the failure I did reproduce — which was a *schema* failure, not a capability failure.

There is also nothing meaningfully better that fits in 16 GB. Every model with a stronger published function-calling score than `qwen3.5:9b` is 17 GB or larger on disk. So the honest recommendation is at the [bottom](#recommendation), and it is not the one you were expecting.

---

## The real VRAM budget

This constraint eliminates more candidates than every benchmark in this document, so it goes first.

Measured on your box, with your normal desktop and a browser running:

| State | GPU memory used | Free |
|---|---|---|
| Idle (desktop + browser, no model) | 2,290 MiB | 13,714 MiB |
| `qwen3.5:9b` loaded at `num_ctx` 8192 | 9,115 MiB | 6,889 MiB |

So: **~13.4 GB is your actual usable ceiling, not 16 GB.** The desktop compositor and Chrome take ~2.3 GB before Ollama starts.

Two further notes the on-disk number hides:

- **On-disk size is not VRAM size.** `qwen3.5:9b` is 6.59 GB on disk but reported **5.73 GB resident** at `num_ctx` 8192. Ollama does not load what it doesn't need.
- **KV cache scales with context.** These models advertise 262,144-token context. Ollama sizes the KV cache from `num_ctx`. At 8192 the cache is small; leave it unpinned at 256k and it will eat your headroom and spill.

**Treat ~13 GB on disk as the hard ceiling.** Anything above it partially offloads to system RAM over PCIe and loses roughly an order of magnitude of speed.

---

## Measured baseline (your box, not a benchmark)

I ran a real `propose_changes`-shaped tool-calling probe against your installed `qwen3.5:9b` through `/api/chat`, with `think:false`, `temperature:0`, `num_ctx:8192`, `keep_alive:'30m'` — the same settings the app sends.

| Run | Wall clock | Model load | Eval speed | Valid tool call? |
|---|---|---|---|---|
| Cold | 14.83 s | 11.29 s | 38.1 tok/s | Yes — correct |
| Warm 1 | 2.93 s | 0 s | 40.3 tok/s | Yes — correct |
| Warm 2 | 2.73 s | 0 s | 42.3 tok/s | Yes — correct |
| Warm 3 | 2.77 s | 0 s | 41.8 tok/s | Yes — correct |

The cold-run output, verbatim, for a prompt asking it to add a dependency and rename a task:

```json
{"ops":[{"kind":"add_dependency","taskId":"t2","dependsOnId":"t3"},
        {"kind":"update_task","taskId":"t1","title":"Draft history essay"}],
 "summary":"Add dependency of t2 on t3 and rename t1 to 'Draft history essay'"}
```

Correct on both ops, correct ids, correct op kinds, no prose leakage, no `<think>` block.

**Two things to take from this:**

1. **~41 tok/s, not 60–90.** The previous doc estimated 60–90 tok/s for this model from memory-bandwidth math. Measured, it's ~41. Every bandwidth-derived estimate in the old doc is roughly 1.5–2× optimistic; treat the speed column below as *relative ordering*, not absolute promises.
2. **The 11.3 s cold load is why `keep_alive` matters.** It is already set to `'30m'` in `ollamaProvider.ts`. Your first question after a 30-minute gap costs ~15 s; every one after costs ~3 s. That is worth knowing before you conclude the model is slow.

### Where it actually broke

I then gave it a harder prompt: six tasks, two projects, four simultaneous intents (add two dependencies, move a due date, move a task between projects, change a status). It emitted a tool call every time, deterministically, but the ops were wrong:

```json
{"kind":"update_task","taskId":"t3","dependsOnId":"t4","title":"Print lab report"}
{"kind":"update_task","taskId":"t5","dependsOnId":"t5","title":"Email professor"}
```

Three distinct problems, and I want to be precise about whose fault each is:

- **My probe's fault:** I deliberately gave it a minimal schema with only `kind`, `taskId`, `dependsOnId`, `title`. It had no field in which to express a due-date change or a project move, so those intents got mangled into the fields that existed. A fair test needs Tempus's real op schema.
- **The model's fault:** using `update_task` while passing `dependsOnId` — mixing two op kinds into one — and emitting `t5` depending on `t5`, a self-edge your cycle check would reject. These are genuine reasoning errors on a 9B model under load.
- **The useful signal:** it degraded by *filling in plausible-looking wrong fields* rather than by refusing or emitting prose. That is the exact failure mode invariant 8's re-validation exists to catch, and it is also exactly what "ass at managing the site" feels like from the outside.

The lever with the most leverage here is **op-schema design and `format`-constrained decoding**, not parameter count. More on that in [If you fix one thing](#if-you-fix-one-thing-it-is-not-the-model).

---

## At a glance

On-disk sizes are from ollama.com tag pages, fetched 2026-08-26. Speed class is scaled from the measured 41 tok/s on `qwen3.5:9b`; **MoE rows are faster than their size suggests** because only the active parameters are computed per token.

| Model (Ollama tag) | Params | Quant | On-disk | Fits 13 GB? | Speed class | Tool calling | Notes |
|---|---|---|---|---|---|---|---|
| **`qwen3.5:9b`** *(current)* | 9.7B dense | Q4_K_M | **6.6 GB** | **Yes, 6.4 GB spare** | **~41 tok/s measured** | **BFCL-v4 66.1** — best that fits | Vision, tools, thinking. The incumbent. |
| `qwen3.5:4b` | 4B | Q4_K_M | 3.4 GB | Yes, huge room | ~80–95 tok/s | BFCL-v3 **71.06**, v4 50.3 | Higher BFCL-v3 than LFM2.5-8B. Latency pick. |
| `qwen3.5:2b` | 2B | Q4_K_M | 1.9 GB | Yes | ~120 tok/s+ | Not published | Too small for graph reasoning. |
| `gemma4:12b` | 12B dense | Q4_K_M | 7.6 GB | Yes, 5.4 GB spare | ~33–38 tok/s | `tools` listed; **no BFCL published** | Google, Apr 2026. Vision/tools/thinking/audio. Best runner-up. |
| `ministral-3:14b` | 14B dense | Q4_K_M | 9.1 GB | Yes, ~4 GB spare | ~28–33 tok/s | `tools` listed; no BFCL found | Mistral, 256k ctx, vision. |
| `ministral-3:8b` | 8B dense | Q4_K_M | 6.0 GB | Yes | ~42–48 tok/s | `tools` listed; no BFCL found | Default `ministral-3:latest`. |
| `qwen3:14b` | 14B dense | Q4_K_M | 9.3 GB | Yes, ~4 GB spare | ~28–33 tok/s | `tools`+`thinking`; no per-size BFCL | Previous Qwen generation. |
| `cogito:14b` | 14B dense | Q4_K_M | 9.0 GB | Yes | ~28–33 tok/s | `tools` listed; no BFCL found | Deep Cogito hybrid reasoner, Qwen-based. |
| `granite4.2:8b` | 8B dense | Q4_K_M | 5.3 GB | Yes, lots spare | ~48–55 tok/s | `tools` listed; no BFCL found | IBM, Apache 2.0, 128k ctx. |
| `lfm2.5:8b-a1b` | 8.3B MoE, **1.5B active** | Q4_K_M | 5.2 GB | Yes | **~90–120 tok/s** (1.5B active) | BFCL-v3 64.36 / **v4 48.50** | Liquid AI. Explicitly "built for fast, reliable tool calling on consumer hardware." Fastest credible option. |
| `nemotron-3-nano:4b` | 4B | default | 2.8 GB | Yes | ~85–100 tok/s | `tools`+`thinking`; no BFCL found | NVIDIA, 256k ctx. |
| `hermes3:8b` | 8B dense | Q4_K_M | 4.9 GB | Yes | ~48–55 tok/s | `tools` listed; no BFCL v4 found | Nous Research, Llama-3.1 base. Ageing. |
| `qwen3:8b` | 8B dense | Q4_K_M | 5.2 GB | Yes | ~48–55 tok/s | `tools`+`thinking`; no per-size BFCL | Superseded by qwen3.5:9b. |
| `gpt-oss:20b` | 20B MoE, ~3.6B active | MXFP4 | **14 GB** | **Marginal — over ceiling** | ~35–50 tok/s *if* resident | τ-bench Retail 54.8 / Airline 38.0 | OpenAI. Real agentic numbers, no headroom. |
| `mistral-small3.2:24b` | 24B dense | Q4_K_M | 15 GB | **No** | Spills | Independent test: **42.5%** — poor | Over budget *and* weak at tools. Skip. |
| `qwen3.5:27b` | 27B | Q4_K_M | 17 GB | **No** | Spills badly | — | The obvious "bigger Qwen". Does not fit. |
| `qwen3.6:27b` | 27B | Q4_K_M | 17 GB | **No** | Spills badly | — | Newer generation, still doesn't fit. |
| `gemma4:26b-a4b` | 26B MoE, 4B active | Q4_K_M | 18 GB | **No** (QAT 16 GB, still no) | Spills | — | Would have been ideal. Too big. |
| `granite4.2:30b` | 30B | Q4_K_M | 18 GB | **No** | Spills | — | q2_K is 11 GB — but see quant warning. |
| `glm-4.7-flash` | 30B-A3B MoE | Q4_K_M | 19 GB | **No** | Spills | τ²-bench **79.5** | Strong agentic score. 6 GB over budget. |
| `qwen3:30b-a3b` | 30B MoE, 3B active | Q4_K_M | 19 GB | **No** | Spills | — | The old "big but fast" myth. Never fit. |
| `nemotron-3-nano:30b-a3b` | 30B MoE | Q4_K_M | 24 GB | **No** | Spills | — | 1M context. Desktop-card territory. |
| `phi4:14b` | 14B dense | Q4_K_M | 9.1 GB | Yes | ~28–33 tok/s | **No `tools` capability** | Disqualified — cannot function-call in Ollama. |

Sources for sizes: [qwen3.5](https://ollama.com/library/qwen3.5/tags) · [qwen3](https://ollama.com/library/qwen3/tags) · [qwen3.6](https://ollama.com/library/qwen3.6/tags) · [gemma4](https://ollama.com/library/gemma4/tags) · [ministral-3](https://ollama.com/library/ministral-3/tags) · [cogito](https://ollama.com/library/cogito/tags) · [granite4.2](https://ollama.com/library/granite4.2/tags) · [lfm2.5](https://ollama.com/library/lfm2.5/tags) · [nemotron-3-nano](https://ollama.com/library/nemotron-3-nano/tags) · [hermes3](https://ollama.com/library/hermes3/tags) · [gpt-oss](https://ollama.com/library/gpt-oss/tags) · [mistral-small3.2](https://ollama.com/library/mistral-small3.2/tags) · [phi4](https://ollama.com/library/phi4/tags) · [glm-4.7-flash](https://ollama.com/library/glm-4.7-flash)

---

## The sweet spot, concretely

Your 13.4 GB usable splits into three regimes:

**~2–10 GB on disk (2B–14B at q4) — the comfort zone.** Fully GPU-resident with 3–11 GB left over for KV cache and your browser. Measured 41 tok/s at 9.7B; a 14B lands around 28–33. Everything here answers in under 5 s warm. **This is where you should stay.**

**~14–15 GB (20B–24B at q4) — the knife edge.** `gpt-oss:20b` at 14 GB and `mistral-small3.2:24b` at 15 GB both exceed your 13.4 GB free. They will *load*, because Ollama silently offloads the overflow layers to system RAM, and then every token crosses PCIe. Expect single-digit tok/s and 30-second answers. The failure is silent — no error, just misery.

**17 GB+ (27B–35B at q4) — no.** `qwen3.5:27b` (17 GB) needs 3.6 GB more than you have; `glm-4.7-flash` (19 GB) needs 5.6 GB more. And 70B-class models at q4 are 40+ GB — not a close call, a different machine.

**On dropping the quant to squeeze a big model in:** `granite4.2:30b-q2_K` is 11 GB and technically fits. Don't. Two-bit quantisation is precisely the regime where exact JSON key names and enum adherence degrade first — you would trade a well-behaved 9B for a brain-damaged 30B that emits `"task_id"` where your schema says `"taskId"`. For a structured-output workload, **quantisation below q4 is a worse trade than fewer parameters.**

---

## Per-model notes

### `qwen3.5:9b` — the incumbent, and still the pick
Alibaba, Feb 2026, 9.7B dense-ish hybrid (Gated DeltaNet + sparse MoE), Apache 2.0. **BFCL-v4 66.1, TAU2-bench 79.1** per the [Qwen model card](https://huggingface.co/Qwen/Qwen3.5-9B) — the highest published function-calling score of anything that fits your card, by a wide margin. Measured on your box at 5.73 GB resident and ~41 tok/s, 4/4 valid tool calls. Thinking is **on by default**; the app correctly sends `think:false`. Caveat: 66.1 is vendor-reported, not an independent run.

### `gemma4:12b` — the strongest runner-up
Google, released 2 April 2026. 7.6 GB at q4_K_M leaves 5.4 GB spare. Ollama lists `vision, tools, thinking, audio`, and Google's release notes native function-calling and structured JSON output. **No BFCL entry I could find** — that is the reason it's the runner-up and not the pick. A newer, differently-trained 12B is the most credible "maybe it's just better at my prompts" experiment available to you, and it costs one download to find out.

### `lfm2.5:8b-a1b` — the speed play
Liquid AI. 8.3B total, **1.5B active** MoE, 5.2 GB. The [Ollama page](https://ollama.com/library/lfm2.5) describes it literally as "an edge model built for fast, reliable tool calling on consumer hardware", and the [model card](https://huggingface.co/LiquidAI/LFM2.5-8B-A1B) publishes **BFCL-v3 64.36 / BFCL-v4 48.50**. With 1.5B active params it should be 2–3× faster than your current model. But note what its own card admits: **Qwen3.5-4B scores BFCL-v3 71.06 against LFM2.5's 64.79** — a 4B Qwen out-tool-calls it. Take this only if sub-second responses matter more than accuracy.

### `qwen3.5:4b` — the latency fallback
3.4 GB, BFCL-v3 **71.06** — higher than LFM2.5-8B's v3 score, in a third of your current model's footprint. If the 9B ever feels sluggish, this is the correct fallback, **not** the old `qwen2.5:7b`.

### `ministral-3:14b` / `:8b` — Mistral's current small tier
9.1 GB / 6.0 GB, 256k context, vision + tools. Fits comfortably. **No function-calling benchmark published for either** — and Mistral's neighbouring `mistral-small3.2:24b` scored a dismal 42.5% in independent tool-calling testing, which is weak circumstantial evidence against the family for this workload. Unverified, but I would not lead with it.

### `granite4.2:8b` — the safe, boring one
IBM, Apache 2.0, 5.3 GB, 128k context, `tools` listed. IBM tunes Granite explicitly for enterprise tool-use and RAG. No BFCL number found. Cheap to try, unlikely to beat 66.1.

### `cogito:14b` — hybrid reasoner
Deep Cogito, 9.0 GB, Qwen-based, `tools` listed. Note the tags are still labelled `v1-preview`. No tool-calling benchmark found. Preview-labelled weights are a poor foundation for the one thing your app cannot tolerate failing.

### `nemotron-3-nano:4b` — NVIDIA's small agent model
2.8 GB, 256k context, `tools` + `thinking`. Its 30B sibling is 24 GB and out of reach. No BFCL number found for the 4B.

### `hermes3:8b` / `qwen3:8b` — previous generation
4.9 GB / 5.2 GB, both list `tools`. Hermes 3 is built on Llama 3.1 and is now roughly two years of model progress behind. Neither has a published BFCL-v4 figure. No reason to prefer either over `qwen3.5:9b`.

### `gpt-oss:20b` — real numbers, no room
OpenAI, Apache 2.0, 20B MoE with ~3.6B active, native function calling and structured output, τ-bench Retail 54.8 ([model card](https://openai.com/index/introducing-gpt-oss/)). It is a genuinely capable agentic model. It is also 14 GB against your 13.4 GB free — a headroom fight you will lose every time you open another Chrome tab. Only worth it if you close everything else and pin `num_ctx` low.

### `mistral-small3.2:24b` — actively avoid
15 GB (spills) **and** independently measured at 42.5% on a 40-case tool-calling harness. Fails both tests. Listed here only so you don't try it.

### `phi4:14b` — disqualified
9.1 GB and it would fit fine, but the [Ollama page](https://ollama.com/library/phi4/tags) lists **no `tools` capability**. Microsoft's Phi-4 cannot emit a native function call through Ollama's `tools` API. Structurally unusable for Tempus regardless of how good it is.

### Everything at 17 GB and up
`qwen3.5:27b` (17 GB), `qwen3.6:27b` (17 GB), `gemma4:26b-a4b` (18 GB), `granite4.2:30b` (18 GB), `glm-4.7-flash` (19 GB, τ²-bench 79.5), `qwen3:30b-a3b` (19 GB), `nemotron-3-nano:30b-a3b` (24 GB). All are better models than your current one. **None of them fit.** The MoE ones are especially tempting — "only 3B active!" — but the active-parameter speed advantage only holds while the *whole* model is GPU-resident. Once it spills, you get 30B memory traffic at 3B compute, which is the worst of both. Revisit on a 24 GB desktop card.

---

## Will this fry my GPU?

**No. You cannot damage this GPU by running a language model on it.** Nothing in this document carries a hardware risk. Plainly:

- **Thermal limits are enforced in hardware, not by software.** The RTX 5080 throttles its own clocks and, in the extreme, shuts down, long before anything is harmed. You cannot override this from Ollama. Your card idled at 74 °C / 32 W during this research and sat at 77 °C / 35 W with a model loaded and answering — well within normal laptop range, and nowhere near a limit.
- **Inference is bursty, not sustained.** A chat assistant computes for 3 seconds and then sits idle. This is a far gentler load than gaming, which you already do on this machine for hours at a time. A 3-second burst every few minutes is not a thermal event.
- **The genuine worst cases are all annoyances, not damage:**
  - *VRAM spill.* Pick a model over ~13 GB and Ollama silently offloads layers to system RAM. Result: answers take 30 s instead of 3 s. Fix: `ollama stop <model>`, pick a smaller one. No harm done.
  - *Fan noise and heat.* A laptop under load gets loud and warm. Expected behaviour.
  - *Out-of-memory.* Pick something far too large and Ollama errors out or the load fails. It's a message, not a fault.
- **The model sits in VRAM between questions by design.** `keep_alive: '30m'` in `ollamaProvider.ts` holds it resident so you pay the 11.3 s load once, not per question. Holding memory is not the same as working — an idle resident model draws essentially nothing. If you want it gone, `ollama stop qwen3.5:9b` frees it instantly.

The only real cost of experimenting is disk space and download time. Try whatever you like; `ollama rm <tag>` undoes it.

---

## Thinking models and `think:false`

This matters more than it sounds, and it's a live issue for you: **your currently installed `qwen3.5:9b` reports `thinking` among its capabilities, and Qwen3.5 runs in thinking mode by default** — the [model card](https://huggingface.co/Qwen/Qwen3.5-9B) confirms it emits `<think>…</think>` before answering unless told otherwise.

Left on, that turns a 3-second answer into 20–40 seconds of invisible deliberation before the tool call appears. It is the single most common reason someone concludes a good local model is unusably slow.

`ollamaProvider.ts` already sends `"think": false`, and I verified it works: every probe returned `thinking: null` and an empty `content`, with the tool call arriving directly. Nothing to fix.

But it's a real hazard when you swap models. `think:false` is honoured per-model; a reasoning model that ignores the flag, or one whose Ollama template doesn't wire it up, will feel broken rather than slow. **Any model in the table tagged `thinking` — `gemma4`, `qwen3`, `cogito`, `nemotron-3-nano`, `lfm2.5`, `gpt-oss`, `glm-4.7-flash` — needs a latency check on its first warm run.** If a swap suddenly takes 30 s, suspect the thinking flag before you blame the model. Fallback is `/no_think` in the system prompt.

Conversely: `ministral-3`, `granite4.2` and `hermes3` have no thinking mode at all, so the flag is a harmless no-op.

---

## How to switch models in Tempus

The model tag is a plain user setting — no rebuild, no code change:

1. Open **Settings → Assistant**.
2. The **Assistant provider** control must be on **"Local (Ollama)"** (it is by default).
3. The **"Local model"** text field appears directly beneath it. Type any Ollama tag, e.g. `gemma4:12b`.
4. **Click away from the field.** It saves on blur, not on Enter.

Under the hood (`src/lib/assistant/index.ts`): the value is stored via the `Preferences` interface under the `localStorage` key `assistant.localModel`, and read by `getLocalModel()`. Clearing the field falls back to `DEFAULT_LOCAL_MODEL`, currently `'qwen3.5:9b'`. The field's hint text already points at the old comparison doc — worth repointing at this one.

If you enter a tag you haven't downloaded, the provider gives you the right error rather than failing silently: `<model> isn't downloaded yet. In a terminal, run: ollama pull <model>`.

---

## Recommendation

### Stay on `qwen3.5:9b`. Nothing you can fit will beat it.

I know that isn't what you were hoping for, so here is the reasoning laid out:

1. **It measurably works.** 4/4 valid, correct tool calls at 2.7–2.9 s warm on your hardware. Whatever is going wrong, it is not "this model can't emit a function call."
2. **It has the best evidence of anything that fits.** BFCL-v4 **66.1** — no other model under 13 GB has a published function-calling score anywhere near it. Most have no published score at all.
3. **Everything demonstrably better is 17 GB+.** `qwen3.5:27b`, `glm-4.7-flash`, `gemma4:26b` — all real upgrades, all 4–6 GB beyond your card. Forcing one in means either RAM spill (10× slower) or sub-4-bit quantisation (breaks structured output). Both are downgrades in practice.

**No `ollama pull` required. You already have it installed.**

### Runner-up, if you want to run an experiment anyway

```
ollama pull gemma4:12b
```

7.6 GB, leaves 5.4 GB spare, native function-calling and structured JSON, from a different lab with different training data. It is the only fits-comfortably model that could plausibly beat the incumbent on *your* prompts. It has no published BFCL score, so this is a genuine coin-flip — but it's a cheap one, and a head-to-head on your real prompts is worth more than every benchmark above.

Third choice, if latency ever becomes the binding constraint: `ollama pull qwen3.5:4b` (3.4 GB, BFCL-v3 71.06, roughly 2× the speed).

### If you fix one thing, it is not the model

The failure I actually reproduced was the model filling in **plausible-looking wrong fields** — `update_task` carrying a `dependsOnId`, a task depending on itself — when the schema couldn't express its intent. Three changes attack that directly, and all three are cheaper than a 17 GB download:

1. **Use Ollama's `format` field.** `/api/chat` accepts a full JSON Schema and *constrains decoding to it* ([structured outputs](https://ollama.com/blog/structured-outputs)). This converts "model emitted a malformed op" from a soft failure into a hard impossibility. Given invariant 8 already re-validates every op, this is belt-and-braces on the exact seam that's failing.
2. **Split the op schema so wrong states are unrepresentable.** If `update_task` has no `dependsOnId` field in the schema at all, the model cannot put one there. Per-kind schemas beat one permissive union.
3. **Set `temperature: 0`.** Ollama recommends it for structured output. My probes used it and were byte-identical across three runs — fully deterministic.

Then run the head-to-head that settles it: your real serialized graphs, ~20 of them, through `qwen3.5:9b` and `gemma4:12b`, scoring only **(a)** schema-valid `ops` array, yes/no, and **(b)** warm wall-clock. That measures your prompt, your schema, your machine. Ship whichever wins.

---

## Verification status

**Measured directly on your hardware** (highest confidence): all VRAM figures, all `qwen3.5:9b` timings and tok/s, tool-call correctness, GPU temperature and power, Ollama version, installed models. Commands were read-only plus inference against the already-installed model; nothing was downloaded, and no project file outside this one was touched.

**Verified from primary sources** (URLs inline above): every on-disk size, from ollama.com tag pages fetched 2026-08-26. Capability labels (`tools`, `thinking`, `vision`) from the same. BFCL-v4 66.1 / TAU2 79.1 for Qwen3.5-9B, and BFCL 64.36/48.50 for LFM2.5, from vendor model cards — **vendor-reported, not independent runs.**

**Could not verify — treat as open questions:**

- **No published function-calling benchmark exists** for `gemma4:12b`, `ministral-3` (any size), `granite4.2` (any size), `cogito:14b`, `nemotron-3-nano:4b`, `hermes3:8b`, `qwen3:8b`, or `qwen3:14b`. Their `tools` capability label confirms the plumbing works; it says nothing about reliability. **This affects the runner-up recommendation directly** — `gemma4:12b` is proposed on architecture and recency, not evidence.
- **Speed classes for every model except `qwen3.5:9b` are estimates**, scaled from the one measured data point. MoE rows are the least certain.
- **The 42.5% figure for `mistral-small3.2:24b`** comes from a third-party 40-case harness, not a standardised benchmark. Directionally useful, not authoritative.
- **`gemma4` versus `gemma3`:** some 2026 sources still claim "there is no Gemma 4." That is stale — `gemma4` is live in the Ollama library today at 12B/26B/31B with a `tools` label, and I read its tag page directly. Flagging it because you may hit the contradiction elsewhere.
- **`nemotron-3-nano` "a3b" suffix:** the tag page does not confirm whether this denotes MoE active parameters. Immaterial here — at 24 GB it doesn't fit either way.
- **The hard-prompt failure is not a clean model indictment.** My probe schema lacked fields for due dates and project moves, so some of the mangling was my harness's fault. The self-edge and the mixed op kind were not. A rerun against Tempus's real op schema is the honest test.
