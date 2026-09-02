# Tempus — architecture as built

Written 25 August 2026, for the person who runs this project. It describes the
app that exists today, not the app the brief described. Where the two disagree,
the disagreement is the point of the section.

---

## 1. What this is, and what it was supposed to be

Tempus is a task planner whose primary interface is a dependency graph rather
than a list or a calendar. The only thing a user enters by hand is *"I can't do
X until Y is done"*, plus estimates and hard deadlines; everything else — what
is actionable right now, what the real must-start-by dates are, what today's
plan should look like, where the plan collides with itself — is computed from
that graph by the pure functions in `src/lib/graph/`. The product is those
functions. The rest of the codebase exists to feed them and to render what they
return.

The founding creed, stated in `CLAUDE.md` and still literally true of the core:
**local-first, no server, no accounts, a static PWA, all task data in IndexedDB
on the device.** Derived truth is never stored, never entered, and never
presented as user input. That creed is intact where the data model is
concerned. It is no longer an accurate description of the app as a whole,
because four optional integrations have grown up around the core — Google
Calendar (read and write), a Drive-backed settings profile, an AI assistant with
a local and a cloud provider, and browser speech in both directions. Each is
individually well-sealed. Collectively they mean the app now has state in seven
places, only one of which is the device's IndexedDB, and no coherent story about
how those places reconcile. That is the in-between state, and section 3 is where
it lives.

---

## 2. The layer map as built

The dependency direction is one-way — `views → components → store → lib` — and
`lib/graph/` sits at the bottom knowing nothing about anything above it.

```
  views/                 GraphView · ReadyView · DayView · InboxView · ArchiveView
    │                    own the store subscriptions; hooks like useCalendarSync
    ▼                    live here (src/views/useCalendarSync.ts)
  components/            presentational, take data as props
    │
    ▼
  store/                 zustand + immer. THE single write funnel:
    │                      commit()  → apply + undo entry + persist  (src/store/commit.ts)
    │                      write()   → apply + persist, NO undo entry
    │                    diffSnapshots() turns before/after into one `Change`
    │                    Peripheral stores, deliberately outside the undo stack:
    │                      store/calendar.ts   connection, selections, profile sync
    │                      store/assistant.ts  conversation, voice, provider choice
    │                      store/ui.ts         last view, pinned tasks
    ▼
  lib/
    graph/               PURE. readySet · blockingPath · criticalPath ·
                         propagateDeadlines · scheduleDay · conflicts
                         (+ carriedOver, calibration, collapseChains, cycles,
                         topology, workingTime — see lib/graph/index.ts)
    db/                  Dexie schema v1→v3 + the Persistence interface
    platform/            preferences · focus · install · storage · viewport · speech
    calendar/            CalendarProvider iface + google impl + no-op
    assistant/           AssistantProvider iface + ollama + gemini + no-op
    import/              Canvas .ics → CanvasAssignment → ImportPlan
    profile/             the Drive settings-profile shape

           ┌──────────────── the three optional seams ────────────────┐
           │  CalendarProvider   Google Calendar r/w + Drive appData   │
           │  AssistantProvider  Ollama (localhost) | Gemini (cloud)   │
           │  Web Speech         recognition in, synthesis out         │
           └──────────────────────────────────────────────────────────┘
```

**The write model is the strongest thing in the codebase.** Every mutation goes
through one of two functions in `src/store/commit.ts`. `commit(label, recipe)`
applies the recipe, diffs the before/after snapshots, pushes an undo entry only
if something actually changed, and fires a persistence write that cannot block
the interaction. `write(recipe)` does the same minus the undo entry, for state
the user did not author — its one caller is `persistNodePositions`, because
where a force simulation came to rest is not something Cmd-Z should walk back.
Undo entries hold whole snapshots, capped at `UNDO_LIMIT`. Persistence receives
a `Change` — a puts/deletes delta per table — applied inside one Dexie
transaction (`src/lib/db/persistence.ts`), so a multi-table mutation like
"delete a task and scrub its id from every dependent" can never land half-done.

The `Change` shape is explicitly noted in that file as "the seam a future
multi-device sync layer would attach to." Nothing uses it that way yet.

