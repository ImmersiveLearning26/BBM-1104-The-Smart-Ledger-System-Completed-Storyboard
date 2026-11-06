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
