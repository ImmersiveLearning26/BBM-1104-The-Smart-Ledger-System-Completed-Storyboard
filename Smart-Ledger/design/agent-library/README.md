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

Every line height is a whole multiple of 4 px, so blocks of text always end on the grid.

| Token | Size / line (px) | Weight | Source |
|---|---|---|---|
| `--t-display` | 44 / 48, −0.02em (phone 36 / 40) | 600 | Opening title only |
| `--t-amount` | 32 / 40 | 600 | Large amounts on objects |
| `--t-title` | 20 / 28 | 600 | R3 "Training Session" |
| `--t-message` | 19 / 28 (phone 17 / 24) | 400 | R3 transcript lines |
| `--t-body` | 16 / 24 | 400 | R1 "Ask anything" |
| `--t-label` | 15 / 20 | 500 | R1 chips |
| `--t-caption` | 13 / 20 | 500 | R2 "Explore beautiful…", R3 subtitle |
| `--t-micro` | 12 / 16 | 500 | Token and T-account side labels |
| Numbers | tabular figures | 600 | Amounts |

### Shape
| Token | Value | Source |
|---|---|---|
| `--r-pill` | 999 px | Input, chips and buttons in R1–R3 |
| `--r-panel` | 32 px | R1 glass panel, R2 image card |
| `--r-card` | 24 px | R2 info bar |
| `--r-tile` | 16 px | R1 tool tile (about 0.2 × its side), R2 black tile |
| `--r-row` | 12 px | Rows inside objects |

### Size
| Token | Value | Source |
|---|---|---|
| Input pill | 64 px high | FocusPro composer; R1 proportions |
| Chip | 44 px high | R1 chips, at the 44 px touch minimum |
| Tile | 64 px high | R1 tool tiles |
| Circle button | 48 px | R3 mic button, on the 8 px grid |
| Send button | 40 px circle in a 48 px target | FocusPro send (44 px), raised to 48 so it centres on the grid in the 64 px pill |
| Avatar | 36 px | R3 transcript |
| Story card | 272 px high (phone 224) | R2 image card; a fixed height, so what follows stays on the grid |
| Spacing | 4 · 8 · 12 · 16 · 24 · 32 · 48 · 56 | See §3 |

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

### Grid
See §3. Every value above is already on it.

---

## 2. Components

### Atmosphere `.atm`
The full-bleed background: mesh, grain and letter field. Every agent screen sits on it, apart from the opening, which uses Grace's store video.

### Header `.hdr` (R3)
A centred title and subtitle, 80 px tall, with one hairline divider below (white 30%, drawn as a shadow so it adds no height). A glass circle button on the right opens settings. **No logo, no step dots, no counters.**

### Agent orb `.orb` (R3 globe and R1 orb dot)
A globe of particles in the orb gradient. It is the agent's identity everywhere: the 36 px avatar, the 24 px dot in the input pill, the 56 px pop-up orb and the 160 px stage orb.

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

- **One-pick steps** (a right/wrong call, a choice of approach) answer as soon as a tile is tapped. The send button is hidden.
- **Two-pick steps** (debit and credit) fill the tokens, then the send button runs them.
- **The reveal comes after the run:** the result, and any change to Grace's screen, appears only once the agent has finished working.

### Option tile `.tile` (R1 tool tiles)
A `--glass-tile` tile, 64 px high, radius 16, holding an icon and a label. Hover uses glass-1. The grid has four columns on laptop and three on phone. Accounts appear in curriculum order, unsorted and ungrouped, so the layout gives nothing away.
- **Selected:** filled white at 80%, ink text, and one orange dot in the corner (the R2 accent). Which side it went to is shown by the token in the pill.
- **No outline, side stroke or ring in any state.** Keyboard focus uses the standard focus ring only.

### Send button `.send` (R2 arrow pill, FP send)
A 40 px ink circle with a white ↗, in a 48 px target.
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
- **Rows:** `--obj-raised` fills with a 12 px radius and an 8 px gap, so there are no table rules. The current row is white with an orange dot.
- **Amounts:** right-aligned, in tabular figures.

### T-account `.t` (inside objects)
Two `--obj-raised` cells under a 4 px ink bar, with a 4 px ink gap between them. The T is accounting content, so it is the one place an ink line is allowed.

### Attention glow `.attn`
The orb gradient, blurred into a halo behind **the one control waiting for the learner**. It turns once every 4 s and breathes every 2.4 s.
- **What gets it:** the input box while it waits for a pick; the send button once both accounts are picked; the single next action (Begin, Continue, Fix the rules, Next rule).
- **What never gets it:** more than one control at a time, or anything that isn't actionable.
- **Reduced motion:** the halo stays still.

### Icon bar `.iconbar` / `.ibtn`
Settings and actions as 48 px glass icons (R3 circle buttons).
- **Opening:** on hover or keyboard focus, an icon opens fluidly into a labelled pill (0.32 s). After a click it opens briefly to confirm the new state, e.g. "Sounds off".
- **States:** on is filled white with ink; off is glass. A destructive action (Start again) arms on the first tap, turns red and says "Tap again to start over", and disarms after 3 s.
- **Never** a centred settings dialog.

### Portrait `.portrait` (R2 image card, full height)
The character's side of the screen: the store video cropped on Grace, with a 32 px radius and pinned while the chat scrolls. The MIVA logo and the icon bar sit at the top; her name and role at the bottom. On phone and tablet it becomes a 200–240 px banner above the chat.

