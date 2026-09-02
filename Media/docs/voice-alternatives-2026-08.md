# Voice alternatives to the Web Speech API — research, August 2026

**Why:** the assistant currently speaks through `window.speechSynthesis` (`src/lib/platform/speech.ts`, `speak` / `speakLocal`). Those are the OS's own voices — on Windows 11 that's Microsoft David/Zira/Mark, a 2013-era concatenative-ish stack that everyone correctly describes as robotic. Every option below is a real neural TTS model and every one of them clears that bar comfortably.

**Constraints this document honours** (from CLAUDE.md invariants 7 and 8, and the voice ruling of 25 Aug 2026):

- No paid speech service. Everything here is open weights, run on Riz's own machine.
- Never load-bearing. Whatever we add is an *option*; with it absent the assistant still speaks via `speechSynthesis`, and with speech itself absent the app is unchanged.
- Static PWA. An in-browser engine keeps the "no server" property intact. A localhost server is acceptable only in the same register as Ollama — optional, discovered at runtime, absent from the UI when it isn't answering.

**Hardware assumed:** RTX 5080 Laptop, 16 GB VRAM, Windows 11, Ollama already installed.

---

## The current seam

`src/lib/platform/speech.ts` already has almost exactly the shape a new engine needs:

- `speak(text)` / `stopSpeaking()` — fire-and-forget browser synthesis.
- `speakLocal(text, onDone): PlaybackHandle | null` — promise-ish, cancellable, already documented as *"the fallback when TTS is busy."*
- `playPcm(samples: Float32Array, sampleRate, onDone, volume): PlaybackHandle | null` — **this is the important one.** It already takes raw mono float PCM and plays it through Web Audio with a gain stage. It exists today to deliver Gemini TTS output.
- `playAudioUrl(url, {onDone, onUnavailable}, volume)` — plays a served audio file, with an explicit unavailable path.
- `PlaybackHandle { stop(): void }` — the uniform cancellation type.

So the integration for *any* engine below is: produce a `Float32Array` + sample rate, hand it to `playPcm`. Kokoro's JS API returns exactly that (`RawAudio.audio` is a Float32Array at 24 kHz). A localhost server returning WAV/MP3 goes through `playAudioUrl`, or through `decodeAudioData` into `playPcm` if we want the gain stage.

The one piece that does *not* exist yet is a **voice-engine selector** — today the choice is hardcoded between Gemini TTS and `speakLocal`. Any of these lands as a third branch behind the same `PlaybackHandle` return type.

---

## 1. Kokoro-82M via `kokoro-js` — in-browser, WebGPU/WASM

**The cheapest win, and it holds up.**

| | |
|---|---|
| License | **Apache-2.0**, weights *and* voice packs. Fully permissive, commercial fine. |
| Where it runs | 100% in the browser (WebGPU or WASM) via Transformers.js; also Node/CPU |
| Model size | 82M params, ~327 MB fp32; **~86 MB at q8**, smaller at q4 |
| Voices | 54 official v1.0 voicepacks across 8 languages — American English 11F/9M, British English 4F/4M, plus JA/ZH/ES/FR/HI/IT/PT-BR |
| Streaming | Yes — `TextSplitterStream`, designed for word-by-word LLM output |
| Latency | RTF ~0.27 on WebGPU (Chrome), ~1.45 on WASM — measured by the HeadTTS project |
| Cloning | **No.** Fixed voicepacks only. Not a limitation we care about. |

Kokoro is the consensus default open TTS of 2026: 82M parameters, faster than realtime on a *CPU*, and it topped the TTS Spaces Arena on release against models many times its size. The top English voices (`af_heart`, `af_bella`) are graded "A" in the model's own voice table. This is not Microsoft Zira territory — it's recognisably in the same conversation as ElevenLabs' cheaper tiers for plain narration, though it is flatter and less expressive than the 2026 frontier models below.

**Integration into a static PWA — genuinely easy:**

```
npm i kokoro-js   # Apache-2.0, deps: @huggingface/transformers, phonemizer
```

