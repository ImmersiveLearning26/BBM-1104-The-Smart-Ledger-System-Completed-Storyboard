# BBM 1104 · The Smart Ledger System

An interactive accounting simulation for MIVA Open University's Principles of Accounting (BBM 1104). The learner joins Grace Achieng at Zuri Home Supplies in Nairobi to check a prototype ledger. They set six posting rules, trace a KSh 14,100 trial-balance difference through suspense, test the posting system with ten cases, and hand over in their own words. A weighted debrief follows. All figures and the business are fictional.

## Run it
The app is plain HTML, CSS and JavaScript with no build step and no dependencies, and it runs offline.

```sh
python3 -m http.server 8000 --directory Smart-Ledger/app
```

Then open http://localhost:8000/. Opening `Smart-Ledger/app/index.html` directly also works. `Smart-Ledger/app/facilitator.html` imports exported learner logs for cohort review.

## What's inside
| Path | Content |
|---|---|
| `Smart-Ledger/START-HERE.md` | Orientation, and where everything lives |
| `Smart-Ledger/app/` | The simulation: page renderers, engine, styles, fonts, media and audio |
| `Smart-Ledger/design/` | Design system, screen guide and reference screens |
| `Smart-Ledger/handoff/` | Build brief, scoring rules and page replication code |
| `Smart-Ledger/production/` | Media, debrief and audio handoffs, generation prompts and masters |
| `Smart-Ledger/source/Storyboard.pdf` | The source storyboard |
| `Smart-Ledger/verification/` | Accounting checks and browser walkthroughs |

## Media
- **Opening:** the MIVA Open University logo, then a silent product-demo cover.
- **Introduction:** Grace's captioned shop briefing. Grace and the narrator are voiced with Eleven v4, and the opening has shop ambience, a door chime, a till and a phone buzz.
- **Debrief:** a two-slide recap over a seamless store loop generated with Kling 4.0 at 720p. The two recap pictures are temporary crops until final art arrives.

Every piece of media is optional at runtime. Captions, timing and every control work with media blocked, and with reduced motion.

## Tests
```sh
cd Smart-Ledger
node verification/accounting.cjs   # Node 18+
npx playwright install chromium    # once
node verification/browser.cjs      # full learner walkthrough
node verification/cover.cjs        # motion cover
node verification/recap.cjs        # debrief recap
node verification/audio.cjs        # voices and shop sound
```

`Smart-Ledger/MANIFEST.sha256` lists a checksum for every kit file (`shasum -a 256 -c MANIFEST.sha256`).

Fonts: Afacad and Manrope, under the SIL Open Font License (notices in `app/assets/fonts/`).
