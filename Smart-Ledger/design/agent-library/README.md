# Smart Ledger agent library

This library defines every visual decision in the agent-led flow (app/agent.html). It was measured from three references; nothing outside it should be invented while building.

- **Live specimen:** app/agent-library.html, which shows every token and component working.
- **Code:** app/agent-library.css (tokens and components) and app/agent-library.js (orb, waveform, result pop-up).

| Ref | File | What it gives the library |
|---|---|---|
| R1 | ref-1-glass-composer.jpg | Gradient atmosphere with grain and a letter field; frosted glass panel; white input pill with an orb dot; glass pill chips; square tool tiles with a filled active state |
| R2 | ref-2-filled-objects.jpg | Solid filled objects on light grey, no outlines; image card with centred label and an overlapping circle button; info bar with a black tile and one orange accent |
| R3 | ref-3-session-transcript.jpg | Blue-to-lavender atmosphere; centred title, subtitle and hairline divider; glass circle and pill buttons; transcript lines with avatars and no bubbles; a line-drawn globe as the agent avatar |
| FP | FocusPro launch kit, app/styles.css `.send.running` | The glow: a 3 px conic arc that orbits the send button once every 1.2 s while the agent works |

Colours are sampled from the images. Glass opacities are solved from each glass fill against the colour behind it.

---

## 1. Foundations

### Colour
**Atmosphere**: the background of every agent screen. A mesh of R3's blue top running into R1's violet, rose and plum.

| Token | Hex | Source |
|---|---|---|
| `--atm-blue` | #4a95d6 | R3 top |
| `--atm-sky` | #a3b0da | R3 middle |
| `--atm-violet` | #a475b7 | R1 upper field |
| `--atm-orchid` | #c387bd | R1 behind the letters |
| `--atm-rose` | #d0869e | R1 lower left |
| `--atm-plum` | #7057a3 | R1 lower right |
| `--atm-haze` | #ece6e8 | R1 bottom-left haze |
| `--atm-veil` | #2b1d4a at 45%, over the whole mesh | Accessibility: lifts white text to at least 4.5:1. The light mesh measured only 2.5–3:1. It deepens the mesh towards R1's darker lower area. |

**Glass**: white over the atmosphere, never a coloured fill.

