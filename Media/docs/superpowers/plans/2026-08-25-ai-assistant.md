# AI Schedule Assistant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A chat assistant that reads the task graph and proposes schedule changes the user applies with one click, behind a provider seam that leaves the app untouched when no API key is stored.

**Architecture:** `src/lib/assistant/` mirrors `src/lib/calendar/` — an interface, a no-op default, and an Anthropic implementation that is dynamically imported so the SDK never enters the entry chunk. Proposals flow through pure validation (`proposals.ts`) into one store action (`applyAssistantOps`) that re-validates and commits once. UI is a floating button + popup panel rendered only when a key exists.

**Tech Stack:** `@anthropic-ai/sdk` (browser, `dangerouslyAllowBrowser`), model `claude-opus-5`, streaming; existing Zustand store, vitest.

**Spec:** `docs/superpowers/specs/2026-08-25-ai-assistant-design.md`

## Global Constraints

- Nothing in `lib/assistant/` imports from `src/store`, `src/components`, or `src/views`.
- `archivedAt` is never used to filter what dependencies resolve against.
- Key stored via the `Preferences` interface (`lib/platform/preferences`), key name `assistant.apiKey` (the interface prefixes `tempus.`). Never in the JSON export.
- `provider.available === false` ⇒ zero assistant UI anywhere, no SDK code loaded.
- Design tokens only; 44px hit targets; keyboard operable; light/dark parity; `prefers-reduced-motion` honoured.
- `npx tsc --noEmit` clean and all tests green before every commit.

---

### Task 1: Types + proposal validation (`lib/assistant/types.ts`, `proposals.ts`)

**Files:**
- Create: `src/lib/assistant/types.ts`, `src/lib/assistant/proposals.ts`
- Test: `src/lib/assistant/proposals.test.ts`

**Interfaces — Produces:**

```ts
// types.ts
export interface ChatTurn { role: 'user' | 'assistant'; text: string }
export type ProposalOp =
  | { kind: 'create_task'; title: string; projectId: string | null;
      estimateMinutes: number | null; dueAt: string | null; dependsOn: string[] }
  | { kind: 'update_task'; taskId: string; patch: {
      title?: string; estimateMinutes?: number | null; dueAt?: string | null;
      earliestStartAt?: string | null; pinnedAt?: string | null; status?: TaskStatus } }
  | { kind: 'add_dependency'; dependentId: string; dependencyId: string }
  | { kind: 'remove_dependency'; dependentId: string; dependencyId: string }
  | { kind: 'set_capacity'; date: string; capacityMinutes: number | null };
export interface AssistantReply { text: string; proposals: ProposalOp[] }
export interface AssistantProvider {
  readonly kind: 'none' | 'anthropic';
  readonly available: boolean;
  send(history: ChatTurn[], context: string, onText: (delta: string) => void): Promise<AssistantReply>;
}
// proposals.ts
export interface ValidationResult { valid: ProposalOp[]; dropped: { op: ProposalOp; reason: string }[] }
export function validateOps(ops: ProposalOp[], snapshot: Snapshot): ValidationResult
```

- [ ] Write failing tests: existing-id checks per op kind, cycle rejection via `wouldCreateCycle`, bad ISO date dropped, bad day key dropped, valid ops survive in order.
- [ ] Run, watch fail. Implement `validateOps`. Run, watch pass. `tsc` clean. Commit.

### Task 2: Context serialization (`lib/assistant/context.ts`)

**Files:**
- Create: `src/lib/assistant/context.ts`
- Test: `src/lib/assistant/context.test.ts`

**Produces:** `serializeContext(snapshot: Snapshot, now: Date): string` — deterministic text: settings, projects, live tasks + archived-but-load-bearing tasks (id, title, status, estimate, due, pinned, dependsOn), ready-set ids, propagated `mustStartBy`, conflicts. Uses `readySet`, `propagateDeadlines`, `conflicts` from `lib/graph`.

- [ ] Failing tests: contains a live task's id and title; archived task with a live dependent is present, archived leaf is absent; ready ids listed; deterministic (two calls equal); no `archivedAt` filtering upstream of graph calls (archived done dependency still yields a ready dependent in the READY section).
- [ ] Implement, pass, commit.

### Task 3: `applyAssistantOps` store action

**Files:**
- Modify: `src/store/types.ts` (add `applyAssistantOps: (ops: ProposalOp[]) => void`), `src/store/store.ts`
- Test: `src/store/store.test.ts`

