# Tempus AI schedule assistant — design

Date: 25 August 2026. Approved in principle by Riz the same day (transport:
own Anthropic API key stored locally; powers: propose-then-approve; UI:
floating button + popup chat panel). This reverses the standing "no LLM
features" scope rule — Riz, who owns the scope list, asked for it explicitly.

## Goal

Talk to an assistant about the schedule — "I have three hours today, what
should I actually do?", "push everything for the essay to next week" — and let
it *propose* changes the user applies with one click. It reasons over the same
truth the app shows: the task graph, the derived layer, and today's plan.

## Non-goals

- No server, no proxy, no account. Calls go browser → Anthropic API directly.
- No autonomous writes. The assistant never touches the store; it emits
  proposals, and only the user's Apply commits them.
- No voice, no sync, no recurring anything (the rest of the scope list stands).
- No conversation persistence in v1. The chat lives in memory; closing the
  panel keeps it, reloading the app clears it.

## The seam — `src/lib/assistant/`

Mirrors `lib/calendar/` exactly, because the constraint is the same:
**the assistant is never load-bearing.** With no API key stored the app is
fully functional, the assistant UI is absent rather than disabled, and no
request leaves the device.

```
src/lib/assistant/
  types.ts             # AssistantProvider, ProposalOp, AssistantReply
  context.ts           # snapshot + derived layer -> compact prompt text (pure)
  proposals.ts         # op validation against a snapshot (pure)
  anthropicProvider.ts # the real one; only file that imports the SDK
  noopProvider.ts      # available: false; the default
  index.ts             # picks provider from the stored key
```

Nothing in `lib/assistant/` imports from store, components, or views.

### `AssistantProvider`

```ts
interface AssistantProvider {
  readonly kind: 'none' | 'anthropic';
  readonly available: boolean;          // false hides ALL assistant UI
  send(
    history: ChatTurn[],                // prior turns, so the chat has memory
    context: string,                    // serialized snapshot + derived layer
    onText: (delta: string) => void,    // streamed text as it arrives
  ): Promise<AssistantReply>;
}

interface AssistantReply {
  text: string;
  proposals: ProposalOp[];              // [] when it only talked
}
```

### Proposal ops

The complete v1 vocabulary, chosen to map one-to-one onto existing store
mutations so nothing new can corrupt the graph:

```ts
type ProposalOp =
  | { kind: 'create_task'; title: string; projectId: string | null;
      estimateMinutes: number | null; dueAt: string | null;
      dependsOn: string[] }
  | { kind: 'update_task'; taskId: string;
      patch: { title?: string; estimateMinutes?: number | null;
               dueAt?: string | null; earliestStartAt?: string | null;
               pinnedAt?: string | null; status?: TaskStatus } }
  | { kind: 'add_dependency'; dependentId: string; dependencyId: string }
  | { kind: 'remove_dependency'; dependentId: string; dependencyId: string }
  | { kind: 'set_capacity'; date: string; capacityMinutes: number | null };
```

`proposals.ts` exposes `validateOps(ops, snapshot)`: every referenced task id
must exist, every `add_dependency` must pass `wouldCreateCycle`, dates must
parse. Invalid ops are dropped with a reason the UI shows ("2 of 5 suggestions
referenced tasks that no longer exist"), valid ones survive — state can move
between the model answering and the user clicking Apply, so Apply re-validates.

### The Anthropic call

- SDK: `@anthropic-ai/sdk`, `new Anthropic({ apiKey, dangerouslyAllowBrowser:
  true })`. The flag is what it says; the key is the user's own, on the user's
  own device, which is the one situation it exists for.
- Model: `claude-opus-5`, adaptive thinking (default), streaming via
  `client.messages.stream(...)` — text deltas drive `onText`, the final
  message is parsed for proposals.
- Proposals arrive through a single strict tool, `propose_changes`, whose
  input schema is the op list above (`strict: true`, so `tool_use.input`
  validates exactly). When the model calls it, the client answers with a
  `tool_result` ("shown to the user for approval") and lets the model finish
  its prose; the loop is capped at 4 round-trips.
- The system prompt states the app's semantics (edges mean "can't start X
  until Y is done", pinned means a fixed clock time, `waiting` blocks
  downstream exactly like `todo`) and the read-only contract: propose via the
  tool, never claim a change was made.
