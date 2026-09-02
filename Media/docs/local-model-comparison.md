# Local model comparison — Tempus assistant

**Date of research:** 2026-08-25
**Hardware:** RTX 5080 Laptop GPU (16 GB GDDR7, 896 GB/s ‡) + 32 GB RAM, Windows
**Runtime:** Ollama `/api/chat` with a `tools` array
**Current model:** `qwen2.5:7b` (Q4_K_M, 4.7 GB), ~4 s warm

‡ [LaptopMedia — RTX 5080 Laptop specs](https://laptopmedia.com/video-card/nvidia-geforce-rtx-5080-laptop/)

---

## What this workload actually needs

1. **Reliable structured tool calling.** The app is dead if `propose_changes` doesn't come back as a
   well-formed function call with a valid `ops` array. This is the only hard requirement.
2. **Short reasoning over a serialized task graph**, 2–4k token prompts. Not a frontier-reasoning problem.
3. **Latency under ~5 s warm.** An assistant that takes 30 s to propose an edit will not get used.

Requirements 1 and 3 are in tension with what the 2026 releases optimise for — long-horizon agentic work,
256k context, and thinking-on-by-default. Bigger is not better here. The correct search is for the
*smallest* model with a credible published function-calling score.

### The real VRAM budget

16 GB total on Windows is **~13.5–14.5 GB usable** once the desktop compositor and a browser have taken
their cut. Anything whose on-disk size exceeds ~13 GB will partially spill to system RAM and lose an order
of magnitude of speed. **Treat 13 GB as the ceiling, not 16.** This single constraint eliminates more
candidates than any benchmark below.

---

## Models that fit

| Model (Ollama tag) | Params | Disk (default quant) | Headroom | Est. speed ‡‡ |
|---|---|---|---|---|
| `qwen3.5:4b` | 4B hybrid MoE | 3.4 GB | ~10 GB | ~120–180 tok/s |
| `qwen2.5:7b` *(baseline)* | 7B dense | 4.7 GB Q4_K_M | ~9 GB | ~90–130 tok/s |
| `qwen3:8b` | 8B dense | 5.2 GB Q4_K_M | ~8 GB | ~85–120 tok/s |
| **`qwen3.5:9b`** | 9.65B hybrid MoE | **6.6 GB Q4_K_M** | ~7 GB | ~60–90 tok/s |
| `qwen2.5:14b` | 14B dense | 9.0 GB Q4_K_M | ~4.5 GB | ~45–65 tok/s |
| `qwen3:14b` | 14B dense | 9.3 GB Q4_K_M | ~4 GB | ~45–65 tok/s |
| `gpt-oss:20b` | 20B / ~3.6B active MoE | 14 GB MXFP4 | **~0 GB — marginal** | ~40–70 tok/s *if* resident |

Sizes: [qwen2.5 tags](https://ollama.com/library/qwen2.5/tags) · [qwen3 tags](https://ollama.com/library/qwen3/tags) ·
[qwen3.5](https://ollama.com/library/qwen3.5) · [qwen3.5:9b](https://ollama.com/library/qwen3.5:9b) ·
[gpt-oss](https://ollama.com/library/gpt-oss)

## Models that do not fit

| Model | Disk | Over budget by | Verdict |
|---|---|---|---|
| `qwen3.5:27b` | 17 GB | ~3.5 GB | Spills to RAM. Out. |
| `qwen3.6:27b` | 18 GB | ~4.5 GB | Spills to RAM. Out. |
| `qwen3.8:27b` | 18 GB | ~4.5 GB | Spills to RAM. Out. |
| `qwen3:30b-a3b` (MoE) | **19 GB** | ~5.5 GB | The old "big but fast" pick. **It does not fit.** Once it spills, the 3B-active speed advantage evaporates. |
| HauhauCS 27B `Q4_K_P` | 17.9 GB | ~4.5 GB | Out — see below. Only its IQ2/IQ3 quants fit. |

Sizes: [qwen3.6](https://ollama.com/library/qwen3.6) · [qwen3.8](https://ollama.com/library/qwen3.8) ·
[qwen3 tags](https://ollama.com/library/qwen3/tags) ·
[HauhauCS repo files](https://huggingface.co/HauhauCS/Qwen3.8-27B-Uncensored-HauhauCS-Aggressive-MTP-GGUF/tree/main)

## Tool-calling evidence

This is the column that should decide the choice. Everything else is a constraint check.

| Model | Benchmark evidence | Source |
|---|---|---|
| **`qwen3.5:9b`** | **BFCL-v4 66.1** · TAU2-Bench 79.1 · Ollama `tools` capability | [Qwen card](https://huggingface.co/Qwen/Qwen3.5-9B), [Together AI](https://www.together.ai/models/qwen3-5-9b) |
| `qwen3.5:4b` | **BFCL-v4 50.3** · TAU2-Bench 79.9 | [Qwen card](https://huggingface.co/Qwen/Qwen3.5-4B) |
| `qwen2.5:14b` | **BFCL 49.2 (FC)** / 47.8 (prompt) | [BFCL leaderboard](https://gorilla.cs.berkeley.edu/leaderboard.html) |
| `qwen2.5:7b` | No separate BFCL entry published — *unverified*. `tools` capability listed. | [Ollama](https://ollama.com/library/qwen2.5) |
| `qwen3:8b` / `qwen3:14b` | No per-size BFCL v4 figure found — *unverified*. `tools` + `thinking` listed. | [Ollama](https://ollama.com/library/qwen3) |
| `gpt-oss:20b` | **τ-bench Retail 54.8** · τ-bench Airline 38.0 (high reasoning). Native function calling + structured output. | [gpt-oss model card](https://arxiv.org/pdf/2508.10925), [OpenAI](https://openai.com/index/introducing-gpt-oss/) |
| `qwen3:30b-a3b` | No BFCL v4 entry found — *unverified* | — |
| `qwen3.8:27b` | No BFCL figure. Card quotes OSWorld 84.3 / AndroidWorld 81.9 / WebArena 64.8 — GUI-agent benchmarks, not function-calling. | [Qwen card](https://huggingface.co/Qwen/Qwen3.8-27B) |
| HauhauCS 27B | **None published.** | — |

The headline: **`qwen3.5:9b` scores 66.1 on BFCL-v4 against Qwen2.5-14B's 49.2 — a large gap on the exact
benchmark that measures your one hard requirement, at a *smaller* footprint than the 14B.**

‡‡ **All tok/s figures are estimates, unverified.** Derived from 896 GB/s ÷ on-disk size × ~0.6 llama.cpp
efficiency, adjusted for active-parameter count on MoE models. Measure on your own box before trusting them.

---

## The linked model: HauhauCS/Qwen3.8-27B-Uncensored-Aggressive-MTP-GGUF

### Correcting one assumption first

**"Qwen3.8" is a real Qwen release, not community naming.** `Qwen/Qwen3.8-27B` was published by Qwen under
Apache 2.0 in mid-August 2026 — a 27B dense hybrid-attention (Gated DeltaNet + Gated Attention)
vision-language model, 262k native context, thinking-on-by-default with `reasoning_effort` control
([Qwen card](https://huggingface.co/Qwen/Qwen3.8-27B),
[Alibaba Cloud](https://www.alibabacloud.com/blog/alibaba-unveils-qwen3-8-max-its-largest-and-most-capable-flagship-model-to-date_603420)).
The base is legitimate and strong. Ollama ships it officially as `qwen3.8:27b`
([Ollama](https://ollama.com/library/qwen3.8)). None of the criticism below is aimed at the base model.

### Who made the derivative

`HauhauCS` is an individual Hugging Face account — ~27 models, all following the pattern
`<base>-Uncensored-HauhauCS-<Aggressive|Balanced>`, ~8k followers, no organisation affiliation. It is a
repackager, not a lab. The repo's licensing and base attribution are honest: it correctly credits Qwen and
retains Apache 2.0.

### What it claims

An "Aggressive uncensoring profile" giving **"0/465 Refusals"**, plus a proprietary **"FastMTP"**
multi-token-prediction sidecar claiming up to 3.02x document throughput and 1.93x reasoning throughput. The
card states: *"No changes to datasets or intended capabilities… preserves Qwen3.8-27B's text, reasoning,
agentic, and image and video capabilities."* The uncensoring method itself is never described — no mention
of abliteration, fine-tuning, dataset, or procedure.

### Why it's a poor fit — five independent reasons

**1. It does not fit at a quant that preserves structured output.** Q4_K_P is 17.9 GB, well over budget.
The only quants fitting ~13.5 GB usable are IQ2_M (10.3 GB), Q2_K_P (10.7 GB), IQ3_XS (12.2 GB) and
IQ3_M (12.8 GB). Two-bit quantisation of a 27B model is precisely the regime where exact JSON key names and
schema adherence degrade first. You'd trade a well-behaved 7B for a badly-damaged 27B. The card's own
Ollama one-liner recommends `:IQ2_M` — the worst quant in the repo.

**2. The uncensoring buys nothing and costs something.** Tempus asks a model to emit a task-graph edit.
There is no refusal to route around; the "0/465 Refusals" metric is measuring a problem you do not have.
Meanwhile the published cross-architecture study of abliteration methods finds mathematical-reasoning
degradation up to **−18.81 pp on GSM8K** (−26.5% relative) — with the important caveat that it evaluated
only MMLU / GSM8K / HellaSwag and **did not measure tool-calling at all**
([arXiv 2512.13655](https://arxiv.org/html/2512.13655v1)). So: documented capability loss in the domains
that *were* measured, and no evidence either way in the domain you care about. A bet with no upside.

**3. No tool-calling evidence exists for it.** The card asserts preserved agentic capability and provides
zero measurements. "0/465 Refusals" has no published methodology or asterisk footnote. And the card's own
caveat undercuts the claim: *"For reliability-critical, specifically long-context agentic work, a Balanced
release is normally the safer default when/if one is available."* Your use case is reliability-critical.

**4. The headline feature doesn't work on Ollama.** FastMTP requires building llama.cpp from source with a
HauhauCS patch and serving with `--spec-type draft-mtp`. Ollama will not load the 903 MB sidecar. You'd
carry the download and get none of the speedup — the entire differentiator of this repo over the official
`qwen3.8:27b` is inaccessible from your runtime.

**5. Tool calling on `hf.co/`-imported GGUFs is a known rough edge.** Ollama infers the template from GGUF
`tokenizer.chat_template` metadata; when that's missing or non-standard the API returns *"does not support
tools"*, or worse, silently returns prose where a tool call should be
([HF docs](https://huggingface.co/docs/hub/ollama),
[ollama#9353](https://github.com/ollama/ollama/issues/9353),
[ollama#8982](https://github.com/ollama/ollama/issues/8982)). Silent tool-call failure is the exact failure
mode Tempus cannot tolerate. It is also a vision model with an unmerged `mmproj` — more template surface to
go wrong.

### Fair summary

It is a competently-packaged quant set of a genuinely good base model, and there's nothing dishonest about
it. It is simply built for a different job — unrestricted long-form multimodal chat on a 24 GB+ card — than
yours. If you ever want Qwen3.8 on this machine, use the official `qwen3.8:27b`, and you still won't have
the VRAM for it.

---

## What changed since the "30B-A3B" recommendation

That advice predates three Qwen generations. Worth knowing before re-reading old notes:

- **Qwen3.5** (Feb 2026) shipped a 0.8B–122B family on a hybrid Gated-DeltaNet + sparse-MoE architecture
  ([Qwen card](https://huggingface.co/Qwen/Qwen3.5-9B)). The small dense-ish tiers now publish real BFCL-v4
  numbers, which the Qwen3 generation largely did not.
- **Qwen3.6** and **Qwen3.8** followed, but *both bottom out at 27B* — there is no small tier in either
  ([qwen3.6](https://ollama.com/library/qwen3.6), [qwen3.8](https://ollama.com/library/qwen3.8)). For a
  16 GB laptop, Qwen3.5 is the newest generation that has anything you can actually run.
- `qwen3:30b-a3b` at **19 GB** was never going to fit 16 GB. If it was recommended before, that was a
  mistake — the MoE speed argument only holds while the model is fully GPU-resident.

---

## Practical Ollama notes (apply regardless of which model wins)

- **Turn thinking off.** Qwen3.5/3.6/3.8 default to thinking-on. Pass `"think": false` in the `/api/chat`
  body ([Ollama thinking docs](https://docs.ollama.com/capabilities/thinking),
  [Ollama blog](https://ollama.com/blog/thinking)). Skip this and latency goes from ~4 s to 20 s+, and
  you'll wrongly conclude the model is bad. `/no_think` in the system prompt is the fallback if the
  parameter misbehaves for a given tag.
- **Consider `format` as a belt-and-braces backstop.** Ollama accepts a full JSON schema in the `format`
  field on `/api/chat` and constrains decoding to it
  ([Ollama structured outputs](https://ollama.com/blog/structured-outputs)). If `propose_changes` keeps
  drifting on `ops` shape, this converts a soft failure into a hard guarantee. Ollama also recommends
  `temperature: 0` for structured output.
- **Pin `num_ctx` deliberately.** These models advertise 256k. Ollama allocates KV cache from it. At 2–4k
  prompts, an explicit `num_ctx` of 8192 keeps the whole thing in VRAM and protects your headroom.
- **Set `keep_alive`** so the model stays resident between assistant invocations — your "~4 s warm" number
  depends on it.

---

## Ranked recommendation

1. **`qwen3.5:9b` — the pick.** 6.6 GB with ~7 GB headroom. BFCL-v4 **66.1** vs Qwen2.5-14B's 49.2, at a
   smaller footprint than the 14B. Native `tools` capability in the Ollama library. Send `"think": false`.
2. **`qwen3.5:4b` — if latency is the binding constraint.** 3.4 GB, BFCL-v4 50.3 — Qwen2.5-14B-class
   function calling in *less than a third* of your current model's size. If the 9B feels sluggish on real
   prompts, this is the fallback, not `qwen2.5:7b`.
3. **`qwen2.5:7b` — keep as the known-good control.** Don't delete it. It's your A/B baseline and rollback.
4. **`gpt-oss:20b` — only if 1 and 2 both fail.** Real τ-bench numbers and real native function calling,
   but 14 GB on a 16 GB laptop is a headroom fight you'll never stop having.
5. **`qwen3.6:27b` / `qwen3.8:27b` / `qwen3:30b-a3b` — out on VRAM.** Revisit on a 24 GB desktop card.
6. **HauhauCS 27B uncensored GGUF — no.** Doesn't fit at a quant that preserves structured output, no
   tool-calling evidence, inaccessible acceleration feature, template risk.

### Single best next step

```
ollama pull qwen3.5:9b
```

Then point the assistant at it with `"think": false` in the `/api/chat` payload and run your existing
`propose_changes` prompts through both `qwen3.5:9b` and `qwen2.5:7b` over the same ~20 serialized graphs.
Score two things only:

- **(a)** valid function call emitted with a schema-conforming `ops` array — yes/no
- **(b)** warm wall-clock latency

That head-to-head is worth more than every benchmark cited above, because it measures *your* prompt, *your*
schema, and *your* machine. Ship whichever wins.

---

## Verification status

Every model claim above carries a source URL or an explicit *unverified* tag. Three things worth
re-checking before acting:

1. **All tok/s figures are bandwidth-derived estimates**, never measured on this hardware.
2. **BFCL v4 does not currently publish per-size entries** for Qwen2.5-7B, Qwen3-8B, Qwen3-14B, or
   Qwen3-30B-A3B. Those rows rely on vendor cards or sibling models and are tagged accordingly.
3. **BFCL-v4 66.1 for Qwen3.5-9B is vendor-reported** — from Qwen's own model card, mirrored by Together
   AI. It is not an independent third-party run. The 20-prompt head-to-head above is what settles it.