Mirrors `applyImport`: ONE commit "Apply assistant suggestions"; re-checks each op against the draft (missing id ⇒ skip op; `wouldCreateCycle` re-run per edge against current tasks including edges added earlier in the same batch; `status: 'done'` sets `completedAt` and runs `applySweep`; status away from done clears both stamps). `create_task` filters `dependsOn` to existing ids and existing project ids to null.

- [ ] Failing tests: batch applies in one undo step; cycle op skipped while the rest apply; vanished taskId skipped without throwing; done-status op archives a leaf via the sweep; create_task with ghost dependency drops just the ghost edge.
- [ ] Implement, pass, `tsc`, commit.

### Task 4: Providers + key storage (`anthropicProvider.ts`, `noopProvider.ts`, `index.ts`)

**Files:**
- Create: `src/lib/assistant/anthropicProvider.ts`, `noopProvider.ts`, `index.ts`, `prompt.ts`
- Test: `src/lib/assistant/anthropicProvider.test.ts` (pure parts)
- Modify: `package.json` (`npm install @anthropic-ai/sdk`)

**Produces:**
```ts
// index.ts
export function getAssistantApiKey(prefs?: Preferences): string | null   // key 'assistant.apiKey'
export function setAssistantApiKey(key: string | null, prefs?: Preferences): void
export async function loadAssistantProvider(): Promise<AssistantProvider> // noop when no key; dynamic import of anthropicProvider when set
// anthropicProvider.ts
export function createAnthropicProvider(apiKey: string): AssistantProvider
export function parseReply(message: { content: unknown[] }): AssistantReply  // exported for tests
export const PROPOSE_TOOL: Anthropic.Tool  // strict:true, input_schema = { ops: ProposalOp[] }
// prompt.ts
export const SYSTEM_PROMPT: string
```

`send()`: `client.messages.stream({ model: 'claude-opus-5', max_tokens: 16000, system: SYSTEM_PROMPT, tools: [PROPOSE_TOOL], messages: history + context-in-first-user-turn })`, forwarding text deltas to `onText`; on `stop_reason === 'tool_use'` append the assistant content + a `tool_result` ("Shown to the user for approval.") and continue, max 4 round-trips; accumulate proposals across rounds. Errors rethrown with a readable message for the chat to render.

- [ ] Failing tests: `parseReply` extracts text and ops from a canned message with a `tool_use` block; returns empty proposals for text-only; key get/set/remove round-trips through `createMemoryPreferences`; `loadAssistantProvider` returns `available: false` with no key.
- [ ] Implement, pass, `tsc`, commit.

### Task 5: Settings "Assistant" panel

**Files:**
- Create: `src/components/AssistantPanelSettings.tsx`
- Modify: `src/components/SettingsSheet.tsx` (new section/tab, copy the Calendar panel's structure)

Password-type field, Save / Remove, inline "stored only on this device — never part of an export" caption, "Test connection" button that sends a 1-token request and reports success/failure inline. Panel always visible in Settings (it's the way to turn the feature on).

- [ ] Implement; verify by screenshot loop; `tsc`; commit.

### Task 6: AssistantButton + AssistantPanel + proposal cards

**Files:**
- Create: `src/components/assistant/AssistantButton.tsx`, `AssistantPanel.tsx`, `ProposalCard.tsx`, `src/views/useAssistant.ts` (view-level hook owning chat state, provider, badge)
- Modify: `src/App.tsx` (mount at shell level so it floats over every view)

Hook: holds `turns`, `busy`, `unread`, `proposals per turn`; `sendMessage(text)` serializes context from live store state, streams into the last assistant turn; Apply routes `validateOps` → `applyAssistantOps`; dropped ops render their reasons. Button: fixed bottom-right (desktop) / above TabBar (phone), 44px, spring pulse while busy (reduced-motion: static ellipsis), badge dot when `unread`. Panel: radius-14 popup anchored above the button, focus-trapped, Escape closes; phone: bottom sheet.

- [ ] Implement; screenshot loop at both sizes, both themes, console clean; `tsc`; commit.

### Task 7: Docs + wrap-up

**Files:**
- Modify: `CLAUDE.md` (scope list, new invariant), `STATUS.md` (record R1, R2-regenerate, assistant), memory files.

- [ ] Update docs, run full gates (`tsc`, tests, build), commit.

## Self-review

Spec coverage: seam (T4), context (T2), proposals+validation (T1), apply (T3), settings key UI (T5), button/panel/cards (T6), CLAUDE.md (T7), tests distributed per task. Types consistent across tasks (ProposalOp defined once in T1, consumed by T3/T4/T6). No placeholders: each task names exact files, signatures, and test cases.
