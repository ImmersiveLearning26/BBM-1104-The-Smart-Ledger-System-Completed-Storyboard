# Smart Ledger · Claude replication kit

**To play:** extract the whole ZIP and open **app/index.html**. Start on the silent motion cover, enter a fictional name, then open the ledger after Grace’s briefing. The app, two typefaces, photographs and cover video run offline.

**To build with Claude:** upload the extracted folder or attach the ZIP in a Claude environment that can unpack it. Start with **[CLAUDE.md](handoff/CLAUDE.md)**. The complete page renderers are in **app/pages/**. For a copyable Markdown version with screen references, actions and transitions, use **[Page replication code](handoff/Page-replication-code.md)**.

| Need | Where to look |
|---|---|
| Runnable learner / facilitator entry points | app/index.html, app/facilitator.html |
| Fixed accounting activities and scoring | source/Storyboard.pdf, app/content.js, app/engine.js, handoff/Scoring.md |
| Interaction handlers and saved state | app/app.js |
| Screen references and page map | design/screens/, design/Screen-guide.md |
| Visual language, responsive rules and named tokens | design/Design-system.md, app/style.css, app/shared.js |
| Design review images and supplied inspiration | design/direction/, design/inspiration/ |
| Cover media, motion timings, optional master recordings | app/assets/, production/Media.md, production/Debrief-media.md, production/Audio.md, production/Cover-preview.mp4, production/cover-source/ |
| Checks and repeatable verification | verification/Checks.md, verification/accounting.cjs, verification/browser.cjs |

For local serving, run `python3 -m http.server 8000 --directory app` from the extracted root, then visit http://localhost:8000/. Maintain the same URL to resume a run. The local build stores one active attempt per browser origin. On Finish, export the JSON test log before starting a new attempt. Use the facilitator page to import completed exports for cohort review.

**Production scope.** The 15-second product cover is included and wired. Grace’s separate 62-second briefing uses a captioned shop still and optional device speech. The splash uses the MIVA Open University logo (app/assets/brand/miva-open-university.svg). The debrief opens with a two-slide recap over a store loop; the store loop is generated with Kling 4.0 (720p); the two pictures are temporary crops of the shop still until final art replaces them (see production/Debrief-media.md for the slots and generation prompts). Grace and the narrator are voiced (production/Audio.md) and the opening has shop ambience and effects. A filmed shop sequence remains a production substitution. Written reasoning marks are indicative until facilitator review. This kit runs locally and includes file-based reporting.
