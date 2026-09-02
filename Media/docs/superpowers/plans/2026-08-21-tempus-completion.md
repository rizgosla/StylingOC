# Tempus Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Take Tempus from 8-of-11 stages to a finished, verified product — Google Calendar's write path proven against a real account, archiving built, the inspector rebuilt on real controls, the phone layout and PWA shipped, seed data in place, and every item on the brief's *Done means* list checked off.

**Architecture:** Static local-first PWA. Vite + React 18 + TypeScript strict, Zustand + immer for state, Dexie/IndexedDB for persistence, `@xyflow/react` for the graph canvas, Tailwind for tokens, `motion` for springs. The dependency direction is one-way: `views → components → store → lib`. All derived logic is pure and lives in `src/lib/graph/`.

**Tech Stack:** vite 7 · react 18.3 · typescript 5.9 (strict) · zustand 5 · immer 10 · dexie 4 · @xyflow/react 12 · tailwindcss 3.4 · motion 12 · date-fns 4 · lucide-react 1.30 · vitest 4 · @testing-library/react 16 · vite-plugin-pwa 1.3 (installed, not yet wired)

**Spec:** `C:\Users\rizgo\Documents\Tempus\build-prompt.md` — the authoritative brief. `CLAUDE.md` restates its invariants. `STATUS.md` is the current backlog. **Read `build-prompt.md` before Task 1.** Where this plan and the brief disagree, the brief wins unless this plan's Rulings section says otherwise.

**Repo:** `C:\Users\rizgo\Documents\Tempus` · branch `main` · Windows, PowerShell primary

---

## Global Constraints

Every task's requirements implicitly include this section. Copy the relevant lines into each task brief.

### Non-negotiable invariants

1. **Archived tasks are never filtered out upstream of `lib/graph/`.** `readySet` checks that every task in `dependsOn` has `status === 'done'`. Drop an archived task from the input set and every task downstream becomes permanently unresolvable — silently. `src/store/selectors.ts` is **the only file in the codebase that may read `archivedAt` for filtering**, and its header comment says so. Never write `.filter(t => !t.archivedAt)` in the store or under `lib/`.
2. **The graph is a DAG.** Every edge mutation runs `wouldCreateCycle` before commit. There is no code path that writes an edge without it.
3. **Derived logic stays pure and stays in `lib/graph/`.** `readySet`, `blockingPath`, `criticalPath`, `propagateDeadlines`, `scheduleDay`, `conflicts` take data, return data, touch nothing else.
4. **Task data lives in IndexedDB via Dexie only.** No `localStorage` for tasks, projects, or schedules. UI state (theme, last view, pinned ids, hint dismissal) may use `localStorage`, via `browserPreferences` in `src/lib/platform/preferences.ts`.
5. **No component imports a `platform/` implementation directly** — only the interface/hook.
6. **Derived values are never presented as user input.** `mustStartBy`, slack, critical-path membership, conflicts, and the new pace factor render in the read-only strip, visually distinct from typed fields.
7. **Google Calendar is never load-bearing.** With `VITE_GOOGLE_CLIENT_ID` unset: no Calendar tab, no header chip, no request to Google, clean console.

### Design tokens — authoritative, defined in `tailwind.config.ts`

Do not introduce ad-hoc hex values, one-off spacing, or a new accent colour. A new token is a conversation, not a decision. The one token addition this plan authorises is named in Task 14.