- Errors render inline in the chat as the assistant's turn failing — never in
  the app-shell error banner, which is reserved for data-loss-grade problems.

### Context serialization (`context.ts`)

A compact, deterministic text block: settings (day start, capacity, time
format), projects, every non-archived task (id, title, status, estimate, due,
pinned, dependsOn) plus archived tasks that are still load-bearing, today's
schedule with the plan `scheduleDay` produced, and the derived layer —
ready set, propagated deadlines with slack, conflicts. Pure function of
(snapshot, derived, now); unit-tested for shape and for the invariant that it
never leaks `archivedAt` filtering into what dependencies resolve against.

## Key storage

`localStorage`, key `tempus.assistant.apiKey`, behind the
`lib/platform/preferences` interface like every other browser-storage read.
It is not task data (invariant 4 untouched) and deliberately **not** part of
the JSON export — an export shared with someone must never carry a billing
credential. Settings gains an "Assistant" panel: password-type field, Save,
Remove, and a "test connection" that sends a 1-token ping and reports.

## Applying proposals — `applyAssistantOps` (store)

One new store action, mirroring `applyImport`: takes validated ops, re-checks
each against live state (ids still exist, `wouldCreateCycle` again for edges),
applies all of them in **one commit** labelled "Apply assistant suggestions".
One Cmd-Z reverses the whole application. Every op routes through the same
draft mutations the existing actions use; the completion path runs the
auto-archive sweep exactly as `completeTask` does.

## UI

- **`AssistantButton`** — floating circular button (min 44px), bottom-right
  desktop, above the tab bar on phone. Rendered only when
  `provider.available`. Idle: a quiet glyph. Thinking: spring pulse
  (`prefers-reduced-motion`: cut to a static "…" state). A reply finishing
  while the panel is closed sets a small badge dot (accent color + a shape,
  never color alone).
- **`AssistantPanel`** — popup panel (radius 14) anchored to the button;
  bottom sheet on phone. Chat transcript, input, streamed text rendering.
  Fully keyboard operable: the button is focusable, Escape closes, focus is
  trapped while open (copy `SettingsSheet`'s corrected guard).
- **Proposal card** — renders each op in plain words with the affected task
  names ("Pin *Draft the intro* at 14:00", "Make *Book venue* depend on
  *Confirm date*"), with Apply all / Dismiss. Derived values stay visually
  read-only per invariant 6. Applied cards collapse to a "Applied · Undo"
  line.
- Store access at view level; both components presentational, per convention.

## CLAUDE.md changes

- "LLM features" leaves the deliberately-out list; a line about this seam
  replaces it.
- New invariant: **The assistant is never load-bearing and never writes.**
  App fully functional with no key; all mutations go through
  `applyAssistantOps` with re-validation; the key never enters the export.

## Testing

- `context.ts`, `proposals.ts`: full vitest coverage (pure).
- `applyAssistantOps`: store tests — one undo step, cycle rejected at apply
  time even if it validated earlier, vanished task id dropped not crashed,
  completion op runs the archive sweep.
- `anthropicProvider`: the pure parts (request assembly, reply parsing from a
  canned message shape) tested; the network call itself is not.
- UI: screenshot + console + keyboard loop at 1440×900 and 390×844, light and
  dark, per the working agreement. Riz reviews the pixels.

## Risks, stated

- **The key sits in localStorage.** Any XSS would expose it. Accepted for a
  personal, local-first app with no third-party script surface; the Settings
  copy says plainly "stored only on this device."
- **Token cost is real money.** Every send includes the full context block.
  Fine at personal scale (tens of tasks); revisit with prompt caching if the
  graph grows into hundreds.
- **The model can propose nonsense.** The propose-then-approve gate and
  re-validation at apply time mean nonsense costs a Dismiss click, never data.