**The graph rule** is enforced by construction rather than by convention:
`loadAll()` reads every table with `toArray()` and never an indexed query,
because Dexie omits records whose indexed key is null and a task missing from
the set handed to `readySet` makes everything downstream of it permanently and
silently unresolvable. Archived tasks stay in the set. Filtering happens in
view-layer selectors only.

**The three seams all follow the same shape**: an interface, a real
implementation, a no-op implementation that is the default, and UI that is
*absent* rather than disabled when the real one isn't available. Calendar keys
off `VITE_GOOGLE_CLIENT_ID`; the assistant keys off the stored provider choice
and, for cloud, a stored API key, with provider modules behind dynamic imports
so the entry chunk never carries either (`src/lib/assistant/index.ts`); speech
keys off the presence of `SpeechRecognition` / `speechSynthesis`
(`src/lib/platform/speech.ts`).

---

## 3. Data topology today

This is the part that is genuinely in-between. Seven places hold state, with
different authority, different lifetimes, and no reconciliation between them.

**IndexedDB (`tempus`, via Dexie).** Tasks, projects, daySchedules, settings.
Schema v3, upgrades in `src/lib/db/schema.ts`. This is the only authoritative
store for user work, and it is scoped to the browser **origin** — not the
device, not the account. Nothing else has a copy.

**localStorage, `tempus.` prefix, via `browserPreferences`
(`src/lib/platform/preferences.ts`).** Everything that is not task data and not
undoable: `theme`, `appearance` (the whole custom-token blob), `lastView`,
`pinnedTasks`, `assistant.voice`, `assistant.ttsVoice`, `assistant.ambient`,
`assistant.provider`, `assistant.localModel`, `assistant.apiKey`,
`calendar.selected`, `calendar.taskSources`, `calendar.push`, `profile.sync`,
`profile.lastApplied`, `gcal.appCalendarId`, `gcal.projectCalendars`, plus the
install-hint dismissal. Two of these are load-bearing beyond preference:
`gcal.appCalendarId` and `gcal.projectCalendars` are the *only* record of which
Google calendars this app created, and losing them means a later push mints
duplicates and `disconnect({ deleteCreated: true })` cleans up nothing.

**sessionStorage.** The Google OAuth access token only
(`src/lib/calendar/googleProvider.ts`, `tempus.gcal.token`). Deliberately not
localStorage — a token that outlives the tab is a token on disk for no reason —
which is why reconnect is one click per browser session.

**Google Drive appData.** One JSON file, `tempus-profile.json`, holding
`Settings` plus an allowlist of nine preference keys
(`src/lib/profile/profile.ts`). Never tasks, never the API key, never the
hot-mic toggle. Conflict resolution is last-write-wins on `updatedAt`, with
`profile.lastApplied` as the loop-breaker so two devices converge rather than
ping-pong. Sync is piggybacked on the calendar's own refresh cadence — no
timers of its own (`src/store/calendar.ts`, `syncProfileNow` and the tail of
`ensureRange`).

**Google Calendar.** Two directions. *Out:* the day's plan, pushed as events
stamped `extendedProperties.private.tempusApp`, onto calendars this app created
and named — a base `Tempus` calendar plus one `Tempus · <project>` per project.
Debounced 2.5s, skipped when the day's block signature is unchanged
(`src/views/useCalendarSync.ts`). *In:* selected calendars are read as busy
time; calendars ticked as "task sources" are read instead as Canvas
assignments and run through the same import planner as the `.ics` file, sharing
its `uid` dedupe. The app's own stamped events are filtered out of the busy read,
or the plan would eat its own day.

**Ollama on localhost.** `http://localhost:11434/api/chat`, model `qwen2.5:7b`
by default, `keep_alive: '30m'` (`src/lib/assistant/ollamaProvider.ts`). This is
the primary assistant mode. It holds no Tempus state, but it *is* a dependency
of the default configuration that exists outside the browser entirely, on one
specific machine.