| Token | Value | Source |
|---|---|---|
| `--glass-1` | white 22% | R3 mic button (solved 0.22) |
| `--glass-2` | white 32% | R3 End Session pill |
| `--glass-3` | white 40% | R1 chips and active tool tile (0.40–0.43) |
| `--glass-input` | white 80% | R1 input pill (0.67–0.78) |
| `--glass-tile` | white 10% | R1 idle tool tiles (barely filled; only the active tile is filled) |
| `--glass-panel` | white 16% at the top to plum 34% at the bottom | R1 panel, light top-left (#c58eb8) to dark low (#705e84) |
| `--glass-edge` | inset 1 px, white 28%, top edge only | R1 panel rim |
| Blur | 24 px, saturate 140% | R1 and R3 frosting |

**Objects**: the solid surfaces of Grace's Smart Ledger screen. Accounting content sits on these for legibility.

| Token | Hex | Source |
|---|---|---|
| `--obj-canvas` | #dbdce0 | R2 background |
| `--obj-fill` | #c8cbd2 | R2 text pill and bar |
| `--obj-raised` | #ececec | R2 arrow pill |
| `--ink` | #0b0b0d | R2 black tile (#010101), softened |
| `--ink-2` | #8a8d94 | R2 small text |
| `--accent` | #f28e38 | R2 orange plus. **One per screen**, only for "this one". |

**Text**

| Token | Value | Source |
|---|---|---|
| `--on-glass` | #ffffff | R3 text |
| `--on-glass-2` | white 85% | R3 subtitle (66%), raised so captions keep 4.5:1 on the veiled mesh |
| `--on-input` | #1d1a24 | R1 |
| `--on-input-2` | ink 38% | R1 placeholder (#b7adb4 on the pill) |

**Results**: the only colours the brief adds. They are tuned to the palette's saturation and appear only as orb pulses and in the result pop-up, never as page fills.

| Token | Hex | Use |
|---|---|---|
| `--pass` | #46c98a | The orb pulses green and the pop-up shows a green dot |
| `--fail` | #ef6170 | The orb pulses red and the pop-up shows a red dot |

**Orb gradient**: #8fc0f0 (R3 blue, lifted) → #c1a1d9 (R1 orb, left) → #f1b3db (R1 orb, right).

### Type: Manrope only (local files)
R1–R3 use one neo-grotesk family; Manrope is the closest local match. Afacad is not used in the agent flow.

| Token | Size / line | Weight | Source |
|---|---|---|---|
| `--t-display` | 44 / 1.08, −0.02em | 600 | Opening title only |
| `--t-title` | 20 / 1.3 | 600 | R3 "Training Session" |
| `--t-message` | 19 / 1.45 | 400 | R3 transcript lines |
| `--t-body` | 16 / 1.5 | 400 | R1 "Ask anything" |
| `--t-label` | 15 / 1.2 | 500 | R1 chips |
| `--t-caption` | 13 / 1.35 | 500 | R2 "Explore beautiful…", R3 subtitle |
| Numbers | tabular figures | 600 | Amounts |

### Shape
| Token | Value | Source |
|---|---|---|
| `--r-pill` | 999 px | Input, chips and buttons in R1–R3 |
| `--r-panel` | 32 px | R1 glass panel, R2 image card |
| `--r-card` | 22 px | R2 info bar |
| `--r-tile` | 16 px | R1 tool tile (about 0.2 × its side), R2 black tile |
| `--r-row` | 14 px | Rows inside objects |

### Size
| Token | Value | Source |
|---|---|---|
| Input pill | 64 px high | FocusPro composer; R1 proportions |
| Chip | 44 px high | R1 chips, at the 44 px touch minimum |
| Tile | 64 px high | R1 tool tiles |
| Circle button | 52 px | R3 mic button |
| Send button | 40 px circle in a 44 px target | FocusPro send |
| Avatar | 36 px | R3 transcript |
| Spacing | 4 · 8 · 12 · 16 · 24 · 32 · 48 | — |

### Texture
- **Grain:** fractal noise at 14% opacity in overlay blend, on the atmosphere only (R1, R3).
- **Letter field:** monospace capitals at 11 px, white 30%, in two drifting clouds that fade at the edges (R1). Built from the letters of DEBIT CREDIT KSH: decoration, not content, and hidden from screen readers.

### Motion
| Token | Value |
|---|---|
| `--e-out` | cubic-bezier(.2,.8,.2,1) |
| Press | 160 ms |
| Enter | 280 ms, rising 8 px and fading in |
| Result pulse | 700 ms |
| Glow orbit | 1.2 s per turn (FP) |

With reduced motion, nothing moves: states change colour only, and pop-ups appear and leave without travel.

---

## 2. Components

### Atmosphere `.atm`
The full-bleed background: mesh, grain and letter field. Every agent screen sits on it, apart from the opening, which uses Grace's store video.

### Header `.hdr` (R3)
A centred title and subtitle with one hairline divider below (white 30%). A glass circle button on the right opens settings. **No logo, no step dots, no counters.**

### Agent orb `.orb` (R3 globe and R1 orb dot)
A globe of particles in the orb gradient. It is the agent's identity everywhere: the 36 px avatar, the 20 px dot in the input pill, and the 120 px stage orb.

| State | Looks like |
|---|---|
| `idle` | Turns slowly on its own axis (one turn every 16 s) and breathes gently |
| `working` | Turns faster, pulses, and its particles scatter outwards |
| `building` | Its particles flow into a cube, still turning and pulsing; used while it builds a posting |
| `pass` | One green pulse ripples out, then back to idle |
| `fail` | One red pulse ripples out, then back to idle |

### Transcript line `.line` (R3)
An avatar beside the text, with **no bubble, no name label and no timestamp**.
- **Avatars:** the orb for Smart Ledger, Grace's photo for Grace, and the learner's initial on the R3 peach gradient for the learner.
- **Only the current exchange is shown:** the agent's question and, once given, the learner's answer. Earlier lines leave the screen.

### Story card `.story` (R2 image card)
A photo of Grace with a 32 px radius and a gradient scrim. Her line sits centred on it (white, 17 px). A glass circle button overlaps the bottom-right corner and replays her voice line.

### Composer `.composer` (R1 panel, FocusPro composer)
The agentic input box, built in three layers:
1. **Context chips above it** (R1 chips): glass-3 pills with an icon and a label. They hold things the learner may want to look at, such as the Rule sheet or Grace's notes. They never hold answers.
2. **The glass panel** (R1), containing the white **input pill**: the orb dot, then the answer being composed, then the send button.
   - The answer shows as **tokens**: filled pills reading "Debit ▸ Cash" and "Credit ▸ Capital". Tapping a token chooses which side the next pick fills.
   - Before any pick, the pill shows a placeholder in `--on-input-2`.
   - **While the agent works**, the tokens give way to the waveform inside the same pill. Nothing changes size.
3. **The tile grid below** (R1 tool row): the options for this step.

Answers are always **picked**, never typed. Typing is used only for the learner's name and the written handover.

### Option tile `.tile` (R1 tool tiles)
A `--glass-tile` tile, 64 px high, radius 16, holding an icon and a label. Hover uses glass-1. The grid has four columns on laptop and three on phone. Accounts appear in curriculum order, unsorted and ungrouped, so the layout gives nothing away.
- **Selected:** filled white at 80%, ink text, and one orange dot in the corner (the R2 accent). Which side it went to is shown by the token in the pill.
- **No outline, side stroke or ring in any state.** Keyboard focus uses the standard focus ring only.

### Send button `.send` (R2 arrow pill, FP send)
A 40 px ink circle with a white ↗.
- **Disabled:** ink 20%.
- **Running:** the FP glow arc orbits it once every 1.2 s, and the arrow becomes a small square.

### Waveform `.wave`
A horizontal ripple: three overlapping sine waves travelling left to right inside a fixed-height strip (20 px in the pill, 32 px on stage).
- **Idle:** it settles to a flat line at 30% opacity.
- **Working:** it moves. Its height never changes, so nothing around it moves.

### Result pop-up `.result`
The only feedback surface.
- A dark glass card (#463470 at 86% with blur, so it reads over any content), centred in the viewport and 360 px wide. A 56 px orb pulses green or red beside one or two sentences in white.
- It leaves after 2.8 s, or on tap or Escape, and is announced to screen readers.
- It never pushes content.
- After a wrong answer, the composer keeps the learner's picks so they can change one tile.

### Ledger object `.obj` (R2)
Grace's Smart Ledger screen: an `--obj-canvas` surface with a 32 px radius.
- **Header:** an R2 info bar with a 36 px black tile showing a ledger glyph, the screen name, and one icon on the right.
- **Rows:** `--obj-raised` fills with a 14 px radius and an 8 px gap, so there are no table rules. The current row is white with an orange dot.
- **Amounts:** right-aligned, in tabular figures.

### T-account `.t` (inside objects)
Two `--obj-raised` cells under one ink bar, with a 2 px ink gap between them. The T is accounting content, so it is the one place an ink line is allowed.

### Buttons
| Class | Look | Source |
|---|---|---|
| `.btn-ink` | Ink pill with white text | R2 black tile; the one primary action per screen |
| `.btn-glass` | Glass-2 pill with white text | R3 End Session |
| `.btn-raised` | `--obj-raised` pill with ink text | R2 arrow pill; for actions on objects |
| `.icon-glass` | Glass-1 52 px circle | R3 mic |

---

## 3. Rules
1. **One thing at a time.** Each screen shows one question, one object and one composer.
2. **No progress furniture:** no step dots, "1 of 6" counters, breadcrumbs or running tallies of what is done. Where the learner is should be clear from the story.
3. **Feedback has one channel:** the orb pulses and the result pop-up. No inline coloured boxes, side strokes or status rows.
4. **Nothing moves the layout.** Working states animate inside fixed boxes (the waveform, the orb, the send arc).
5. **Filled, not outlined.** Selection and emphasis are fills. Outlines appear only as the system focus ring.
6. **One accent per screen.** Orange marks "this one". Green and red appear only on the orb and in the pop-up.
7. **The agent speaks in two sentences at most.** Longer content belongs on the object.
8. **Picks, not typing,** for anything that is marked.
9. **Glass for the conversation, objects for the accounting.** Ledger data never sits directly on glass.
10. **Reduced motion keeps every state,** showing it by colour without movement.