- **Type scale, and nothing between:** `text-display` 34 / `text-title` 28 / `text-title2` 22 / `text-title3` 20 / `text-body` 17 / `text-subhead` 15 / `text-footnote` 13 / `text-caption` 11. Body copy is `text-body` at 400. UI labels are `text-footnote` at 500. Font is Work Sans via `var(--font-sans)`.
- **`tabular-nums` on every duration and time.** Tailwind class `tnum` is already wired in `src/index.css`.
- **Colour, semantic only:** `accent` #007AFF · `ready` #34C759 · `waiting` #FF9500 · `overdue` #FF3B30 · `critical` #AF52DE. Surfaces are `surface-base` / `surface-raised` / `surface-overlay`, named by role so they swap correctly between themes. Labels are `text-label` / `text-label-secondary` (60%) / `text-label-tertiary` (30%).
- **Colour is never the only signal.** Every coloured state pairs with a shape or an icon.
- **Light/dark parity is required, not optional.** Every change ships in both. Because colours resolve through CSS custom properties, a component writes `bg-surface-raised` once and is correct in both themes — there is no `dark:` variant to write.
- **Space:** 8pt grid, 4pt subdivisions. `h-hit` = 44px minimum hit target. `w-inspector` = 320px, `w-sidebar` = 260px.
- **Radii, concentric** (a nested radius = its parent's minus the gap): `rounded-control` 6 · `rounded-card` 10 · `rounded-panel` 14 · `rounded-sheet` 20.
- **Separators** are `border-hairline border-separator` (0.5px), never 1px borders.
- **Motion is springs, not easing.** Use the existing helpers in `src/lib/motion.ts`: `springUI` `{ stiffness: 400, damping: 30 }` for UI, `springLayout` `{ stiffness: 200, damping: 25 }` for layout, always wrapped in `transition(...)` — that wrapper already returns `duration: 0` under `prefers-reduced-motion`, so honouring the preference is free and must not be re-implemented.
- **Material:** one glass surface (`bg-glass backdrop-blur-xl`) per view, maximum. Text never sits directly on glass — it sits on an opaque plate above it.
- **Empty states** are written as an invitation and a next action. Never an apology, never a shrug.
- **Project `accentHue`** tints a node's left border and dot only. Never a whole card.

### Code conventions

- TypeScript strict. **No `any`. No non-null assertions on data from the store.**
- Named exports throughout. No default exports except views.
- Components are presentational and take data as props. Store access happens at the view level.
- Every mutation goes through a store action. Never a direct Dexie write from a component.
- Keyboard access is a requirement, not an enhancement. Every action reachable without a mouse; every focus ring visible.

### Verification gates — every task

```
npx tsc --noEmit          # must be clean
npm run test              # must be green (baseline: 361 tests, 22 files)
npm run build             # must be clean
```

Any task that renders pixels additionally requires, before it can be called done:
1. Screenshot at **1440×900 and 390×844, in light and dark** — four images.
2. **Zero console errors and zero React warnings.**
3. **Tab through the whole view**; every focus ring visible.

Riz reviews the screenshots himself. **Do not dispatch the `design-critic` agent** — that is a standing instruction, not an oversight.

### Git

Commit on `main`. No remote, nothing pushed. One commit per task minimum; a task with several steps may commit per step. Message style matches the existing log — imperative, describes the user-visible change, e.g. *"Give every block the height of its length, and let a long day scroll"*.

---

## Rulings already made — do not re-litigate

These were decided with Riz in the planning session. They override the brief where they conflict with it.

| # | Ruling | Consequence if wrong |
|---|---|---|
| R1 | **Archiving stays as shipped.** `completeTask` sets `completedAt` and `archivedAt` together (`src/store/store.ts:203-211`). The brief's dependent-aware auto-archive sweep is **not built**. | The Archive view lists work that is still load-bearing. Mitigated because `useVisibleGraph` keeps archived blockers on the canvas, muted. |
| R2 | **`manualOrder` is deleted**, not wired up. `pinnedAt` drag is the better gesture and already ships. The brief's "Regenerate" affordance is therefore cut. | Loses a documented capability nothing reached. Reversible from git. |
| R3 | **Full subagent-driven development, including UI.** The brief's "you remain the sole author of all UI code" is explicitly overridden. **Mitigation is mandatory:** every UI task brief must name the exact tokens to use and name an existing component to copy the pattern from. | Divergent spacing and duplicate button implementations. The task reviewer's job is to catch it. |
| R4 | **Work on `main`, no worktree.** Overrides `superpowers:using-git-worktrees`. Solo local repo, no remote, and the calendar work needs the git-ignored `.env`. | No isolation. Mitigated by per-task commits and the review loop. |
| R5 | **Strict TDD in `lib/` and `store/` only.** Components are verified by the screenshot + console + keyboard loop above. Component tests are written only where there is real logic to pin — named explicitly in Tasks 10 and 25. | Lower confidence on component regressions. Matches how the existing 361 tests were built. |
| R6 | **New feature: estimate calibration only.** Four other proposals are recorded at the end of this plan, unbuilt. | — |

### Decisions still owed from Riz — defaults chosen so execution never stalls

Execute with the default. Flag each in the stage report so Riz can overrule.

| # | Question | Default to execute |
|---|---|---|
| D1 | `apple-mobile-web-app-status-bar-style` | Ship `black-translucent` as the brief mandates. It forces white status-bar glyphs, which in light theme is white-on-`#F2F2F7` — an invisible clock. iOS caches it at install time so it cannot follow the theme. **Top of the on-device checklist**; switching to `default` is a reportable deviation. |
| D2 | `maximum-scale=1` at `index.html:9` | **Remove it.** It blocks user zoom, the brief never asks for it, and Android honours it. |
| D3 | `navigator.storage.persist()` | **Ship it**, fire-and-forget after hydrate. Safari won't grant it; Chrome and Firefox will. |
| D4 | Phone nav shape | **Three tabs (Ready/Day/Inbox) plus a slim top bar** carrying Graph and Settings. Settings and the conflicts badge live only in `Sidebar.tsx`, which does not render on phone, and Settings → Data is where JSON export lives. |
| D5 | App icon mark | **Three dots joined by two edges (● → ● → ●)** in `accent` on the surface ground — the product's core data type, legible at 32px. |

---

## Current State — verified 21 Aug 2026

Do not re-derive this. It was measured, not remembered.

- `npx tsc --noEmit` — **clean**
- `npm run test` — **361 passed, 22 files, 35.5s**
- `npm run build` — clean; bundle **721 kB raw / 230 kB gzipped**, trips Vite's 500 kB warning
- 102 source files, ~16,600 lines
- Stages 1–7 done. Stage 8 (Calendar) committed, read path verified in browser, **write path never executed**. Stages 9, 10, 11 and the polish pass not started.
- Canvas `.ics` import shipped unplanned and is done (`src/lib/import/`, 39 tests).
- Graph layout uses a **custom force worker** (`src/lib/layout/force.worker.ts`), **not elkjs** — a pre-existing deviation from the brief's locked stack. Leave it alone.

### Five real bugs found during planning — each silently breaks something

| # | Bug | Fixed in |
|---|---|---|
| B1 | `panOnDrag={[1, 2]}` (`GraphView.tsx:466`) is middle+right mouse button. **A phone has neither, so the canvas cannot be panned on touch at all.** | Task 20 |
| B2 | The position-persist effect (`GraphView.tsx:128-143`) calls `updateTask` per settled node, which funnels through `commit('Edit task', …)` — so a "read-only" phone graph would **write to IndexedDB and push one undo entry per node**. | Task 20 |
| B3 | `ReactFlowProvider` imported at `App.tsx:2` drags all of `@xyflow/react` into the entry chunk. **Lazy-loading GraphView without moving it achieves exactly zero, and looks like it worked.** | Task 3 |
| B4 | `readLastView()` can restore `'archive'` (`ui.ts:14`) into a view with no way back on phone. | Task 15 |
| B5 | `lib/theme.ts:39` hardcodes `#000000` as the dark `theme-color`, while the real dark ground is `#1A1917` (`appearance.ts:56`). `applyAppearance` corrects it afterwards in `main.tsx:11` — order-dependent and fragile, and it now matters because the status bar is visible chrome. | Task 22 |

---

## File Structure

**Created:**

| Path | Responsibility |
|---|---|
| `src/lib/graph/collapseChains.ts` | Pure: group runs of archived blockers into one collapsed node model |
| `src/lib/graph/collapseChains.test.ts` | Its tests |
| `src/lib/graph/calibration.ts` | Pure: median actual/estimate ratio over completed tasks |
| `src/lib/graph/calibration.test.ts` | Its tests |
| `src/lib/platform/viewport.ts` | `PHONE_QUERY`, `matchesPhone`, `useIsPhone`, `useVisualViewportInset` |
| `src/lib/platform/viewport.test.ts` | Tests for `matchesPhone` with an injected `MediaQueryList` |
| `src/lib/platform/install.ts` | `isStandalone`, `isIos`, install-hint dismissal state |
| `src/lib/seed.ts` | The shipped Stage-11 seed project |
| `src/views/ArchiveView.tsx` | The fifth view |
| `src/views/day/WeekGlance.tsx` · `MonthGlance.tsx` | Lifted out of `DayView.tsx` |
| `src/components/day/CapacityControl.tsx` · `CarriedOverStrip.tsx` | Lifted out of `DayView.tsx` |
| `src/components/Popover.tsx` | The app's one floating-layer primitive |
| `src/components/Select.tsx` | Replaces the two raw `<select>` elements |
| `src/components/DateTimeField.tsx` | Replaces the three native date/datetime inputs |
| `src/components/TabBar.tsx` · `PhoneTopBar.tsx` | Phone chrome |
| `src/components/inspector/BottomSheet.tsx` | Generic sheet; knows nothing about tasks |
| `src/components/InstallHint.tsx` | iOS Add-to-Home-Screen card |
| `public/icon.svg`, `favicon.svg`, `favicon.ico`, `pwa-192x192.png`, `pwa-512x512.png`, `pwa-maskable-512x512.png`, `apple-touch-icon-180x180.png`, `splash/*.png` | PWA assets |

**Modified (principal):** `src/App.tsx` · `src/components/AppShell.tsx` · `src/components/Sidebar.tsx` · `src/components/inspector/{Inspector,InspectorHost}.tsx` · `src/views/{GraphView,DayView,ReadyView,InboxView}.tsx` · `src/store/{store,selectors,types,ui}.ts` · `src/lib/{types,time,theme}.ts` · `src/lib/db/schema.ts` · `src/lib/graph/{scheduleDay,types,index}.ts` · `vite.config.ts` · `index.html` · `tailwind.config.ts` · `STATUS.md` · `README.md`

---

# PHASE A — Close the Stage 8 gate

## Task 1: Verify the Google Calendar write path against a real account

**This is the only task in the plan that is primarily manual.** It is first because it is the last open gate from Stage 8 and Riz has confirmed the OAuth consent screen is ready.

**Files:**
- Modify (only if bugs are found): `src/lib/calendar/googleProvider.ts`
- Modify: `STATUS.md` (bug #4)

**Interfaces:**
- Consumes: nothing
- Produces: nothing. A verified subsystem and a `STATUS.md` edit.

**Context the implementer needs:** `src/lib/calendar/googleProvider.ts` is 476 lines. Its read path is verified in the browser. Its write path has never executed. `VITE_GOOGLE_CLIENT_ID` is set in the git-ignored `.env`. Auth is Google Identity Services token flow (`google.accounts.oauth2.initTokenClient`) — a public client, no secret, no refresh token. Access tokens last about an hour and live in memory plus `sessionStorage`, never IndexedDB.

- [ ] **Step 1: Start the dev server and connect**

Run `npm run dev`, open `http://localhost:5173` in Chrome via the DevTools MCP, go to Settings → Calendar, click Connect. Confirm the consent screen requests the read-**write** scope (`https://www.googleapis.com/auth/calendar`, `googleProvider.ts:34`) and that `connection().canWrite` is true afterwards.

- [ ] **Step 2: First push — prove the app creates its own calendar**

Enable push, generate a day with at least two blocks, push it. In Google Calendar's web UI confirm a **new calendar named `Tempus`** now exists and that the events landed there, **not** on the primary calendar. `appCalendarId()` is `googleProvider.ts:289-311`.

- [ ] **Step 3: Prove the rewrite is surgical**

By hand, in Google Calendar's UI, add an event to the `Tempus` calendar that Tempus did not create. Then change the day in Tempus and push again. `ownEvents()` (`googleProvider.ts:314-327`) filters on `privateExtendedProperty: tempusApp=1`, and `pushDay()` (`:329-364`) deletes then re-inserts only those.

**Expected:** the hand-made event **survives**. Tempus's own events are replaced. Nothing on the primary calendar changed. If the hand-made event is deleted, that is a Critical bug — stop and fix `ownEvents`/`pushDay` before continuing.

- [ ] **Step 4: Prove disconnect is surgical**

Settings → Calendar → Disconnect, with "delete what Tempus created" checked. `disconnect({ deleteCreated: true })` is `googleProvider.ts:396-418`.

**Expected:** the `Tempus` calendar is gone. The primary calendar and every other calendar are untouched. The token is revoked.

- [ ] **Step 5: Prove the no-op gate still holds**

Temporarily blank `VITE_GOOGLE_CLIENT_ID` in `.env`, restart the dev server, reload. **Expected:** no Calendar tab in Settings, no header chip, no network request to any Google domain (check the Network panel), clean console. Restore `.env` afterwards.

- [ ] **Step 6: Record what you found**

Update `STATUS.md` bug #4 to say verified, with the date. If the interface turned out to need a per-event delete or a "clear this day" method — `pushDay` is currently the only write entry point, and removal happens only by pushing an empty `blocks` array — **report that as a finding; do not widen `CalendarProvider` in this task.**

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Verify the calendar write path against a real account"
```

---

# PHASE B — Clear the debt

## Task 2: Delete `manualOrder`, and add `actualMinutes` in the same migration

Ruling R2. One Dexie migration serves both this deletion and Task 16's new field, so they ride together.

**Files:**
- Modify: `src/lib/types.ts:69` (`DaySchedule.manualOrder`), and `Task` (add `actualMinutes`)
- Modify: `src/lib/graph/types.ts:131` (`ScheduleOptions.manualOrder`)
- Modify: `src/lib/graph/scheduleDay.ts:138-139` and `applyManualOrder` at `:216`
- Modify: `src/store/store.ts:362` (pass-through in `setDaySchedule`), `:83-110` (`createTask` defaults), `:126-169` (`applyImport`)
- Modify: `src/store/types.ts:74`
- Modify: `src/store/selectors.ts:233, 249`
- Modify: `src/lib/db/schema.ts` (version bump + upgrade)
- Test: delete the `manualOrder` cases in `src/lib/graph/scheduleDay.test.ts` (~lines 411-458), `src/store/store.test.ts` (~409-435), `src/lib/db/schema.test.ts` (~166-167)

**Interfaces:**
- Produces: `Task.actualMinutes: number | null`, consumed by Tasks 16 and 17.

- [ ] **Step 1: Write the failing migration test**

In `src/lib/db/schema.test.ts`, add a test that a `DaySchedule` row written with a legacy `manualOrder` field survives the upgrade with that field gone, and that a `Task` round-trips `actualMinutes`.

- [ ] **Step 2: Run it and watch it fail**

```
npx vitest run src/lib/db/schema.test.ts
```
Expected: FAIL — `actualMinutes` is not on `Task`.

- [ ] **Step 3: Bump the Dexie schema**

Add a new version in `src/lib/db/schema.ts` with an `.upgrade()` that deletes `manualOrder` from every `daySchedules` row and sets `actualMinutes: null` on every task that lacks it. Keep the existing indexes. **Do not change the primary keys.**

- [ ] **Step 4: Remove `manualOrder` everywhere**

Delete the type members, the `applyManualOrder` function and its call site in `scheduleDay`, the store pass-through, and the selector re-export. Delete the covering tests listed above — they test a capability that no longer exists.

- [ ] **Step 5: Add `actualMinutes` to `Task`**

`actualMinutes: number | null`, defaulted to `null` in `createTask` (`store.ts:83-110`) and in `applyImport`'s create branch (`store.ts:126-169`). Do not add UI for it yet.

- [ ] **Step 6: Run the full suite**

```
npx tsc --noEmit && npm run test
```
Expected: clean, and green with ~13 fewer tests than the 361 baseline.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Drop manualOrder; a day is planned by pinning, not by ordering"
```

---

## Task 3: Code-split the graph out of the entry bundle

Fixes **B3**, closes `STATUS.md` bug #7.

**Files:**
- Modify: `src/App.tsx:2` (drop the `ReactFlowProvider` import), `:15` (lazy import), `:93-99` (Suspense)
- Modify: `src/views/GraphView.tsx:59` (wrap)

**Interfaces:**
- Produces: `GraphView` default export now self-provides its React Flow context.

- [ ] **Step 1: Move the provider into the view**

In `GraphView.tsx`, rename the existing default-exported component to a **non-exported** `GraphCanvas`. It cannot wrap itself in place — it calls `useReactFlow()` (`:86`) and `useViewport()` (`:87`) at its top level and needs the provider as an *ancestor*. Add:

```tsx
export default function GraphView() {
  // The provider wraps the canvas only, so its context doesn't outlive the
  // view that needs it — and keeping it in here rather than in App.tsx is
  // what lets the whole of @xyflow/react leave the entry chunk.
  return (
    <ReactFlowProvider>
      <GraphCanvas />
    </ReactFlowProvider>
  );
}
```

Move the explanatory comment currently at `App.tsx:94-95` along with it — it is still true.

- [ ] **Step 2: Lazy-load it in App**

Remove the `@xyflow/react` import from `App.tsx` entirely. Replace the static view import with `const GraphView = lazy(() => import('@/views/GraphView'))`.

Wrap the render site in `Suspense`. **The fallback is not a spinner** — the brief forbids anything that reads as a page load. Use the canvas ground at the right size:

```tsx
{activeView === 'graph' && (
  <Suspense fallback={<div className="h-full min-w-0 flex-1 bg-surface-base" />}>
    <GraphView />
  </Suspense>
)}
```

- [ ] **Step 3: Prefetch on desktop so the fallback never renders**

Add an effect in `App.tsx` that calls `import('@/views/GraphView')` inside `requestIdleCallback` after first paint — **skipped when `useIsPhone()` is true.** Task 13 creates that hook; until then, gate on `window.matchMedia('(max-width: 743px)').matches === false` and leave a comment pointing at Task 13. The phone then genuinely never downloads React Flow unless the user opens the graph.

- [ ] **Step 4: Verify nothing else pulls the library in**

```
grep -rn "@xyflow/react" src/ --include=*.ts --include=*.tsx
```
Expected: hits only in `src/views/GraphView.tsx`, `src/components/graph/*`, and `src/index.css:1`. **Leave `index.css:1` where it is** — it is CSS, it belongs in the main stylesheet, and moving it would trade a bundle win for a flash of unstyled canvas.

- [ ] **Step 5: Measure**

```
npm run build
```
Record the actual entry-chunk size before and after in the task report. Expected: the 500 kB warning is gone. **Report real numbers; do not claim a target.**

- [ ] **Step 6: Look at it**

Open the app, land on Ready, switch to Graph. Confirm the canvas appears with no visible loading state and no console error, and that nodes lay out as before.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Keep the canvas out of the first load"
```

---

## Task 4: Split `DayView.tsx`

At 1138 lines it is the largest file in the repo, and Phases D and E both have to touch it. Pure moves, no behaviour change — the test suite is the proof.

**Files:**
- Create: `src/views/day/WeekGlance.tsx` (from `DayView.tsx:841-940`), `src/views/day/MonthGlance.tsx` (from `:941-1026`)
- Create: `src/components/day/CapacityControl.tsx` (from `:1058-1104`), `src/components/day/CarriedOverStrip.tsx` (from `:1106-end`)
- Modify: `src/views/DayView.tsx`

- [ ] **Step 1: Move, don't rewrite**

Cut each component into its new file with a **named** export (convention: named exports everywhere except views). Add the imports back in `DayView.tsx`. Carry each component's existing comments with it. **Change no logic.**

- [ ] **Step 2: Verify by diff, not by eye**

```
npx tsc --noEmit && npm run test
```
Expected: clean and green with the same test count as after Task 2.

- [ ] **Step 3: Look at the Day view**

Day, week and month horizons all render as before, at 1440×900 in both themes. Console clean.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Break the Day view into files you can hold in your head"
```

---

# PHASE C — Stage 9: Archiving

Ruling R1 governs this phase: archiving semantics do **not** change. `completeTask` continues to set `completedAt` and `archivedAt` together. Nothing under `lib/` gains an `archivedAt` filter.

## Task 5: `collapseCompletedChains` — the pure logic behind the "4 completed" pill

**Strict TDD (R5).** Dispatch `spec-tester` to write the tests from this spec *without reading the implementation*, per the brief's Stage-3 pattern; reconcile afterwards, and where the tests and the implementation disagree, **assume the spec is right until proven otherwise.**

**Files:**
- Create: `src/lib/graph/collapseChains.ts`, `src/lib/graph/collapseChains.test.ts`
- Modify: `src/lib/graph/index.ts` (re-export)

**Interfaces:**
- Consumes: `GraphNodeModel` and `GraphEdgeModel` from `src/store/selectors.ts:98-114`. **Import the types only** — this function must not import from `store/`. Move both interfaces down into `src/lib/graph/types.ts` and re-export them from `selectors.ts` so the dependency direction (`views → components → store → lib`) is preserved.
- Produces:

```ts
export interface CollapsedGroup {
  /** Stable id, derived from the member ids so it survives a re-render. */
  id: string;
  memberIds: TaskId[];
  /** The live node this run of completed work sits behind. */
  headId: TaskId;
}

export interface CollapseResult {
  nodes: GraphNodeModel[];
  edges: GraphEdgeModel[];
  groups: CollapsedGroup[];
}

export function collapseCompletedChains(
  nodes: GraphNodeModel[],
  edges: GraphEdgeModel[],
  expandedGroupIds: ReadonlySet<string>,
): CollapseResult;
```

**Spec, for the tests:**

1. A node with `isArchivedBlocker === false` is never collapsed.
2. A **run** is a maximal chain of two or more adjacent `isArchivedBlocker` nodes where each links only to the next and the run terminates at a non-archived node (the `headId`). A single archived blocker is left alone — a pill saying "1 completed" is worse than the node itself.
3. Collapsing removes the run's nodes from `nodes` and its internal edges from `edges`, and adds one edge from the collapsed group to `headId`.
4. A group whose id is in `expandedGroupIds` is returned **uncollapsed** — its nodes and edges pass through untouched, and it still appears in `groups` so the UI can offer to re-collapse it.
5. **A proxy node (`isProxy === true`) is never absorbed into a run**, even if it is also archived. A cross-project blocker must stay individually visible and clickable.
6. A node with two or more dependents is never absorbed — it is a branch point, and hiding it would hide the fork.
7. The function is pure: it must not mutate the arrays or the node objects it is given.
8. `groups` is stable under re-ordering of the input arrays.

- [ ] **Step 1: Move the shared node/edge types into `lib/graph/types.ts`**

Cut `GraphNodeModel` and `GraphEdgeModel` out of `selectors.ts:98-114` into `src/lib/graph/types.ts`, and re-export them from `selectors.ts` so no import site changes.

- [ ] **Step 2: Dispatch `spec-tester` with the spec above**

Give it the eight rules verbatim and the `CollapseResult` shape. It must not read `collapseChains.ts`. It writes `src/lib/graph/collapseChains.test.ts`.

- [ ] **Step 3: Run the tests and watch them fail**

```
npx vitest run src/lib/graph/collapseChains.test.ts
```
Expected: FAIL — module not found.

- [ ] **Step 4: Implement `collapseCompletedChains`**

Minimal code to pass. Build a dependents count from the edges, walk backward from each non-archived node, and stop a run at a proxy, a branch point, or a live node.

- [ ] **Step 5: Run and watch them pass**

```
npx vitest run src/lib/graph/collapseChains.test.ts && npx tsc --noEmit
```

- [ ] **Step 6: Reconcile**

Where a `spec-tester` assertion disagrees with the implementation, the spec above wins unless you can show the test is wrong. Record any disagreement in the task report.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Collapse a finished chain into one pill, in pure logic first"
```

---

## Task 6: The archive selector

**Strict TDD (R5).** `src/store/selectors.ts` is the one file allowed to filter on `archivedAt`.

**Files:**
- Modify: `src/store/selectors.ts`
- Test: `src/store/selectors.test.ts` (new file)

**Interfaces:**
- Produces:

```ts
export interface ArchiveGroup {
  projectId: ProjectId | null;
  projectName: string;   // 'Inbox' when projectId is null
  accentHue: number | null;
  tasks: Task[];         // newest completedAt first
}

/** Archived work, newest first, grouped by project, filtered by a fuzzy query. */
export function useArchive(query: string): ArchiveGroup[];
```

**Spec, for the tests** (test the pure grouping helper, not the hook — extract `groupArchive(tasks, projects, query)` and export it so it can be tested directly):

1. Only tasks with `archivedAt !== null` appear.
2. Ordered by `completedAt` descending within each group. A task with `archivedAt` but `null` `completedAt` sorts last.
3. Grouped by `projectId`; `null` becomes a group named `Inbox` with `accentHue: null`.
4. Groups are ordered by their newest task's `completedAt`, descending.
5. An empty query returns everything.
6. A non-empty query filters by title using the existing `src/lib/fuzzy.ts` matcher. A group left with no tasks disappears.
7. Tasks belonging to a **deleted** project (a dangling `projectId`) fall into the `Inbox` group rather than vanishing.

- [ ] **Step 1: Write the failing tests**

`src/store/selectors.test.ts`, covering all seven rules against `groupArchive`. Build fixtures as plain objects; no Dexie needed.

- [ ] **Step 2: Run and watch fail**

```
npx vitest run src/store/selectors.test.ts
```
Expected: FAIL — `groupArchive` is not exported.

- [ ] **Step 3: Implement `groupArchive` and the `useArchive` hook**

Put both in `selectors.ts`, under the existing header comment about archiving being a presentation filter. `useArchive` is `useMemo` over `tasks`, `projects` and `query`, exactly like `useProjectList` at `:261`.

- [ ] **Step 4: Run and watch pass**

```
npx vitest run src/store/selectors.test.ts && npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Answer what did I actually finish, in one selector"
```

---

## Task 7: The Archive view

**UI task — R3 mitigation applies.** Copy the list pattern from `src/views/ReadyView.tsx` and reuse `src/components/TaskRow.tsx` unchanged. Do not invent a second task presentation.

**Files:**
- Create: `src/views/ArchiveView.tsx` (default export — views are the one place default exports are allowed)
- Modify: `src/App.tsx:100` (render it), `:113-125` (delete `ComingSoon`)
- Modify: `src/components/Sidebar.tsx:28` (`enabled: true`), `:102` (drop the `soon` badge)

**Interfaces:**
- Consumes: `useArchive(query)` from Task 6; `TaskRow` from `src/components/TaskRow.tsx`; `useUi().select` / `openInspector` from `src/store/ui.ts`.

- [ ] **Step 1: Build the view**

A search field at the top (`Field` from `src/components/Field.tsx`, autofocus **off** — this is a browsing surface, not a capture surface), then one section per `ArchiveGroup`: a `text-footnote font-medium text-label-secondary` project header carrying the project's `accentHue` dot, then its `TaskRow`s.

Clicking a row calls `select(id)` then `openInspector()` — the **same** inspector, which already has unarchive. Do not build a second unarchive control.

- [ ] **Step 2: Write the empty state as an invitation**

Two of them, and they say different things:
- Nothing archived at all: *"Nothing here yet. Finished work lands here automatically — this is where you come to see what a month actually contained."*
- A query with no matches: *"No finished task matches "<query>"."*

Neither apologises.

- [ ] **Step 3: Wire it up**

Render `<ArchiveView />` at `App.tsx:100`. Delete `ComingSoon` entirely. Flip `enabled: true` in `Sidebar.tsx:28` and remove the `soon` badge branch at `:102`.

- [ ] **Step 4: Look at it — four screenshots**

1440×900 and 390×844, light and dark. Zero console errors, zero React warnings. Tab through: search field → each row → inspector, every focus ring visible. Check with an empty archive and with a populated one (`seedDevData()` from `src/lib/devSeed.ts` gives you archived tasks).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Open the Archive: what you finished, newest first"
```

---

## Task 8: The collapsed-chain pill on the canvas

**UI task — R3 mitigation applies.** Copy the node shell from `src/components/graph/ProxyNode.tsx` (82 lines) — it is already the "muted, not-a-real-task" node and its geometry is right.

**Files:**
- Create: `src/components/graph/CollapsedNode.tsx`
- Modify: `src/components/graph/nodeTypes.ts` (register it)
- Modify: `src/views/GraphView.tsx` (apply `collapseCompletedChains` between `useVisibleGraph` and the React Flow node array)
- Modify: `src/store/ui.ts` (add `expandedGroupIds: Set<string>` + `toggleGroup(id)` — transient, **not** persisted)

- [ ] **Step 1: Add the expand state to the UI store**

`expandedGroupIds` and `toggleGroup`, alongside the existing transient state. Not written to `localStorage` — which chain you unfolded is about the current moment.

- [ ] **Step 2: Build `CollapsedNode`**

Renders `{count} completed` at `text-footnote`, muted (`text-label-tertiary`), on `bg-surface-overlay` with `rounded-card` and a hairline border. **Paired signal, not colour alone:** a check icon from `lucide-react`. Clicking calls `toggleGroup(id)`. Keyboard reachable with a visible focus ring.

- [ ] **Step 3: Apply the collapse in `GraphView`**

Call `collapseCompletedChains(nodes, edges, expandedGroupIds)` on the output of `useVisibleGraph`, then feed the result to the layout and to React Flow. The force worker should treat a collapsed group as one node.

- [ ] **Step 4: Look at it — four screenshots**

Load `seedDevData()`, complete a chain of three tasks, confirm they collapse into one pill at the head of the branch, click it, confirm they expand in place and the layout reflows with a spring rather than a jump.

**Then prove the invariant still holds:** the task downstream of the collapsed chain is still `ready`. If it isn't, you have filtered archived tasks upstream of `lib/graph/` and must stop.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Fold a finished branch into a pill you can open"
```

---

## Task 9: Offer to archive a project when its last live task is finished

**Files:**
- Modify: `src/views/ReadyView.tsx:200-220` and `src/views/DayView.tsx:737-755` — the existing "N tasks are now ready" surface
- Modify: `src/store/selectors.ts` (a small helper: does this project have any live tasks left?)

- [ ] **Step 1: Reuse the completion moment, don't build a modal**

`ReadyView.tsx:200` and `DayView.tsx:737` already render a transient "2 tasks are now ready" banner after a completion. Extend that same component to also offer *"That was the last task in <project>. Archive it?"* with one action. `setProjectArchived` already exists at `src/store/store.ts:320` — do not write a new action.

- [ ] **Step 2: Look at it**

Complete the last task in a seeded project at 1440×900, both themes. Confirm the offer appears, that dismissing it leaves the project alone, and that taking it removes the project from the sidebar without deleting any task.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Offer to put a finished project away"
```

---

# PHASE D — The polish pass: real controls

The brief's invariant 6 is the point of this phase. Right now the inspector reads as a stacked HTML form: a raw `<select>` at `Inspector.tsx:360-374`, three native `date`/`datetime-local` fields at `:283`, `:336`, `:345`, a boxed title at `:246`, and a `rows={4}` grey rectangle for notes at `:253`.

**Do this phase before Phase E.** The bottom sheet's 40% detent shows the first ~340px of the inspector, and today that is header + title + most of the notes box — not status, and not "Blocked by". Reworking the form first is what makes the sheet's small detent worth having.

## Task 10: The `Popover` primitive

**There is no Select, Popover, Menu, Dialog, Portal, or Tooltip primitive in this codebase**, and no Radix or Headless UI dependency. The nearest precedent is hand-rolled: `src/components/inspector/TaskTypeAhead.tsx:62-90` uses a `relative` wrapper plus an `absolute z-20` listbox closed by a 120 ms blur timeout. Building three custom controls on that pattern would produce three near-copies, so build the layer once.

**This is one of the two component tasks that gets tests (R5)** — it has real logic: focus management, dismissal, and viewport flipping.

**Files:**
- Create: `src/components/Popover.tsx`, `src/components/Popover.test.tsx` (`// @vitest-environment jsdom` at the top — see `src/views/InboxView.import.test.tsx` for the existing pattern)
- Modify: `src/components/inspector/TaskTypeAhead.tsx` and `src/components/CommandPalette.tsx:185` to sit on it

**Interfaces:**
- Produces:

```ts
export interface PopoverProps {
  open: boolean;
  onClose: () => void;
  /** The element the popover positions against. */
  anchorRef: React.RefObject<HTMLElement>;
  /** Accessible name for the floating region. */
  label: string;
  children: React.ReactNode;
}
export function Popover(props: PopoverProps): JSX.Element | null;
```

**Behaviour spec, for the tests:**
1. Renders into a portal on `document.body`, so it is never clipped by an ancestor's `overflow`.
2. `Esc` closes it.
3. A click outside the popover **and** outside the anchor closes it. A click inside does not.
4. Focus moves into the popover on open and returns to the anchor on close.
5. `Tab` and `Shift+Tab` are trapped inside while open.
6. It flips above the anchor when there is not enough room below, and clamps horizontally to the viewport.
7. `role="dialog"` with `aria-label={label}`.

- [ ] **Step 1: Write the failing tests** for rules 2, 3, 4 and 7 (the ones jsdom can honestly assert). Note in the file that 1 and 6 are verified by screenshot, not by jsdom, because jsdom has no layout.

- [ ] **Step 2: Run and watch fail** — `npx vitest run src/components/Popover.test.tsx`

- [ ] **Step 3: Implement.** Springs from `src/lib/motion.ts` via `transition(springUI)`. Surface is `bg-surface-raised` with `rounded-panel`, `shadow-panel`, `border-hairline border-separator` — **not glass**; the sidebar already spends the one glass surface per view.

- [ ] **Step 4: Run and watch pass.**

- [ ] **Step 5: Migrate the two existing floating layers** onto it, so the app ends with one implementation rather than four. `TaskTypeAhead`'s 120 ms blur timeout goes away.

- [ ] **Step 6: Look at it.** Open the command palette and the type-ahead at both sizes and both themes; confirm no regression and no clipping.

- [ ] **Step 7: Commit** — `git commit -m "One floating layer for the whole app"`

---

## Task 11: The `Select` primitive

**Files:**
- Create: `src/components/Select.tsx`
- Modify: `src/components/inspector/Inspector.tsx:356-375` (project picker), `src/views/InboxView.tsx:137-152` (per-row "File…" picker)

**Interfaces:**
- Consumes: `Popover` from Task 10.
- Produces:

```ts
export interface SelectOption { value: string; label: string; accentHue?: number }
export interface SelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  /** Rendered when value is ''. */
  placeholder?: string;
}
export function Select(props: SelectProps): JSX.Element;
```

- [ ] **Step 1: Build it.** Trigger matches the existing `CONTROL` class string at `src/components/Field.tsx:6-9` so it lines up with every other field. `role="listbox"`, roving arrow keys, `Home`/`End`, type-to-jump, `Enter`/`Space` to open, `Esc` to close. An option with `accentHue` shows the project dot — reuse `src/lib/projectAccent.ts`.
- [ ] **Step 2: Replace both raw `<select>` elements.** After this there are none left in the app — verify with `grep -rn "<select" src/`.
- [ ] **Step 3: Look at it.** Four screenshots. Keyboard-only: open, arrow, select, close. Focus ring visible at every step.
- [ ] **Step 4: Commit** — `git commit -m "Retire the last native select"`

---

## Task 12: The `DateTimeField` primitive, and a date picker for Day

**Files:**
- Create: `src/components/DateTimeField.tsx`
- Modify: `src/lib/time.ts` (adopt `toLocalInput`/`fromLocalInput`, moved out of `Inspector.tsx:23-33`)
- Modify: `src/components/inspector/Inspector.tsx:283-293` (Due), `:336-343` (Pinned to), `:345-354` (Not before)
- Modify: `src/views/DayView.tsx:147-153` (the title becomes the picker's trigger)

**Interfaces:**
- Consumes: `Popover`; `toLocalInput`/`fromLocalInput` from `src/lib/time.ts`; the 12h/24h setting from `settings.hourFormat` (surfaced in `src/components/SettingsSheet.tsx:157-162`).
- Produces:

```ts
export interface DateTimeFieldProps {
  label: string;
  /** ISO string, or null for empty. */
  value: string | null;
  onChange: (iso: string | null) => void;
  /** 'date' hides the time column. */
  precision: 'date' | 'datetime';
  hint?: string;
}
export function DateTimeField(props: DateTimeFieldProps): JSX.Element;
```

- [ ] **Step 1: Move the conversion helpers.** `toLocalInput` and `fromLocalInput` move from `Inspector.tsx:23-33` into `src/lib/time.ts` so the picker and the inspector share exactly one conversion. Existing `src/lib/time.test.ts` gains cases for both.
- [ ] **Step 2: Build the field.** Trigger reads the formatted value (`tnum`) or the placeholder. The popover holds a month grid — 7 columns, `h-hit`-sized cells, arrow keys move by day, `PageUp`/`PageDown` by month — plus, when `precision === 'datetime'`, a scrollable time column at 15-minute steps honouring `hourFormat`. A **Clear** action sets `null`; a date is a thing you must be able to un-say.
- [ ] **Step 3: Replace the three native fields.** Due is `precision: 'date'`; Pinned to and Not before are `'datetime'`. Keep the existing hint copy (`"A fixed clock time. The day packs around it."`). Verify with `grep -rn 'type="date\|type="datetime-local"' src/` — expected: no hits.
- [ ] **Step 4: Give Day a real date picker.** `DayView.tsx:147-153` is currently plain title text; the only way to an arbitrary date is repeated arrow clicks or a week/month cell. Make the title a button opening the same month grid.
- [ ] **Step 5: Look at it.** Four screenshots of the inspector with the picker open, and four of the Day header. Keyboard-only date entry end to end.
- [ ] **Step 6: Commit** — `git commit -m "Pick a date without leaving the app's own chrome"`

---

## Task 13: The inspector's title and notes stop reading as a form

**Files:**
- Modify: `src/components/inspector/Inspector.tsx:246-251` (title), `:253-258` (notes)
- Modify: `src/components/Field.tsx` (`TextAreaField` grows)

- [ ] **Step 1: Inline-editable title.** The title is content, not a form field. Borderless at rest at `text-title3`, showing its input chrome only on hover and focus. Keep the existing autofocus-on-new-task behaviour driven by the `focusTitle` prop (`InspectorHost.tsx:66`).
- [ ] **Step 2: Notes that invite.** Auto-growing textarea from 2 rows, capped at ~12, replacing the fixed `rows={4}` grey rectangle. Placeholder is an invitation, not a label. Keep `user-select: text` on it — `src/index.css:137` already exempts task content from the chrome-wide `user-select: none`.
- [ ] **Step 3: Confirm the derived strip still reads as derived.** `DerivedStrip` at `Inspector.tsx:396-416` must remain visually distinct from the fields above it now that those fields have lost their boxes. If the distinction has weakened, strengthen the strip — this is invariant 6 and it is load-bearing for trust.
- [ ] **Step 4: Look at it.** Four screenshots. Tab through every field in order.
- [ ] **Step 5: Commit** — `git commit -m "Let the title be a title and the notes be notes"`

---

# PHASE E — Stage 10: Phone and PWA

## Task 14: The viewport seam, and the safe-area tokens

**Files:**
- Create: `src/lib/platform/viewport.ts`, `src/lib/platform/viewport.test.ts`
- Modify: `tailwind.config.ts` (the one authorised token addition)

**Interfaces:**
- Produces:

```ts
export const PHONE_QUERY: string;
export function matchesPhone(mql: MediaQueryList): boolean;
export function useIsPhone(): boolean;
/** Height the iOS software keyboard is covering, in px. 0 when closed. */
export function useVisualViewportInset(active: boolean): number;
```

**Design notes the implementer must not re-decide:**
- `useSyncExternalStore(subscribe, () => matchesPhone(mql), () => false)` over `window.matchMedia`. **Not** a `resize` listener (fires per frame during a drag), **not** React context (this codebase has none), **not** Zustand (`store/ui.ts` holds state the *user* chose; viewport width is an environment fact).
- `PHONE_QUERY` needs a **height** term as well as width. A rotated iPhone is 844×390; width alone would put it on the desktop layout, where sidebar (260) + inspector (320) leaves 264px of content. Base the width term on 743px so iPad mini portrait (744) and everything larger stays on desktop — the graph is genuinely usable on an iPad.
- `useIsPhone()` gets **exactly five call sites**, listed in the module's own doc comment: `AppShell`, `InspectorHost`, `GraphView`, `PinnedTasks`, `InstallHint`. A sixth is a conversation; the presumption is that the component should take a prop instead.

- [ ] **Step 1: Write the failing test** for `matchesPhone` with an injected fake `MediaQueryList`. Include a rotated-iPhone case.
- [ ] **Step 2: Run and watch fail.**
- [ ] **Step 3: Implement the module**, including the five-call-site doc comment.
- [ ] **Step 4: Run and watch pass.**
- [ ] **Step 5: Add the four safe-area spacing tokens** to `tailwind.config.ts`:

```ts
'safe-t': 'env(safe-area-inset-top, 0px)',
'safe-b': 'env(safe-area-inset-bottom, 0px)',
'safe-l': 'env(safe-area-inset-left, 0px)',
'safe-r': 'env(safe-area-inset-right, 0px)',
```

Add this comment above them, because the tokens file says a new token is a conversation and this is the argument that was accepted: *these carry no design opinion — they are device geometry from the OS, they evaluate to `0px` where there is no notch, and the 8pt grid is untouched because the inset and the grid padding land on different elements (the outer fixed element takes `pb-safe-b`; an inner element takes `h-14 px-2`).*

- [ ] **Step 6: Commit** — `git commit -m "Know when we are on a phone, in one place"`

---

## Task 15: The phone shell — `AppShell` branch, tab bar, top bar

Implements **D4**. Fixes **B4**.

**Files:**
- Modify: `src/components/AppShell.tsx` (28 lines today — becomes the single layout branch point)
- Create: `src/components/TabBar.tsx`, `src/components/PhoneTopBar.tsx`
- Modify: `src/App.tsx` (pass the new chrome in; **stays breakpoint-unaware**)
- Modify: `src/store/ui.ts:40-43` (`readLastView` coercion)

**Interfaces:**
- Produces:

```ts
export interface TabBarProps {
  activeView: ViewId;
  onSelectView: (view: ViewId) => void;
  inboxCount: number;
  conflictCount: number;
}
export interface PhoneTopBarProps {
  title: string;
  graphActive: boolean;
  onOpenGraph: () => void;
  onOpenSettings: () => void;
}
```

- [ ] **Step 1: Branch `AppShell`.** Desktop stays exactly as it is. Phone becomes `flex h-dvh flex-col` — `{topBar}` / `<main className="min-h-0 flex-1">` / `{tabBar}` / `{inspector}`.

  **`h-dvh`, not `h-screen`.** `100vh` on iOS Safari is the *large* viewport and overflows under the toolbar — which is exactly the state the install hint appears in. Tailwind 3.4 ships `dvh` natively, so this costs no config.

  `{inspector}` keeps its place in the tree; on phone `InspectorHost` renders itself fixed, so its position doesn't matter. This is what lets `App.tsx` stay breakpoint-unaware.

- [ ] **Step 2: Build `TabBar`.** Ready / Day / Inbox. `h-14` rows, matching the existing header height at `Sidebar.tsx:68`. Outer wrapper takes `pb-safe-b`, `border-t-hairline border-separator`, `bg-glass backdrop-blur-xl` and the `chrome` class (which `src/index.css` already wires to `user-select: none` and `-webkit-touch-callout: none`). Glass is legitimate here — the sidebar isn't rendered on phone, so this is the view's one glass surface.

  **Active state is not colour alone:** `accent` colour **plus** `strokeWidth={2.5}` on the icon **plus** `font-medium` on the 11px label. Inactive is `text-label-secondary` at `strokeWidth={2}`.

  `conflictCount` renders as a numeric badge on the **Day** tab — that keeps the brief's "persistent badge, not a dismissible toast" requirement alive on phone, where the sidebar that normally carries it doesn't exist.

  Hoist the icon set from `Sidebar.tsx:23` into a shared module so the two navs cannot drift.

- [ ] **Step 3: Build `PhoneTopBar`.** View title left, two `iconOnly` `Button`s right: Graph (`Network`) and Settings (gear). This is consistent with the brief's "nothing critical in the top corners" — Graph and Settings are precisely the non-critical actions on a phone; capture, complete and navigate are all in thumb reach at the bottom.
- [ ] **Step 4: Fix B4.** `readLastView()` (`ui.ts:40-43`) may restore any `ViewId`. On phone, coerce `'graph'` and `'archive'` to `'ready'` on first render — with three tabs and no sidebar, restoring into either strands the user.
- [ ] **Step 5: Look at it.** Four screenshots. At 390×844 confirm the tab bar sits above the home indicator (emulate the inset), targets measure ≥44px **in the element inspector, not by eye**, and switching tabs is an instant state swap with no flash.
- [ ] **Step 6: Commit** — `git commit -m "Give the phone its own chrome"`

---

## Task 16: The phone padding pass

**Files:**
- Modify: `src/views/ReadyView.tsx:113` (`px-6 py-8`), `src/views/InboxView.tsx:80` (`px-6 py-8`), `src/views/DayView.tsx:108` (`px-10 pb-9 pt-8`)
- Modify: `src/components/PinnedTasks.tsx`
- Modify: `src/views/day/WeekGlance.tsx`, `MonthGlance.tsx`

- [ ] **Step 1: Tighten the gutters at 390px.** All three are far too generous. Stay on the 8pt grid; do not invent a new spacing value.
- [ ] **Step 2: Suppress `PinnedTasks` on phone.** It is a pointer-drag-positioned floating card stack sized at 272px (`PinnedTasks.tsx:76-101`); at 390px it is a near-full-width, undismissable overlay sitting on top of the tab bar. Gate it on `!useIsPhone()`. The pinned state persists and returns on desktop.
- [ ] **Step 3: Check the week and month grids.** `DayView.tsx:852` (now in `WeekGlance.tsx`) carries the only real breakpoint that already existed — `grid-cols-1 sm:grid-cols-7`. Confirm it still reads at 390 and that the month grid does too.
- [ ] **Step 4: Look at it.** Four screenshots of each of Ready, Day, Inbox.
- [ ] **Step 5: Commit** — `git commit -m "Make the small screen breathe correctly"`

---

## Task 17: The read-only graph on phone

Fixes **B1** and **B2**. Both are real bugs, not polish.

**Files:**
- Modify: `src/views/GraphView.tsx` — `:448` (the `<ReactFlow>` props), `:466-467`, `:474` (`<Controls>`), `:481-489` (toolbar), `:395-435` (keyboard effect), `:128-143` (position persist)

- [ ] **Step 1: Fix the pan (B1).** `panOnDrag={isPhone ? true : [1, 2]}` and `selectionOnDrag={!isPhone}`. `[1, 2]` is middle and right mouse button; **a phone has neither, so the canvas is currently un-pannable on touch and "pan, zoom, tap to inspect" fails at the first word.**
- [ ] **Step 2: Stop the writes (B2).** Gate the position-persist effect at `:128-143` on `!isPhone`. It calls `updateTask` per settled node, which goes through `commit('Edit task', …)` and pushes an undo entry each time. A read-only view that writes to IndexedDB is not read-only.

  **Also record in `STATUS.md`:** on desktop, one graph settle can consume a large share of the 50-entry undo stack. Pre-existing, out of scope here, but it should not stay unrecorded.

- [ ] **Step 3: Disable authoring.** `nodesConnectable={!isPhone}` (handles inherit from the flow, so `TaskNode.tsx:74,79` needs no change), `nodesDraggable={!isPhone}`. `elementsSelectable` **stays true** — tap to inspect must work. Hide `<Controls>` on phone: they are styled to 28px in `src/index.css:200`, under the 44px minimum, and pinch plus double-tap covers zoom. Gate the whole keyboard effect at `:395-435` — a paired Bluetooth keyboard could otherwise `Backspace`-delete a task from a read-only view.
- [ ] **Step 4: Say so, honestly.** In the slot the authoring toolbar vacates, a `pointer-events-none` pill at `text-caption text-label-tertiary` on `rounded-control border-hairline border-separator bg-surface-raised/85`:

  > Read-only here — pan, zoom, and tap to inspect. Wiring dependencies happens on the desktop.

- [ ] **Step 5: Look at it.** At 390×844 **with touch emulation on**: confirm pan works (this is the check that catches B1), that nodes will not move, that no edge can be drawn, and that tapping a node opens the inspector. Then confirm in DevTools' Application panel that panning and letting the layout settle wrote **nothing** to IndexedDB.

  **Measure, don't guess:** the force worker still runs on phone and drives a re-render per frame until settle. If that is the worst frame budget in the app on a real device, the fix is to render from `positions` only on `settled` when `isPhone` — but measure first and report the number.

- [ ] **Step 6: Commit** — `git commit -m "Make the phone's graph honestly read-only"`

---

## Task 18: The bottom-sheet inspector

**Files:**
- Create: `src/components/inspector/BottomSheet.tsx`
- Modify: `src/components/inspector/InspectorHost.tsx:57-90` (branch), `src/components/inspector/Inspector.tsx:168, 220` (the `presentation` prop)

**Interfaces:**
- Produces:

```ts
export interface BottomSheetProps {
  open: boolean;
  /** Fractions of viewport height, ascending. This app uses [0.4, 0.92]. */
  detents: number[];
  detentIndex: number;
  onDetentChange: (index: number) => void;
  onDismiss: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}
```

- Modifies `Inspector`'s props with **one optional member**: `presentation?: 'panel' | 'sheet'`, defaulting to `'panel'`.

**This is the plan's one acknowledged deviation from "the same component, unchanged".** Both of `Inspector`'s roots (`:168` multi-select, `:220` single) carry `w-inspector shrink-0 border-l-hairline border-separator`, which is wrong inside a full-width sheet, and there is no way to correct a 320px-fixed, left-bordered `<aside>` from outside. The prop swaps **only the root class expression** — extract the shared root class to a local `const` so both branches use it. Roughly six lines in a 428-line file; every field, every handler, every derived row and the rest of the props contract are untouched. **Report it as a deviation; do not bury it.** The alternatives (a `className` override, or CSS specificity games from the wrapper) are less semantic and more fragile.

- [ ] **Step 1: Build `BottomSheet`.**
  - Fixed height at the largest detent; position expressed as a **`y` transform, never `height`** — animating transform keeps the drag GPU-composited, which is the difference between smooth and janky on an iPhone.
  - **`useDragControls()` with `dragListener={false}`.** This is the critical API choice: drag must start **only** from the grab handle, or the sheet steals every attempt to scroll the form.
  - `dragMomentum={false}` (project it yourself), `dragElastic` asymmetric so pulling above the top detent resists and pulling below the bottom one gives.
  - `onDragEnd` projects `info.offset.y + info.velocity.y * 0.2`, snaps to the nearest detent, and dismisses if the projection falls below the smallest detent by more than about a third of it. **Velocity bias is what makes a flick feel like a flick** rather than a measurement.
  - The inner scroll region gets an explicit height derived from the *visible* height at the current detent, recomputed on detent change (**not** during the drag). Without it the scroller believes it is 92% tall at the 40% detent and the last fields sit permanently below the screen edge.
  - A scrim whose opacity interpolates from 0 at the small detent to ~0.35 at the large one, tap to dismiss. At 40% the user must still be able to see the list they came from.
  - `overscroll-contain` on the scroll region so a flick at the top of the form doesn't chain to the page. Apply this unconditionally — it is correct on desktop too.
  - **Opaque, not glass** (`bg-surface-raised`): the tab bar already spent the view's one glass surface.

- [ ] **Step 2: Reduced motion comes free.** Wrap every transition in the existing `transition()` from `src/lib/motion.ts:37` — it already returns `duration: 0` under the preference. **Do not re-implement the check.** The drag itself stays live under reduce: someone who asked for less motion still expects the sheet to follow their finger. Only the enter, exit and settle are transitions.

- [ ] **Step 3: Handle the iOS keyboard.** Wire `useVisualViewportInset(open)` from Task 14 as a bottom offset. Focusing a field raises the software keyboard, which shrinks the *visual* viewport but not the *layout* viewport — **without this the field you are typing in sits under the keyboard and the sheet is unusable for editing.** Non-optional.

- [ ] **Step 4: Branch `InspectorHost`.** Detent index is local `useState`, reset to 0 when the primary selected task id changes — not in `store/ui.ts`, which holds state shared across the app; a phone-only sheet position is neither shared nor meaningful on desktop. This matches the existing precedent of `showMore` living locally at `Inspector.tsx:110`.

- [ ] **Step 5: Look at it.** At 390×844, both themes: open from a Ready row, drag between detents, flick to dismiss, tap the scrim, focus a text field and confirm it stays visible above the keyboard (emulate, then flag for the on-device pass). Then turn on `prefers-reduced-motion` in DevTools' Rendering panel and confirm it cuts to the final state.

- [ ] **Step 6: Commit** — `git commit -m "The inspector becomes a sheet, and stays the same inspector"`

---

## Task 19: Icons, splash screens, and the document head

Implements **D1**, **D2**, **D5**. Fixes **B5**. Closes `STATUS.md` bug #6.

**Files:**
- Create: `public/icon.svg`, `public/favicon.svg`, `public/favicon.ico`, `public/pwa-192x192.png`, `public/pwa-512x512.png`, `public/pwa-maskable-512x512.png`, `public/apple-touch-icon-180x180.png`, `public/splash/apple-splash-<w>x<h>.png` × 9
- Modify: `index.html`, `src/lib/theme.ts:39`

- [ ] **Step 1: Draw the mark (D5).** Three dots joined by two edges (● → ● → ●) in `accent` #007AFF on the surface ground — literally the product's core data type, and legible at 32px. Author it once as `public/icon.svg`.
- [ ] **Step 2: Render the raster sizes with no new dependency.** Open the SVG at each exact pixel size through the Chrome DevTools MCP that is already connected, screenshot, save into `public/`. The maskable variant puts the mark inside the **80% safe circle**. Commit the PNGs as build inputs — `public/` is already the right home and this stays deterministic.

  Fallback if that proves fiddly: `npx @vite-pwa/assets-generator` as a one-shot, so nothing lands in `package.json`. **Adding a devDependency is the last resort.**

- [ ] **Step 3: The nine splash screens.** `apple-touch-startup-image` matches on exact device width, height, pixel ratio **and** orientation, with **no fallback** — an unlisted device gets the white flash the brief is trying to prevent. Portrait set: 1320×2868, 1290×2796, 1206×2622, 1179×2556, 1242×2688, 1170×2532, 1125×2436, 828×1792, 750×1334. Each is a solid `background_color` with the centred wordmark, so each is a few kB.

  **Light theme only for v1.** iOS 17+ honours `(prefers-color-scheme: dark)` in the media attribute, but that doubles the file count, and a dark-mode user sees a light splash for ~300ms. **Flag it in the report; don't hide it.**

- [ ] **Step 4: The head.** Add to `index.html`:
  - `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">` — **iOS ignores the manifest icon array entirely; this is the tag that becomes the Home Screen icon.**
  - `<meta name="apple-mobile-web-app-capable" content="yes">` and `<meta name="mobile-web-app-capable" content="yes">`
  - `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">` — **D1**
  - `<meta name="apple-mobile-web-app-title" content="Tempus">`
  - `<link rel="icon" href="/favicon.svg" type="image/svg+xml">` plus the `.ico`
  - one `<link rel="apple-touch-startup-image" media="…" href="…">` per splash size
  - **Remove `maximum-scale=1` from the viewport meta at `:9`** — **D2**. It blocks user zoom, iOS 10+ ignores it, Android honours it, and the brief never asks for it.

- [ ] **Step 5: Fix B5.** `src/lib/theme.ts:39` hardcodes `#000000` as the dark `theme-color`; the actual dark ground is `#1A1917` (`src/lib/appearance.ts:56`). `applyAppearance` corrects it afterwards in `main.tsx:11`, so today it is order-dependent and fragile — and it now matters, because the status bar is visible chrome. Two-line fix: read the resolved ground rather than a literal.
- [ ] **Step 6: Look at it.** Reload; confirm the favicon renders and **the `favicon.ico` 404 is gone from the console.**
- [ ] **Step 7: Commit** — `git commit -m "Give Tempus a face, and stop the favicon 404"`

---

## Task 20: Wire up `vite-plugin-pwa`

`vite-plugin-pwa@1.3.0` is already a devDependency and has never been imported. `vite.config.ts` is `plugins: [react()]`.

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: Look up the current API.** Dispatch `docs-researcher` for the exact `VitePWA` options shape at v1.3 before writing the config — this is precisely the kind of API where a confident guess is wrong.
- [ ] **Step 2: Configure it.**
  - `registerType: 'autoUpdate'` — locked by the brief. **Flag the behaviour:** it reloads the page when a new service worker takes control, which can interrupt mid-typing. Safe here because the app persists to IndexedDB on every mutation, but Riz should know.
  - `injectRegister: 'auto'` — the plugin injects registration, so no `virtual:pwa-register` import and no client type reference in `src/env.d.ts`. Fewer moving parts.
  - `workbox.globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,woff2}']` — **`woff2` matters**: the two self-hosted Work Sans files in `public/fonts/` are what `src/index.css:17-37` depends on, and offline typography is part of not feeling like a website.
  - `workbox.navigateFallback: 'index.html'`, `cleanupOutdatedCaches: true`.
  - Check `maximumFileSizeToCacheInBytes` against the largest emitted chunk. The 2 MiB default should be fine after Task 3, but it **silently drops** oversized files rather than erroring — which is the kind of thing you discover offline.
  - `devOptions.enabled: false` — a service worker caching stale modules in dev is a debugging tax.
  - `includeAssets` is unnecessary once `globPatterns` covers the raster types, since `public/` lands at the dist root. One mechanism, not two.
- [ ] **Step 3: The manifest.** `id: '/'`, `name: 'Tempus'`, `short_name: 'Tempus'`, `description` (reuse `index.html:14`), `start_url: '/'`, `scope: '/'`, `display: 'standalone'`, `background_color: '#F2F2F7'`, `theme_color: '#F2F2F7'`, `categories: ['productivity']`, plus the icon array from Task 19.

  **Omit `orientation`** — the graph is genuinely better in landscape and there is no reason to lock it.

  **Known limitation to state, not hide:** manifest colours are static, but `src/lib/appearance.ts:159-182` rewrites the ground tokens and the runtime `theme-color` at will across four dark and three light presets. A user on the "Ink" preset gets an `#F2F2F7` splash background. Unfixable without a runtime manifest.

- [ ] **Step 4: Verify offline.**
  ```
  npm run build && npm run preview
  ```
  In Chrome: Application → Manifest shows no errors and every icon resolves; Application → Service Workers shows it registered; then Network → Offline and a hard reload still serves the shell. Run a Lighthouse PWA audit and record the installability result.
- [ ] **Step 5: Commit** — `git commit -m "Ship the offline shell"`

---

## Task 21: The install hint and the storage warning

Implements **D3**.

**Files:**
- Create: `src/lib/platform/install.ts`, `src/components/InstallHint.tsx`
- Modify: `src/env.d.ts` (Navigator augmentation), `src/App.tsx` (mount), `src/components/SettingsSheet.tsx` (the Data tab line), `src/main.tsx` (D3)

**Interfaces:**
- Produces:

```ts
export function isStandalone(): boolean;
export function isIos(): boolean;
export function shouldShowInstallHint(): boolean;
export function dismissInstallHint(): void;
```

- [ ] **Step 1: Build `platform/install.ts`.** `isStandalone()` checks **both** `matchMedia('(display-mode: standalone)').matches` and `navigator.standalone === true` — the media query is the standard, `navigator.standalone` is the reliable one on iOS. `isIos()` covers iPhone/iPad/iPod plus the iPadOS-13+ case (`/Macintosh/` with `maxTouchPoints > 1`).

  `navigator.standalone` is non-standard and TypeScript does not know it. Under strict with no `any`, add a three-line `Navigator` interface augmentation to `src/env.d.ts`. **Do not cast.**

  Dismissal state goes in `browserPreferences` under `installHintDismissed`, stored as the dismissal **ISO timestamp** rather than a boolean — same cost, reads better in devtools, and leaves the door open to re-offering after a long absence. UI state, so invariant 4 permits localStorage, and it inherits the existing `tempus.` namespace plus the try/catch that makes private-mode Safari a no-op rather than a crash.

- [ ] **Step 2: Show it only when all five hold.** `useIsPhone()`; `!isStandalone()`; `isIos()` (Android has `beforeinstallprompt` and wants different copy — explicitly out of scope, do not build it); not previously dismissed; and the store is hydrated and the app has painted, so the hint doesn't compete with the app appearing.

- [ ] **Step 3: Build the card.** Mounted in `App.tsx` as a sibling of `<PinnedTasks />` (`:105`). Fixed, anchored above the tab bar (`bottom` = tab bar height + `safe-b`), `rounded-panel`, `bg-surface-raised`, `shadow-panel`, spring-in via `transition(springUI)`.

  Copy — an invitation plus the honest constraint:

  > **Add Tempus to your Home Screen**
  > Tap Share, then Add to Home Screen. It opens full screen and works offline.
  > Until then, Safari can clear your tasks after seven days without a visit. Installed apps are exempt.

  Two actions: **"Export a copy"** and **"Not now"**.

  "Export a copy" reuses the existing path exactly — `useUi.getState().setSettingsOpen(true, 'data')` (`ui.ts:143`) lands on the tab where `exportJson` already lives (`SettingsSheet.tsx:70`). **Do not write a second export path.**

- [ ] **Step 4: A permanent line in Settings → Data,** next to the export button, saying which state you are in: *"Installed to the Home Screen — exempt from Safari's 7-day storage clearing"* or *"Running in the browser — Safari can clear this after seven days without a visit."* That is where someone goes when they are worried, and the export button is already sitting there.

- [ ] **Step 5: D3 — request persistent storage.** A `requestPersistentStorage()` in `src/lib/platform/storage.ts`, called once, fire-and-forget, from `src/main.tsx` after `hydrate()`. Safari will not grant it; Chrome and Firefox will, which makes the warning less often true.

- [ ] **Step 6: Look at it.** At 390×844, both themes. Fake `navigator.standalone = true` in the console and confirm the hint stays suppressed. Confirm "Export a copy" opens Settings on the Data tab.
- [ ] **Step 7: Commit** — `git commit -m "Say how to install, and be honest about what happens if you don't"`

---

# PHASE F — Estimate calibration

Ruling R6. **The problem it solves:** `scheduleDay` believes the user's estimates, and nobody's estimates are right. A schedule built on optimistic numbers overflows every day, and a schedule the user doesn't trust is one they ignore — the exact failure the brief names about the Day view.

## Task 22: `calibration()` — the pure function

**Strict TDD (R5).** Dispatch `spec-tester` from this spec without letting it read the implementation.

**Files:**
- Create: `src/lib/graph/calibration.ts`, `src/lib/graph/calibration.test.ts`
- Modify: `src/lib/graph/index.ts`

**Interfaces:**
- Consumes: `Task.actualMinutes` (added in Task 2).
- Produces:

```ts
export interface Calibration {
  /** Median of actual/estimate across recent completions. 1 = on the nose. */
  factor: number;
  sampleCount: number;
  /** True once there is enough evidence to act on. */
  confident: boolean;
}
export function calibration(tasks: Record<TaskId, Task>): Calibration;
```

**Spec, for the tests:**
1. Only tasks with `status === 'done'`, a non-null `estimateMinutes` **greater than zero**, and a non-null `actualMinutes` are sampled. Everything else is ignored — including archived tasks, which are sampled normally (invariant 1: nothing under `lib/` reads `archivedAt`).
2. `factor` is the **median** of `actualMinutes / estimateMinutes`, not the mean. One task that took a whole day must not move the number.
3. At most the 30 most recent samples by `completedAt`, so the number tracks how you estimate *now*.
4. `confident` is `sampleCount >= 8`.
5. With zero samples: `{ factor: 1, sampleCount: 0, confident: false }`. Never `NaN`, never a division by zero.
6. An even sample count averages the two middle values.
7. Pure — no mutation of the input.

- [ ] **Step 1: Dispatch `spec-tester`** with the seven rules verbatim.
- [ ] **Step 2: Run and watch fail.**
- [ ] **Step 3: Implement.** Minimal.
- [ ] **Step 4: Run and watch pass**, then `npx tsc --noEmit`.
- [ ] **Step 5: Commit** — `git commit -m "Work out how wrong the estimates usually are"`

---

## Task 23: `scheduleDay` learns about pace

**Strict TDD (R5).**

**Files:**
- Modify: `src/lib/graph/scheduleDay.ts:45` (signature), `src/lib/graph/types.ts` (`ScheduleOptions`)
- Modify: `src/lib/graph/scheduleDay.test.ts`
- Modify: `src/store/selectors.ts:232-235` (`useDayPlan` passes it through)

**Interfaces:**
- Produces: `ScheduleOptions.paceFactor?: number` — defaults to `1`.

**Spec:**
1. With `paceFactor` absent or `1`, every existing test still passes unchanged. **This is the load-bearing assertion.**
2. With `paceFactor: 1.5`, a task estimated at 60 minutes occupies 90 minutes of the rail.
3. **`estimateMinutes` on the task is never mutated.** The scaling happens inside the scheduler. This is invariant 6 — that number is the user's, and an app that quietly rewrites what you typed loses the trust everything else depends on.
4. Pinned tasks are **not** scaled. A class runs for an hour whether or not you are slow.
5. The no-estimate default of 30 minutes **is** scaled, and stays marked as estimated.
6. Capacity is unchanged; scaling makes fewer tasks fit, and the existing overflow reporting explains what got cut.

- [ ] **Step 1: Write the failing tests** for rules 1–6.
- [ ] **Step 2: Run and watch fail.**
- [ ] **Step 3: Implement**, then thread it through `useDayPlan`, reading the toggle from `settings`.
- [ ] **Step 4: Run the whole suite** — every pre-existing `scheduleDay` test must still pass untouched.
- [ ] **Step 5: Commit** — `git commit -m "Let the day plan at the pace you actually work"`

---

## Task 24: The calibration surfaces

**UI task — R3 mitigation applies.** Copy the chip-row pattern from `src/components/Segmented.tsx`.

**Files:**
- Modify: `src/views/DayView.tsx` (the completed-block chip row, and the capacity line)
- Modify: `src/components/SettingsSheet.tsx` (the toggle, in the Schedule section near `:179-191`)
- Modify: `src/lib/types.ts` (`Settings.usePaceFactor: boolean`, default `false`)

- [ ] **Step 1: Ask only where it is honest to ask.** When a task **with an estimate** is completed **from the Day view** — the surface where the user is working against a clock — the completed row shows a one-tap chip row: `½×  1×  1½×  2×` plus a free entry. Tapping writes `actualMinutes`. **Ignoring it costs nothing and records nothing.**

  Ready and the graph never ask. Completion there stays a single click. No timer, no background tracking.

- [ ] **Step 2: The toggle, hidden until it means something.** In Settings → Schedule: *"Plan using my real pace"*, with the derived sentence beneath it — *"You tend to run 1.3× your estimates (24 tasks)."* **Rendered as derived, in the same visual register as the inspector's `DerivedStrip`** — invariant 6. The whole row is hidden entirely while `confident` is false.

- [ ] **Step 3: Let the day explain itself.** The Day capacity line says which basis it used, so the schedule can always answer "why". This is the same argument as `ScheduledBlock.reason`.

- [ ] **Step 4: Look at it.** Four screenshots: the chip row on a completed block, and the Settings row in both its hidden and shown states. Confirm the derived sentence cannot be mistaken for something the user typed.
- [ ] **Step 5: Commit** — `git commit -m "Learn how long things really take, and offer to plan that way"`

---

# PHASE G — Stage 11 and the final sweep

## Task 25: The shipped seed project

**Files:**
- Create: `src/lib/seed.ts`, `src/lib/seed.test.ts`
- Modify: `src/views/ReadyView.tsx` (offer it from the empty state)

**`src/lib/devSeed.ts` stays exactly as it is.** Its own header says it is not this — it is dev scaffolding that exercises awkward shapes. Do not merge them.

**Spec:**
1. One realistic **14-task** project with genuine branching and at least one converging diamond.
2. **Two completed-and-archived tasks**, so the archive and the collapsed pill both have something to show on first run.
3. **One cross-project dependency**, which needs a second small project — that is what makes the proxy node visible.
4. A mix of estimates, with **at least one task deliberately without one**, so the "no estimate — excluded from critical path" affordance is exercised.
5. Enough deadline pressure that `conflicts` has something to say, and `propagateDeadlines` produces a visible `mustStartBy`.
6. Offered from the Ready view's empty state as an invitation. **Never auto-loaded**, and never over an existing database.

- [ ] **Step 1: Write the failing test.** `seed.test.ts` asserts rules 1–5 against the seed data structurally: task count, that `criticalPath` returns a non-trivial path, that `conflicts` returns at least one, that `readySet` is non-empty, and that exactly one dependency crosses projects.
- [ ] **Step 2: Run and watch fail.**
- [ ] **Step 3: Write the seed.** Make it read like real work, not like `Task A → Task B`.
- [ ] **Step 4: Run and watch pass.**
- [ ] **Step 5: Offer it from the empty state**, guarded on an empty store.
- [ ] **Step 6: Look at it.** Load the seed into a clean database. Confirm the graph is legible without manual arrangement, the illumination interaction works on it, the archive has content, and the conflicts badge shows a real number. Four screenshots.
- [ ] **Step 7: Commit** — `git commit -m "Never open Tempus to an empty room"`

---

## Task 26: The final sweep

**Files:**
- Modify: `STATUS.md` (rewrite), `README.md`

- [ ] **Step 1: Run every gate.**
```
npx tsc --noEmit
npm run test
npm run build
```
All three clean. Record the final test count and bundle size.

- [ ] **Step 2: Walk the brief's *Done means* list, item by item.** Do not tick anything you have not just watched work:
  - All six derived functions unit-tested, including **cycle rejection**, a **diamond**, a **`waiting` task excluded from ready**, a **cross-project dependency**, and **a task that stays ready when its completed dependency is archived**. That last one is the invariant this whole codebase is organised around — run it explicitly.
  - The app fully usable with `VITE_GOOGLE_CLIENT_ID` unset: no Calendar tab, no header chip, no request to Google, clean console.
  - Adding a task and wiring one dependency **without touching the mouse**.
  - Keyboard-only operation of all five views, every focus ring visible.
  - JSON export works from Settings.
  - Zero console errors and zero React warnings in every view.

- [ ] **Step 3: Dispatch a keyboard and console audit.** A general-purpose subagent walks all five views at both sizes and reports every missing focus ring, every unreachable action, and every console warning. Fix what it finds.

- [ ] **Step 4: Rewrite `STATUS.md`** to describe a finished product. Close bugs #3, #6 and #7. Record #4 as verified with its date. **State plainly what is still unverified** — the on-device items below — rather than dropping them. Add the desktop undo-stack observation from Task 17.

- [ ] **Step 5: Write the on-device checklist for Riz** into `STATUS.md`. These cannot be settled in an emulator and the brief says so:
  - It actually installs from the Share sheet, with the right name and the 180×180 icon rather than a page screenshot
  - **`black-translucent` legibility in light mode (D1)** — the item most likely to force a deviation
  - The splash images actually match — a wrong media query is invisible in emulation and shows as a white flash on device
  - Real `env(safe-area-inset-*)` values: nothing under the home indicator, tab bar thumb-reachable
  - `navigator.standalone === true` after install, and the hint staying suppressed
  - **`backdrop-filter` frame rate** on the tab bar and sheet while a list scrolls — the brief pre-authorises falling back to opaque, and only a device can settle it
  - `100dvh` in Safari-tab mode versus standalone, with the URL bar collapsing
  - Safari's IndexedDB behaving at all — the `file.text()`-versus-`FileReader` lesson from the Canvas importer suggests it will find something
  - **The Inbox keyboard.** iOS raises the software keyboard only for a `.focus()` inside the user-gesture call stack; `InboxView.tsx:43-52` focuses inside a `requestAnimationFrame` plus a 120 ms `setTimeout`, well outside it. **Expect this to fail and need a second approach** — first try a synchronous `useLayoutEffect`, then an always-mounted hidden input focused directly in the tab's `onClick`.
  - Momentum scrolling and rubber-band actually killed; pinch-zoom working on the canvas

- [ ] **Step 6: Update `README.md`** with the Archive view, the phone build, installing to the Home Screen, and resetting local state.

- [ ] **Step 7: Commit** — `git commit -m "Tell the truth about what is finished"`

- [ ] **Step 8: Final whole-branch review.** Per `superpowers:subagent-driven-development`, dispatch the final code reviewer on the most capable model over `git merge-base` → `HEAD`, pointed at the ledger's deferred-minor and parked lines. One fix wave, one scoped re-review, then adjudicate residuals.

---

## Self-review of this plan

**Spec coverage.** Walked `build-prompt.md` section by section. Stages 9, 10 and 11 are covered by Phases C, E and G. The polish pass is Phase D. The calendar gate is Task 1. Two brief requirements are **deliberately not built**, both with recorded rulings: the dependent-aware auto-archive sweep (R1) and the Day view's manual-order plus "Regenerate" affordance (R2). One brief instruction is explicitly overridden by the user: sole authorship of UI code (R3). The elkjs requirement was already deviated from before this plan and is left alone.

**Placeholder scan.** No "TBD", no "add appropriate error handling", no "similar to Task N". Every task names exact files and line numbers. The five open design questions are D1–D5, each with a default to execute so no task stalls.

**Type consistency.** `Task.actualMinutes` is produced in Task 2 and consumed in Tasks 22 and 24. `GraphNodeModel`/`GraphEdgeModel` move to `lib/graph/types.ts` in Task 5 and are consumed in Task 8. `useIsPhone` is produced in Task 14 and consumed in Tasks 15, 16, 17, 18 and 21 — with a forward reference noted in Task 3, which runs first and must gate on a raw `matchMedia` call with a comment pointing at Task 14. `Popover` is produced in Task 10 and consumed in Tasks 11 and 12. `paceFactor` is produced in Task 23 and consumed in Task 24.

**One ordering constraint worth restating:** Phase D before Phase E. The bottom sheet's 40% detent is only worth having once the inspector's form has been reworked.

---

## Features proposed but NOT built

Written up so one can be pulled in later. None conflicts with the brief's out-of-scope list (no voice, no LLM, no sync, no accounts, no recurring tasks, no native wrapper).

**1. "Will I make it?" — a per-project forecast.** One derived sentence: given remaining estimates, working days and capacity, the projected finish date against the real deadline. `conflicts` already answers *"is this structurally impossible?"*; this answers the softer and more useful *"am I going to make it?"*. It is a forward pass over `propagateDeadlines` plus `workingTime.addWorkingMinutes` — both already exist and are tested. Roughly a day, mostly design. **This is the one I'd pick next**, and it gets better once calibration is feeding it a real pace.

**2. Waiting-on staleness.** A `waiting` task records when you last chased it; the Ready view's "Waiting on someone" strip sorts by how long it has been stuck and says *"waiting 9 days"*. The brief argues the thing you most need to see is what to chase — today the strip shows *what*, but not *how badly*. One nullable field, one sort, one line of copy. Half a day.

**3. Subgraph templates.** Select a set of tasks, save the shape, stamp it out with fresh ids. The brief cut it from v1 but explicitly asked that the store be designed for it — and it is: `createTask` already filters `dependsOn` to existing ids, so cloning is an id remap over a task subset. The v2 feature the brief itself names. Two days, mostly UI.

**4. Chain capture.** Press `C` in the graph, type titles separated by Enter, each becomes a task auto-wired to the previous. The brief sets the bar at *"adding a task and its dependency should take one continuous keyboard gesture"* — this is that bar for a whole chain, and it makes the graph cheap enough to keep current, which the brief says the product dies without. Half a day.

**5. A plain-text outline importer.** Indentation means dependency. The Canvas importer already proved the seam (`readCanvasIcs` → `planImport`); this is a second front end onto `planImport`. It is how you would get an existing plan out of a notes app and into the graph in one paste. Half a day.