**The origin-fragmentation reality.** IndexedDB and localStorage are keyed by
origin. `npm run dev` serves on `localhost:5173` with `strictPort`; `npm run
preview` — which is how the built PWA and its service worker actually get
exercised — serves on `localhost:4173`. Those are two different origins, so they
hold **two entirely separate databases and two separate preference sets**. This
is not a theoretical concern: the live data was moved between them once, by
hand, because there is no in-app path to do it. Any future move — a different
port, a LAN IP so the phone can reach it, a real hostname — starts a fresh empty
database and leaves the old one stranded but intact.

So: **settings follow the account, tasks follow the origin.** That is the
sentence that describes the current architecture most honestly, and it is not a
sentence anyone designed.

---

## 4. Flaws

Grouped by how much they would hurt if left alone. Everything here is derived
from the code, not from a general list of things that can go wrong.

### 4.1 Severe — data can be lost or silently diverge

**Export is a one-way door.** `SettingsSheet.tsx:183` writes a JSON file with
`version`, `exportedAt`, and all four tables. Nothing reads that file back.
There is no import action, no store action for it, no parser. Combined with
origin fragmentation, this means the only supported way to move data between
origins or devices is manual IndexedDB surgery, and the only supported use of
an export is as an archive nobody can open. *Why it's a flaw:* the export exists
precisely because "everything is on this device and nowhere else" — a backup you
cannot restore is not a backup. *Remedy:* an `importSnapshot` store action that
validates the payload's shape, runs the same cycle and dangling-id guards as
`applyImport`, and offers merge-by-id vs replace. It is a day's work and it
closes the worst hole in the system.

**Tasks don't sync while settings do.** `syncProfileNow` converges theme,
appearance, provider choice and calendar selections across every device signed
into the same Google account. Tasks stay per-device by explicit decision
(`src/lib/profile/profile.ts` says so). *Why it's a flaw:* the two halves teach
opposite lessons. A phone that shows the desktop's theme and the desktop's
calendar tick-list looks like a synced app, so its stale task list reads as
correct rather than as a fork. Nothing in the UI says "these tasks are only on
this browser." *Remedy:* short-term, say it out loud — a per-device line in
Settings → Data naming the origin and the last local write. Long-term, this is
fork #1 in section 5.

**The Google Calendar rewrite path is destructive and has never been observed.**
`pushDay` (`googleProvider.ts:453`) resolves destinations, then for **every**
calendar in `readGroupMap()` plus the base calendar, lists this app's stamped
events in the day window and deletes them all, then inserts the new set. With N
projects that is N+1 list calls and N+1 delete batches per push, per day. The
safety property — that only events carrying `tempusApp` are deleted, so a
hand-made event on the same calendar survives — is enforced by a query
parameter (`privateExtendedProperty=tempusApp=1`) and has never been tested
against a real decoy event; STATUS.md records this as attested by you, not
observed, because Google refuses OAuth under browser automation. *Why it's a
flaw:* it is the only code path in the app that destroys data in a system Tempus
does not own, and it is the least-verified path in the codebase. *Remedy:* one
manual run with a hand-made decoy event on a `Tempus ·` calendar, recorded. Then,
separately, replace the fanout with a diff keyed on `tempusTaskId` so a push
costs one list and a handful of writes instead of a full rewrite.

**The assistant's `patch` is typed but not validated.** `ProposalOp`'s
`update_task` variant declares `patch` as six optional known fields
(`src/lib/assistant/types.ts:41`). At runtime, `isProposalOp` checks only that
`patch` is a non-null object (`opShape.ts:20`), `validateOps` checks only that
three of its date fields parse (`proposals.ts:58`), and `applyOpsToSnapshot`
then does `Object.assign(task, op.patch)` (`applyOps.ts:63`). A model that
emits `patch: { dependsOn: [...] }` writes an edge with **no cycle check** —
directly against invariant 2, which says there is no code path that writes an
edge without one. `patch: { id: ... }` or `patch: { archivedAt: ... }` are
equally unguarded. *Why it's a flaw:* the compile-time type is doing security
work on data that comes from outside the process, which types cannot do.
*Remedy:* pick the six keys explicitly in `validateOps` and drop the rest with a
reason, the same way every other op is handled.

