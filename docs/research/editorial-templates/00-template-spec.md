# Journal templates: final spec

Synthesised 2026-09-09 from the eight site notes in this folder (AD feature, photo essay, guide and interview; The Modern House; Cereal; Dwell; Kinfolk; Sight Unseen; Elle Decor). Screenshots live in `.firecrawl/shots/` (gitignored). This file is the source of truth for implementation; the per-site notes are evidence.

## What the research settled

| Question | Evidence | Ruling |
|---|---|---|
| Hero | Every site keeps type off the photo. AD stacks plate then centred title; TMH stacks headline then full-bleed plate; Kinfolk and Elle Decor set a portrait beside the headline for interviews. | Keep the shipped header-then-plate opener for Feature, Essay and Guide. Interview gets a portrait plate beside the title stack. Note keeps a plate but at page level beside the text (Kinfolk note). The essay lead runs at its natural ratio: portrait leads fit to 86vh height like the feature; landscape leads run natural and unclamped. |
| Drop cap | None at AD, TMH, Cereal, Dwell, Kinfolk, Sight Unseen; only Elle Decor. | Drop cap stays on Feature only (it is part of the approved home page feature block). Off for every other layout. |
| Measure | AD and TMH run 105 to 115 cpl and read long; Dwell's 70 to 75 cpl is the most comfortable. | Keep 64ch for all layouts; Note narrows to 52ch. |
| Image rhythm | A plate every two to three paragraphs, alternating column, wide and full-bleed; the 2-up pair is the strongest device (TMH, AD). 3-up rows read too small (Sight Unseen). | Gallery block: 1 to 3 plates across, shared crop, optional group caption. Max is 3, not 4. |
| Image beside text in the body | No site does it inside the body; text is always its own band. | **No `splitBlock`.** The plate-beside-text idea lives at page level in the Note and Interview layouts instead. |
| Captions | Small, under the plate, left-aligned; credit after a gap. TMH and Cereal run uncaptioned sets with a single credit block. | House rule wins: every plate keeps its caption line. Galleries may use one group caption for the row when per-plate captions are empty. |
| Plate numbering | Cereal numbers every plate ("180-05"). Story grids on this site already number plates in brass. | Photo essay plates carry a brass numeral counter ("01", "02") set above the caption, via CSS counters, no editor input. |
| Pull quotes | No site uses them in features, essays, interviews or guides. | Keep the existing pull-quote block as optional; templates for Interview and Guide do not include one by default. |
| Speaker marking | AD: full names on the first exchange, initials after, interviewer italic. Elle Decor: same with bold. Sight Unseen and AD PRO: bold question, no names. Kinfolk: full names every time. | First exchange shows tiny tracked-caps speaker labels ("Styling OC" over the question, the interviewee's first name over the answer). Every exchange sets the question in Zodiak italic and the answer in roman body, so later exchanges need no labels. |
| Interview sign-off | AD and Elle Decor close with an italic "This conversation has been edited and condensed" line. | `signoff` string field on the post, shown only for interviews, default text pre-filled, rendered as an italic closing line. |
| Guide numbering | AD and Dwell do not number; both researchers recommend adding a small "01" label so the piece reads as a guide. | Brass `.numeral` (26px, `--accent`) on its own line above each h2 in the Guide layout, via CSS counters. Subheadings (h3) stay un-numbered. Lists are allowed but not part of the skeleton. |
| Note template | Nobody has one; a note is the feature template with fewer paragraphs and a department label. Kinfolk uses a smaller centred headline and a plate-left, text-right body. | Note layout: `display-m` title, eyebrow "Note", lead plate in the left four columns beside a 52ch body on the right, no drop cap. |
| Eyebrow wording | Sight Unseen and Kinfolk signal the kind with a tiny caps department label. | Prefix the existing kicker: Essay "Photo essay", Interview "In conversation", Note "Note", Guide "Guide". Feature has no prefix. |
| Credits block | TMH "Words / Photography" stack under the hero. | Not adopted; the byline line already carries the photo credit. |

## Sanity model

- `post.layout`: `feature | essay | interview | note | guide`, radio, default `feature`, not required (existing documents without it render as Feature and must not show a validation error), first field in the Story group.
- `post.interviewee`: string, hidden unless `layout === 'interview'`.
- `post.signoff`: string, hidden unless `layout === 'interview'`, initial value "This conversation has been edited and condensed."
- Body block style `h3` "Subheading" added.
- New object `gallery`: `items` (1 to 3 `picture`), `ratio` (shared crop, default `4:5`), `caption` (group caption, optional).
- New object `qaPair`: `question` (text, required), `answer` (`paragraphs`: normal blocks with strong, em, link; no lists or headings).
- New array type `paragraphs` shared by `qaPair.answer` (kept as a named type so future blocks can reuse it).
- Studio "Create new" offers five "Journal post: ..." templates and hides the plain "Journal post".

## Layouts

```
FEATURE (shipped design, refined)          PHOTO ESSAY
+----------------------------------+       +----------------------------------+
| EYEBROW  Interiors · OC · date   |       | PHOTO ESSAY · Interiors · date   |
| Headline display-l               |       | Headline display-l               |
| STANDFIRST CAPS SANS             |       | STANDFIRST CAPS SANS             |
| byline                           |       | byline                           |
|==================================|       |==================================|
| [ lead plate, wrap width ]       |       | [ lead plate, natural ratio;     |
|   caption                        |       |   portrait fits 86vh ]           |
|      | Drop-cap para   64ch |    |       |   caption                        |
|      | para                 |    |       |    | para (64ch)            |     |
|      | [wide plate]         |    |       |  [ 01 plate ][ 02 plate ]  8 cols|
|      | para   h2   para     |    |       |    caption for the pair          |
|      | " pull quote         |    |       |    | para                   |     |
|      | [gallery 2-up]       |    |       |  [ 03 full-bleed plate       ]   |
|      | service callout      |    |       |    | para   h2   para       |     |
|      | italic close         |    |       |  [ 04 ][ 05 ][ 06 ]  3-up        |
+----------------------------------+       |    service callout · italic close|
                                           +----------------------------------+

INTERVIEW                                  NOTE
+----------------------------------+       +----------------------------------+
| [ portrait  ] IN CONVERSATION ·  |       | NOTE · Personal styling · date   |
| [ plate or  ] Styling · date     |       | Headline display-m               |
| [ "to come" ] Headline display-l |       | STANDFIRST CAPS SANS             |
| [ 3 cols    ] STANDFIRST         |       |==================================|
| [           ] byline             |       | [ lead plate ]  | para (52ch)    |
|==================================|       | [ 4 cols     ]  | para           |
|      | intro para (64ch)    |    |       | [ or "to come"] | italic close   |
|      | STYLING OC           |    |       |                 | service callout|
|      | Question in italic   |    |       +----------------------------------+
|      | EMILY                |    |
|      | Answer in roman      |    |       GUIDE
|      |                      |    |       +----------------------------------+
|      | Question in italic   |    |       | GUIDE · Personal styling · date  |
|      | Answer               |    |       | Headline display-l               |
|      | [column plate]       |    |       | STANDFIRST · byline              |
|      | Question in italic   |    |       |==================================|
|      | Answer to come       |    |       | [ lead plate ]                   |
|      | This conversation has|    |       |      | intro para (64ch)    |    |
|      | been edited...       |    |       |      | 01                   |    |
|      | service callout      |    |       |      | Step heading h2      |    |
+----------------------------------+       |      | para  [column plate] |    |
                                           |      | 02                   |    |
                                           |      | Step heading h2      |    |
                                           |      | para  · list         |    |
                                           |      | Subheading h3  para  |    |
                                           |      | service callout      |    |
                                           +----------------------------------+
```

Column positions (12-col grid, ≥1025px): header stack cols 2 to 10 as shipped; Feature, Guide and Interview body cols 4 to 9; Essay body cols 3 to 10 with text capped at 64ch and plates filling the eight columns, and an essay lead where portrait leads fit to 86vh height like the feature while landscape leads run natural; Note plate cols 1 to 4 and body cols 6 to 12; Interview header plate cols 1 to 3 with the title stack cols 5 to 12 (both narrowed after the first build showed 4- and 5-column plates dwarfing short text). At ≤1024px every split stacks (the interview portrait is clamped to 56vh so the title stays near the top); at ≤640px everything is one column.

## Template skeletons (Studio "Create new")

All five set lorem `title`, `standfirst`, `dek`, the `layout`, a `ratio`, and `draftNote` "Template skeleton. Replace every lorem line." Pictures are empty (no asset) so the frame reads "Photograph to come".

- **Feature story**: p, p, imageBlock(wide), p, h2, p, quoteBlock, p, gallery(2), p(em).
- **Photo essay**: p, gallery(2), p, imageBlock(full), p, h2, p, gallery(3), quoteBlock, p(em).
- **Interview**: p (intro), qaPair with answer, qaPair with answer, imageBlock(column), qaPair with empty answer, qaPair with answer; `interviewee` "Name"; `signoff` default.
- **Short note**: p, p, p(em).
- **Guide**: p (intro), h2, p, imageBlock(column), h2, p, li x3, h2, p, h3, p.

## Applied to the seed posts

1. Living room, reconsidered → **Photo essay**. Body: p, p, gallery(vaulted living + formal living, 3:2), poolView as full-bleed, p, gallery(dining kitchen + dining hall, 3:2, lorem group caption), h2 + p (existing), gallery(bedroom, office, empty frame; 4:5), callout, italic close.
2. Meet Emily → **Interview**, interviewee Emily, lead image stays empty (frame beside the headline). Body: intro p, qa + 2 lorem paragraphs, qa + 1, existing quote, imageBlock(empty, column), qa with no answer, qa + 1 with an em span, callout. Sign-off default.
3. The art of personal style → **Guide**. Body: intro p, h2 The edit + p(lorem) + imageBlock(foundersDenim, column), h2 The sourcing + p(lorem) + existing four list items, h2 The fitting + p(lorem), h3 The design touch + p(lorem), existing quote, callout, italic close.
4. New draft post "A note on lorem" → **Note**, oldest date, empty lead plate, three lorem paragraphs, callout. Flagged as a placeholder so the Note layout can be previewed locally.

Feature stays as shipped; no seed post changes to it.
