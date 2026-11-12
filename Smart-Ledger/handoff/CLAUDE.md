# Prompt for Claude

You are implementing **The Smart Ledger System** for BBM 1104. Use the supplied runnable build as the baseline. The learner checks a prototype ledger for Grace Achieng at Zuri Home Supplies, Nairobi. Completing the task requires six posting rules, a reconciled June ledger, evidence from all four testing categories, three routine repairs, a confirmed ten-case report, and a handover in the learner’s own words.

## What to open first
1. Read START-HERE.md and source/Storyboard.pdf §§4–9. Where reference artwork contains illustrative account codes, figures or UI copy, use the fixed curriculum values in app/content.js.
2. Run app/index.html. Match the screen states in design/screens/. design/direction/ contains earlier review mockups for selected states; design/inspiration/ explains their visual origins. Never mount a screenshot as the interactive application.
3. Read design/Design-system.md, design/Screen-guide.md and handoff/Page-replication-code.md. Page modules are loaded by app/index.html. Reuse app/shared.js for controls and the persistent workspace. Make any edits in the executable source first.
4. Implement events using app/app.js and calculations using app/engine.js. Preserve first attempts, correction order, revision history and all progression gates described in handoff/Scoring.md. Reuse the test fixtures in verification/. All navigation between learner activities uses one document.

## Interaction to reproduce first
Start simulation on the silent looping cover must work immediately, even with media blocked. Enter a name, complete or skip Grace’s briefing and choose Open the ledger. Inspect the rule sheet and all five source postings. Selecting S-03 reveals the draft Debit Bank / Credit Sales. The audit decision unlocks only when all five IDs have been inspected and the rule sheet has opened. Correct rule-by-rule comparison reveals the expected credit to Trade Receivables. Do not expose the expected posting during the initial inspection. Use the exact case “checking a customer payment” to test learner understanding and answer visibility.

## Finish the remaining states
Use the page map in order. On the ledger page, preserve the distinction between the historical account correction and the future posting routine. Test both correction orders. On T10, highlight the actual debit account; show the independent results “Amounts balance” and “Account mismatch”. Rerun the full bank after the final repair and explicitly confirm its report before handover.

## Visual and motion requirements
Use the local Afacad/Manrope files, the 196px desktop rail, white workspace, fog summary area, muted indigo selection and compact black action buttons. Keep focus on the current transaction. Use colour alongside labels, show amount and account side separately, and right-align currency columns. Use the supplied line icons and keep their meanings stable. Consult production/Media.md for exact triggers, timing, skip/pause and reduced-motion behaviour. Keep the live cover heading and Start button separate from the loop. The video named Cover-preview.mp4 is an example of the composite, for review only.

## Definition of done
Run the included accounting checks and browser walkthrough; also test a blocked or unsupported video, reduced motion, 390px mobile and laptop width. Reopen an in-progress attempt, exercise a wrong choice and retry, export a reviewed final result, then verify that the same completed attempt imported twice counts once. A live LMS or authenticated backend is a separate integration. Deliver local assets with relative paths and retain the source storyboard and notices.

## Added after the original kit
- **Opening:** the MIVA Open University logo (app/assets/brand/) on the splash.
- **Debrief recap:** two full-screen slides over a seamless Kling 4.0 store loop, before the detailed debrief (app/pages/debrief-recap.js, production/Debrief-media.md).
- **Voices and sound** (app/audio.js, production/Audio.md):
  - Grace and the narrator are recorded for the intro, the scene briefings and the closing line.
  - Feedback and hints are split into scripted segments and play recordings where they exist, otherwise the device voice.
  - The opening has shop ambience and effects; graded answers play soft confirm and correction cues; the recap has a music slot.
- **Generated files:** after changing curriculum text or feedback wording, run `node production/build-voice-lines.cjs`. After changing any file under app/, run `node handoff/build-replication-code.cjs`. browser.cjs fails if a feedback line is missing from the voice script.

### Still open
- The two recap pictures in app/assets/debrief/ are temporary crops. The prompts are in production/Debrief-media.md.
- 80 scripted lines are not recorded yet (`"recorded": false` in production/voice-lines.json). The steps are in production/Audio.md.
- The recap music bed (app/assets/audio/music/debrief-bed.mp3) is an empty slot. The prompt is in production/Audio.md.
- Have a Kenyan-English speaker approve both voices.

## Agent-led build (primary)
app/agent.html (agent.js, agent.css) is the primary build. It presents the opening through the six posting rules as a guided, agent-led flow, then hands the same attempt to index.html at the June ledger. Convert the remaining stages to this style, using the same library and grid; don't extend the older workspace style.

It is built only from the agent library: design/agent-library/README.md, app/agent-library.css and app/agent-library.js. The live specimen is app/agent-library.html. Take every colour, size and component from there, and keep every length on the 4 px grid. `node verification/grid.cjs` and `node verification/agent.cjs` fail on anything off the grid.

- **Each step has four beats:** the agent's question, shown as one line beside the orb; the evidence on Grace's screen, as a single solid object; the learner's pick, made in the input box; and the run, shown by the waveform, the send glow and the orb, with the reveal arriving through the centre pop-up.
- **No progress furniture:** no step dots, counters or running tallies, and no logo. The orb is the agent.
- **The learner does the thinking.** The agent never supplies an answer, and the expected posting stays hidden until the learner has chosen the rule-by-rule comparison.
- **Scripted, not a live model.** All prompts and feedback are fixed text, so scoring is consistent and the app runs offline.
- **Same engine.** State, scoring, log, save key and feedback wording are those of app.js, so an attempt continues in index.html from the June ledger.
- **One unscored addition:** a "Looks right / Looks wrong" call on each draft posting (log task `flag`, `s.agent.flags`), compared with the rule sheet in the reveal.
- **Not yet converted:** trial balance, difference, error tracing, corrections, tests, handover and debrief. The agent's own prompts are on-screen text only; they are not in production/voice-lines.json yet.