### 4.2 Structural — the code fights back when you change it

**`store/calendar.ts` imports the task store.** Line 15. The calendar store —
a peripheral, deliberately outside the undo stack because "an access token is
not user data" — calls `useStore.getState().updateSettings()`,
`.applyImport()`, and reads `.tasks` and `.settings`. So the module that owns
OAuth also owns Canvas import orchestration and settings-profile application.
*Why it's a flaw:* it inverts the intended dependency (peripheral → core) and
makes the auto-import path untestable without booting both stores. The
concrete symptom is inside `syncProfileNow`: when an applied profile changed a
*preference* rather than a setting, it calls `window.location.reload()`
(`calendar.ts:264`), because half the stores read preferences once at boot and
there is no mechanism to re-read them. A full page reload as a state-propagation
primitive is the code telling you the seam is in the wrong place. *Remedy:* move
the auto-import orchestration into a view-level hook next to `useCalendarWindow`,
and give the preference-reading stores a subscribe path so the reload can go.

**Module-level mutable state in the peripheral stores.** `store/assistant.ts`
holds `provider`, `playback`, `wakeSession`, `sampleCache` and `wakeArmed` as
module-scope `let`s (lines 116–131); `store/calendar.ts` holds
`lastPushedContent` (line 43). *Why it's a flaw:* none of it can be reset
between tests, none of it appears in any store's state so nothing can react to
it, and it survives an HMR module swap in ways that already cost real debugging
time — the wake-word failure recorded in STATUS.md was ultimately explained by a
stale listener surviving hot reload. *Remedy:* fold the resettable pieces into
the zustand state and expose a `__reset()` for tests; keep only genuinely
process-global handles (the AudioContext) outside.

**Invariant 5 has no enforcement and fifteen violations.** `platform/preferences`
states the rule and provides an interface, but `focus`, `install`, `storage`,
`viewport` and `speech` export concrete browser implementations that components
and stores import directly — fifteen files across `components/`, `views/`,
`store/`, `App.tsx` and `main.tsx`. `speech.ts` documents its own violation in
its header comment. Separately, six modules in `lib/` import upward
(`seed.ts`, `devSeed.ts`, `useGlobalShortcuts.ts`, `navItems.ts`, plus test
files). *Why it's a flaw:* the invariant's stated purpose is that a native
shell would be a new adapter rather than a rewrite, and at fifteen call sites
that is no longer true. *Remedy:* either enforce it with a lint rule and pay
down the sites, or amend the invariant to say what it actually covers
(`preferences` and `calendar`) and stop claiming the rest.

### 4.3 Operational — things that mislead you rather than break

**Service-worker staleness.** The PWA registers with `registerType: 'autoUpdate'`
(`vite.config.ts:17`). A rebuild does not immediately mean a reloaded page is
running new code, and this has repeatedly been mistaken for "the fix didn't
land." The build stamp surfaced in Settings → Data (`__BUILD_STAMP__`, stamped
at config-evaluation time) is the mitigation, not the cure — it tells you *that*
you are on old code, after you have already been confused by it. *Remedy:* an
explicit "update available, reload" prompt from the SW registration, which
`vite-plugin-pwa` supports directly.

**Canvas-via-Google freshness is bounded by Google, not by Tempus.** Ticking a
subscribed Canvas ICS feed as a task source means Tempus's five-minute poll is
reading a Google cache that Google refreshes on roughly a daily cadence. A new
assignment can be up to a day late through no fault of the app. *Why it's a
flaw:* the app polls often enough to look live. *Remedy:* nothing technical —
label the task-source rows in Settings with the real expectation.

**Wake-word audio goes to Google.** `SpeechRecognition` in Chrome streams
microphone audio to the vendor's speech service; hands-free mode keeps a
continuous, self-restarting recognition loop open indefinitely
(`speech.ts:123`). This is the sharpest asterisk on "local-first, nothing leaves
the machine" — sharper than the cloud assistant, because that one is opt-in per
message and this one is ambient. The hot-mic disclosure is in the settings copy
and `assistant.ambient` is deliberately excluded from the synced profile, both
of which are right. *Remedy:* none available in a browser; this is fork #2.