```js
const tts = await KokoroTTS.from_pretrained(
  "onnx-community/Kokoro-82M-v1.0-ONNX",
  { dtype: "q8", device: "webgpu" }   // dtypes: fp32 fp16 q8 q4 q4f16
);
const audio = await tts.generate(text, { voice: "af_heart" });
// audio.audio -> Float32Array, audio.sampling_rate -> 24000  ->  playPcm(...)
```

**First-load cost is the only real tax.** The weights are fetched from the Hugging Face CDN on first use (~86 MB at q8) and then live in the browser's Cache Storage. That's a one-time download, and it is a *network* dependency at first run — which is fine as an opt-in enhancement, and is the reason it must never gate anything. We could alternatively vendor the ONNX into `dist/` and self-host it, at the cost of a much fatter build; I'd fetch from the CDN and cache.

**One caveat I want on the record:** the `kokoro-js` npm package's latest version is **1.2.1, published 2025-05-03** — it has not been updated in about fifteen months. It isn't abandoned so much as finished (the model hasn't changed either; v1.0 is still current, and the only newer hexgrad release is `Kokoro-82M-v1.1-zh`, a Chinese-focused variant that *drops* English voices). But if we want an actively-maintained wrapper, see HeadTTS below.

- https://github.com/hexgrad/kokoro (JS library lives in `kokoro.js/`)
- https://huggingface.co/hexgrad/Kokoro-82M — https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md
- https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX
- https://www.npmjs.com/package/kokoro-js

### 1b. HeadTTS — the maintained Kokoro wrapper

MIT-licensed JS front end for the same Kokoro-82M ONNX weights, adding **phoneme-level timestamps and visemes**, and offering *both* in-browser (WebGPU/WASM) and a local Node WebSocket/REST server (WebGPU or multithreaded CPU). Its own published benchmarks: **0.27 RTF WebGPU in Chrome, ~1.45 RTF WASM, 0.11–0.12 RTF on the multithreaded Node server.** No streaming. English only in practice.

Worth knowing about mainly as (a) evidence someone is actively maintaining a browser Kokoro path and (b) a drop-in if we ever want lip-sync or word-level highlighting of what the assistant is reading.

- https://github.com/met4citizen/HeadTTS

---

## 2. Chatterbox Turbo (Resemble AI) — localhost, best quality-per-effort

**The quality pick.**

| | |
|---|---|
| License | **MIT** — code and weights. Explicitly cleared for closed-source commercial use. |
| Released | Turbo: **15 Dec 2025**. Multilingual v3: **10 Jun 2026**, 25 languages/dialects. |
| Size | Turbo **350M params** (the family shares a 0.5B Llama backbone, 500k hours of audio) |
| VRAM | ~6 GB — a third of what he has |
| Latency | **sub-200 ms time-to-first-sound**, ~6× realtime on one GPU; Resemble quotes ~75 ms |
| Streaming | Yes, explicitly "streaming-ready inference for voice assistants and low-latency agent loops" |
| Cloning | Zero-shot from ~5 s of reference audio |
| Watermark | **PerTh watermarking is embedded in every output, by default.** Inaudible; there for EU AI Act Art. 50 compliance. Worth knowing, not a blocker. |

The headline number: in Resemble's own blind listening test, **65.3% of listeners preferred Chatterbox-Turbo over ElevenLabs Turbo v2.5, versus 24.5% for ElevenLabs.** Vendor-run, so discount it — but the community consensus in 2026 round-ups is consistent: Kokoro for speed, Chatterbox when quality matters, and Chatterbox is the one people describe as actually expressive. Turbo collapsed generation from ten diffusion steps to one, which is where the latency came from.

**Integration path — a localhost server, Ollama-shaped:**

```
pip install chatterbox-tts     # or:
docker run ... ghcr.io/... (devnen/Chatterbox-TTS-Server, OpenAI-compatible)
```

Two mature self-host wrappers, both with **OpenAI-compatible `/v1/audio/speech`** endpoints, Web UIs, and Docker images:
- `devnen/Chatterbox-TTS-Server` — v2.0 ships the whole Chatterbox family across CUDA/ROCm/CPU behind one API
- `travisvn/chatterbox-tts-api` — FastAPI, voice library, Docker-ready
- `dwain-barnes/chatterbox-streaming-api-docker` — the streaming-focused one

Because the endpoint is OpenAI-shaped, the client code in `speech.ts` is a `fetch` to `http://localhost:PORT/v1/audio/speech` returning audio bytes → `playAudioUrl` on a blob URL, or `decodeAudioData` → `playPcm`. Availability detection mirrors whatever the Ollama provider already does: probe, and if nothing answers, the option isn't offered.

**Honest assessment of "install one thing and it works":** it's a `docker run` or a pip install plus a first-run model download. That's the same order of friction as Ollama, but not *lower* — and unlike Ollama he doesn't have it already.

- https://www.resemble.ai/learn/models/chatterbox-turbo
- https://huggingface.co/ResembleAI/chatterbox-turbo — https://huggingface.co/ResembleAI/chatterbox
- https://github.com/resemble-ai/chatterbox
- https://github.com/devnen/Chatterbox-TTS-Server — https://github.com/travisvn/chatterbox-tts-api

---

## 3. Kokoro-FastAPI — the middle path

Same Kokoro weights, run as a local GPU server instead of in the browser. Apache-2.0 wrapper, actively maintained through 2026.

```
docker run -p 8880:8880 ghcr.io/remsky/kokoro-fastapi-gpu:latest
```

- OpenAI-compatible `/v1/audio/speech`, zero config
- **First-token latency ~300 ms on GPU** at chunk size 400 (vs ~3500 ms CPU on an older i7)
- 35×–100× realtime generation on an RTX card; RTF ~0.04–0.06 measured on a 4090
- Voice *mixing* with weights: `af_bella(2)+af_heart(1)`
- Caption timestamps, SSML, auto-stitching for long text, a readalong web UI

Same voice quality as option 1, roughly 5× the speed, at the cost of a server. Its main value over in-browser Kokoro is that it removes the 86 MB first-load and the WASM slow path; its main cost is that it violates the "static, no server" spirit for no gain in *naturalness*. If we're paying the server tax, Chatterbox buys more with it.

- https://github.com/remsky/Kokoro-FastAPI
- https://docs.openwebui.com/features/chat-conversations/audio/text-to-speech/Kokoro-FastAPI-integration/

---

## 4. Piper — the reliable floor

| | |
|---|---|
| License | **Original `rhasspy/piper` was MIT — archived read-only Oct 2025.** Active development moved to **`OHF-Voice/piper1-gpl` (GPL-3.0)** under the Open Home Foundation. Flag: GPL-3.0 on the current line. |
| Size | VITS→ONNX, well under 1 GB; individual voices ~20–75 MB |
| Voices | 100+ voices, 30+ languages, four quality tiers (x_low/low/medium/high) |
| Speed | Realtime on a Raspberry Pi 5 CPU; ~10× realtime on a modern desktop CPU |
| Browser | Yes — `@mintplex-labs/piper-tts-web` (MIT), **v1.0.5 published 11 Aug 2026** — genuinely current. Compiles phonemizer + ONNX inference to WASM; also has `OnnxWebGPURuntime`. ~75 MB per voice, cached by the browser. |

Piper is the dependable one: tiny, fast, offline, enormous voice catalogue, works on hardware that would embarrass a phone. **But its quality tier is below Kokoro's** — it's a 2023-era VITS stack, clearly better than Microsoft Zira, clearly flatter than Kokoro. Given that Kokoro is Apache-2.0, browser-capable, and better sounding, Piper is the answer only if Kokoro's WASM path turns out too slow on some machine and we want a lighter per-voice download, or if we want a much wider language spread.

The **GPL-3.0** on the current upstream is worth naming out loud. The browser wrapper is MIT and the *voice ONNX files* are individually licensed (mostly permissive), so the practical exposure is limited — but it's a change from the old MIT story and I'd want to look properly before shipping it.

- https://github.com/OHF-Voice/piper1-gpl
- https://huggingface.co/rhasspy/piper-voices
- https://www.npmjs.com/package/@mintplex-labs/piper-tts-web

---

## 5. Qwen3-TTS — the strongest streaming numbers

Released **22 Jan 2026** by Alibaba's Qwen team, **Apache-2.0**.

- Variants: 0.6B and 1.7B, each in Base / CustomVoice, plus a 1.7B VoiceDesign
- **End-to-end synthesis latency as low as 97 ms**, explicitly built for streaming
- **1.24 WER on the Seed-TTS English test set** — competitive with anything open
- Voice cloning from 3 s; voice *design* from a natural-language description
- 10 languages incl. English
- Runs via GGUF / EXL2 / Transformers / vLLM — llama.cpp-friendly, which matters given Ollama is already installed
- `qwen-tts-demo` launches a local web UI

The most technically impressive entry, and the one with the best latency story. The reason it isn't my recommendation is maturity of the *plumbing*, not the model: the repo is young (13 commits at time of writing) and there is no OpenAI-compatible drop-in server ecosystem around it the way there is for Kokoro and Chatterbox. Revisit in a few months; if the GGUF path matures it becomes the obvious localhost pick, because it would ride the same llama.cpp machinery Ollama already installed.

- https://github.com/QwenLM/Qwen3-TTS

---

## 6. KittenTTS — the extreme-lightweight option

Released **19 Feb 2026** by KittenML. 15M params, **~25 MB INT8** — the whole model is smaller than one Piper voice. CPU-only by design, ONNX-based, English only. There are already transformers.js browser demos (`clowerweb/kitten-tts-web-demo`) and a self-host server (`devnen/Kitten-TTS-Server`).

The genuinely interesting property for a PWA is that 25 MB is small enough to **vendor into `dist/` and ship offline** — no CDN fetch, no first-load network dependency, works on a plane. Quality is below Kokoro; it's the "good enough and truly free of network" corner. Worth a listen before dismissing, precisely because it's the only option here that could be fully self-contained in the build.

- https://github.com/KittenML/KittenTTS
- https://github.com/clowerweb/kitten-tts-web-demo

---

## Ruled out, with reasons

| Model | Why not |
|---|---|
| **XTTS-v2 / Coqui** | Weights are **CPML — non-commercial only**, and Coqui Inc. shut down Jan 2024, so **there is no longer anyone who can sell a commercial license.** The code fork (`idiap/coqui-ai-TTS`, MPL-2.0) is maintained and the voice cloning is still excellent, but the weights are a legal dead end. Personal/research only. |
| **F5-TTS** | **CC-BY-NC-4.0 — non-commercial.** Strong research model, wrong licence. |
| **Fish Speech / OpenAudio** | S1-mini weights are **CC-BY-NC-SA-4.0**; the flagship S1/S2 line went to a paid API (S2-pro succeeded S1 on 28 Feb 2026). Code is Apache-2.0, weights aren't. Fails the "never a paid service" rule at the top end and the licence test at the bottom. |
| **Orpheus (Canopy Labs)** | Apache-2.0 and genuinely good — 3B on Llama-3, ~200 ms streaming (25–50 ms with input streaming), promised 1B/400M/150M variants. But 3B is heavy for reading two-sentence assistant replies, and the smaller models are the part I could not confirm shipped. Real contender if the 400M lands. |
| **Higgs Audio V2** | Apache-2.0, Llama-3.2-3B based, very capable — but a 3B audio foundation model is enormous overkill for "read this reply aloud." |
| **VibeVoice** | Needs 12–20 GB VRAM; he has 16 GB, so it's borderline on a laptop GPU that's also running Ollama. |
| **OpenVoice / Parler-TTS / MeloTTS / Dia / Zonos / Sesame CSM** | All either superseded by the above on quality-per-watt, aimed at a different job (Dia is multi-speaker *dialogue*; OpenVoice is tone *conversion*), or without the 2026 maintenance signal to justify betting on. None of them beats Kokoro at the small end or Chatterbox at the quality end for this use. |

---

## Recommendation

### Pragmatic pick: **kokoro-js in the browser, q8 / WebGPU with WASM fallback**

It is Apache-2.0, it needs no server at all, it keeps the static-PWA property completely intact, it has 20 American-English voices to choose from, it streams, and the API hands back a `Float32Array` that `playPcm` already knows how to play. It is a dramatic step up from Microsoft David.

**Integration effort: roughly half a day.**

1. `npm i kokoro-js`; load it through a **dynamic import** only when the voice is selected — same discipline invariant 8 imposes on assistant providers, and it keeps the 86 MB out of the main bundle path.
2. Add `speakKokoro(text, voice, onDone): Promise<PlaybackHandle | null>` to `speech.ts`, returning `playPcm(audio.audio, audio.sampling_rate, onDone, 0.85)`.
3. Feature-detect: `'gpu' in navigator` → `device: 'webgpu'`, else `'wasm'`.
4. Add the voice choice to the existing settings surface alongside Gemini TTS / browser voice, with a voice picker (the 20 en-US voicepacks, with `af_heart` as default).
5. Every failure path — no WebGPU, CDN unreachable, model load throws — falls back to `speakLocal`. Nothing new becomes load-bearing.

The first-run download is the one thing to design around: a visible "downloading voice (86 MB), one time" state, and the option stays un-selected until it succeeds.

### Higher-quality pick: **Chatterbox Turbo behind a localhost OpenAI-compatible server**

MIT, 350M params, ~6 GB VRAM on a 16 GB card, sub-200 ms first sound, streaming, and the only model here that people describe as *expressive* rather than merely clear.

**Integration effort: roughly half a day of app code, plus a genuine setup step for Riz.**

1. He runs `devnen/Chatterbox-TTS-Server` (Docker, CUDA) — call it fifteen minutes plus a model download.
2. In `speech.ts`, a `speakChatterbox` that POSTs to `http://localhost:PORT/v1/audio/speech` and plays the returned bytes via `playAudioUrl` on a blob URL (or `decodeAudioData` → `playPcm` for the gain stage).
3. A `chatterboxAvailable()` probe, exactly parallel to the Ollama probe. If nothing answers, **the option is absent, not disabled** — house rule.
4. Same fallback chain to `speakLocal`.

Because the endpoint is OpenAI-shaped, this same client code would also work unchanged against Kokoro-FastAPI, and against most future local TTS servers. That argues for writing the localhost client as "an OpenAI-compatible TTS endpoint at a configurable URL" rather than as "the Chatterbox client" — one seam, several possible engines behind it.

### What I'd actually do

Ship the browser Kokoro first and listen to it. It may simply be good enough, and it costs nothing operationally. If it isn't expressive enough, add the generic localhost OpenAI-TTS client afterwards and point it at Chatterbox Turbo — that's additive, and the two coexist as two entries in the same voice menu.

---

## What I could not verify

- **I have not listened to any of these.** Every quality claim here is second-hand — vendor blind tests (Resemble's own 65.3% figure), community round-ups, and benchmark numbers. The "kinda suck" judgement is his ear's to make and I'd want him to hear Kokoro `af_heart` and Chatterbox side by side before we commit.
- **Exact voice count exposed by `kokoro-js`.** The Kokoro-82M v1.0 model ships 54 voicepacks across 8 languages; the library docs describe "30+ options across American/British English." Whether `tts.list_voices()` returns all 54 or only the English subset, I could not confirm without installing it. Either way the English selection (20 en-US, 8 en-GB) is ample.
- **Chatterbox Turbo's precise VRAM figure.** "~6 GB" comes from a secondary round-up, not Resemble's own docs, which quote params and latency but not memory. Comfortably within 16 GB either way.
- **Orpheus's smaller variants.** Canopy Labs announced 1B/400M/150M models; I found no confirmation that they shipped. If the 400M exists, Orpheus deserves a second look.
- **`kokoro-js` maintenance intent.** The package genuinely has not been republished since 2025-05-03 (verified against the npm registry). I read that as "stable and finished, tracking an unchanged model" rather than "abandoned," but it is an inference.
- **PerTh watermark behaviour** in the community server wrappers — whether it can be disabled, and whether it survives the encode path. Inaudible by design, so this is a curiosity rather than a concern.

---

*Researched 26 Aug 2026. All claims above were checked against live sources on that date; nothing here is from model memory.*