### Chat thread `.thread` / `.msg` (R3 transcript, kept as history)
The conversation, rebuilt from saved state so a reload restores it.
- **Avatars:** Grace's photo for Grace, the learner's initial for the learner, a live orb on Smart Ledger's current message, and a still orb dot on its earlier messages.
- **The current exchange** is full size, with Grace's screen posted beneath the question as a card.
- **Earlier exchanges** step back: 16 px text at 85% white, and cards collapsed to a one-line `.obj.mini`. No counters.
- **The rule sheet**, when asked for, arrives as its own card under the current question, and leaves when asked again.

### Dock `.dock`
The input box pinned to the bottom of the chat, as in ChatGPT or Claude: context chips, then the composer, then the next action. What scrolls beneath it is blurred, and the blur fades out over 64 px, so there is no box edge.

### Buttons
| Class | Look | Source |
|---|---|---|
| `.btn-ink` | Ink pill with white text | R2 black tile; the one primary action per screen |
| `.btn-glass` | Glass-2 pill with white text | R3 End Session |
| `.btn-raised` | `--obj-raised` pill with ink text | R2 arrow pill; for actions on objects |
| `.icon-glass` | Glass-1 48 px circle | R3 mic |

---

## 3. Grid

The grid is invisible to learners. It exists so every element lines up, and so a test can prove it.

### Base unit: 4 px
- **Every length is a multiple of 4 px:** sizes, padding, margins, gaps, radii and line heights. Layout spacing between blocks uses multiples of 8.
- **Exempt from the base unit:**
  - font sizes;
  - lines of 1–3 px (dividers, focus rings);
  - the pill radius (999 px) and circles (50%);
  - icon strokes, orb particles and the letter field;
  - shadows and blur;
  - width that follows text, such as a chip that grows with its label. Its height still snaps.

### Layout columns
| Width | Columns | Gutter | Outer margin | Max content |
|---|---|---|---|---|
| 1024 px and up | 12 | 24 px | 40 px | 1200 px |
| 768–1023 px | 8 | 24 px | 32 px | Fluid |
| Under 768 px | 4 | 16 px | 16 px | Fluid |

- `.wrap` sets the margins and maximum width.
- `.grid12` lays out the columns, using `--cols`, `--gutter` and `--margin`. Columns stretch with the window, so their widths are fluid, but every block starts and ends on a column line.
- **Placement classes:**

| Class | Laptop (12 columns) | Tablet (8 columns) | Phone (4 columns) |
|---|---|---|---|
| `.col-1-5` | Columns 1–5 | Full width | Full width |
| `.col-7-12` | Columns 7–12 | Full width | Full width |
| `.col-half` | 6 columns | Full width | Full width |
| `.col-third` | 4 columns | 4 columns | Full width |
| `.col-quarter` | 3 columns | Full width | Full width |
| `.col-rest` | 9 columns | Full width | Full width |
| `.col-sixth` | 2 columns | 2 columns | 2 columns |

- In the agent step, the conversation sits in columns 1–5 and Grace's screen in columns 7–12. Column 6 is left as breathing space.

### Vertical rhythm
- **Everything lands on the grid:** because heights, line heights and spacing are all multiples of 4, every component's top edge falls on a 4 px line.
- **Lines never add height:** dividers are drawn as shadows or background lines, never as borders, so they don't push content off the grid.
- **Media gets fixed heights:** the story card has a fixed height rather than an aspect ratio, so the content after it stays on the grid.

### Seeing it
Add `?grid` to the address, or press Alt+Shift+G. The column bands and 8 px lines draw over the page. Learners never see this.

### Proving it
`node verification/grid.cjs` loads the pages at 1280, 900 and 390 px and fails if:
- any computed padding, margin, gap, radius or line height is off the 4 px unit;
- any component's height, or a fixed square's width, is off the unit;
- any component's top edge is off a 4 px line, except inside pinned (sticky or fixed) surfaces, which move with scrolling and are checked for size only;
- any `.grid12` block doesn't start and end on a column line, or a grid doesn't fill its `.wrap`.

Run it after every visual change.

## 4. Rules
1. **One question at a time.** The chat keeps its history, but only the current exchange is full size, with one card and one input box.
2. **No progress furniture:** no step dots, "1 of 6" counters, breadcrumbs or running tallies of what is done. Where the learner is should be clear from the story.
3. **Feedback has one channel:** the orb pulses and the result pop-up. No inline coloured boxes, side strokes or status rows.
4. **Nothing moves the layout.** Working states animate inside fixed boxes (the waveform, the orb, the send arc).
5. **Filled, not outlined.** Selection and emphasis are fills. Outlines appear only as the system focus ring.
6. **One accent per screen.** Orange marks "this one". Green and red appear only on the orb and in the pop-up.
7. **The agent speaks in two sentences at most.** Longer content belongs on the object.
8. **Picks, not typing,** for anything that is marked.
9. **Glass for the conversation, objects for the accounting.** Ledger data never sits directly on glass.
10. **Reduced motion keeps every state,** showing it by colour without movement.
11. **Use the space with content, not decoration.** The character fills one side and the conversation the other.
12. **The glow marks the one thing to do next**, and nothing else.