**TTS has a tiny daily free quota.** The Gemini TTS preview model's daily budget
was exhausted in one afternoon of voice auditioning. When it is gone, spoken
replies silently drop to the browser's built-in voice for the rest of the day,
by design. Two of ten voice samples ship as static WAVs; the other eight need
`scripts/gen-voice-samples.mjs` run against a fresh quota.

**OAuth is in testing mode.** Consent expires weekly and the app is capped at
100 test users. *Why it's a flaw:* every seven days the calendar and profile
sync stop working with an auth error that looks like a bug. *Remedy:* verify the
OAuth consent screen, or accept it and document the weekly re-consent.

**The API key sits in localStorage.** `tempus.assistant.apiKey`, readable by any
script that runs on the origin. The page is the entire security boundary. It is
correctly excluded from the JSON export and from the Drive profile. *Why it's a
flaw:* an XSS on this origin is key theft. *Why it is nonetheless tolerable
today:* the key is a free-tier AI Studio key with no billing attached, the app
loads no third-party script except Google's own GIS loader, and there is nowhere
better to put it without a server. Worth knowing, not worth solving now.

**The demo flag only marks future seeds.** `Project.demo` is set by
`loadSeedData` (`seed.ts:317`) and read in exactly two places: Settings'
"Remove example project" and the Google push, which drops demo tasks so a
fictional wine bar never lands on a real calendar (`useCalendarSync.ts:101`).
There is deliberately no migration that back-marks older rows
(`types.ts:60-76`), on the reasoning that by then the user has edited the data
and it is theirs. *The live consequence for you specifically:* your working
database descends from a seed loaded before the flag existed, so the example
project is unflagged — "Remove example project" will not offer to remove it, and
the push guard will not exclude it. The reasoning is sound; the effect is that
the two features exist and neither applies to the only real database.

---

## 5. What to respect, what to pay down, and the two forks

**Load-bearing decisions worth defending.** Per-device task data is not an
accident of an unfinished sync feature; it is what makes the app work with no
server, no account system, and no privacy story to explain. The pure derived
core is the product and its purity is why it can be trusted. The single write
funnel in `commit.ts` is what makes "every mutation goes through a store action"
enforceable rather than aspirational. The absent-not-disabled rule for every
optional seam is why the app has no dead buttons. None of these should be traded
away to fix anything in section 4.

**Debt worth paying down soon,** in the order I would take it: (1) JSON import,
because it converts the worst failure mode from unrecoverable to inconvenient;
(2) the `patch` allowlist, because it is twenty lines and it closes a real hole
in invariant 2; (3) the decoy-event verification run, because an unverified
destructive path against a third-party system is not a risk that ages well; (4)
untangling `store/calendar.ts` from `useStore`, which also retires the
`location.reload()` hack; (5) the module-level state, which is what makes (4)
hard to test once you start.

**Fork one — what "sync" actually means here.** Half-online is the current
state, and it is unstable in both directions. Finishing it properly means either
a real merge engine over the `Change` shape that `persistence.ts` already calls
out as the wire format — per-record last-write-wins with tombstones, riding on
Drive appData exactly as the profile does, no server needed — or admitting that
tasks are single-device and building a good explicit import/export handoff
instead. The first is genuinely hard (deletes, edge scrubbing, and the archived-
task invariant all interact badly with LWW). The second is a week and keeps the
creed intact. What is not viable is staying here, where settings converge and
tasks silently fork.

**Fork two — the browser as a ceiling.** Three of the sharpest constraints in
section 4 are browser constraints, not design choices: microphone audio must go
through a vendor's speech service, a served HTTPS origin fighting Chrome's
private-network rules is why local-primary Ollama really wants the app served
locally, and origin-scoped storage is why moving the app moves the data. A Tauri
shell would resolve all three — local speech, no CORS or private-network
negotiation, and a real file on disk instead of an origin-scoped database — at
the cost of no longer being a static PWA you can open on a phone. That is a
product decision, not an engineering one, and it should not be made to fix a
bug.
