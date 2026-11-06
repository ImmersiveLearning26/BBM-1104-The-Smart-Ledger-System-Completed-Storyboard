# Screen replication guide

The individual PNGs in screens/ are captures of the included interface, using fictional demonstration data at 1440 × 900. Each listed filename stem has a matching .png. They are implementation references for the builder. The five academic scenes use multiple states of one page.

## Page-by-page
Use the source index in ../handoff/Page-replication-code.md to locate each renderer in ../app/pages/, ../app/shared.js or the facilitator entry point. The action names below resolve directly to the dispatch function respond() in ../app/app.js. Every new page replaces the contents of the same workspace. Form fields write to the indicated state; a passive page view gives no points.

| Reference and source | Render function | What the learner sees and does | State and exit check |
|---|---|---|---|
| P00-opening · MIVA shell | hero() | Centred MIVA Open University logo and “presents”. Continue or wait 1.8s. | advanceSplash opens the motion cover. |
| P00b-motion-cover · landing | coverPage() | A silent product animation above a live title and Start button, with optional Pause. | enterCover opens name entry at any playback position. Reduced motion starts on the poster. |
| P01-identity · shell | hero() | A centred name form on a fog background. One field and Enter the shop. | Submit identity; trim a 1–60 character name into name. |
| P02-introduction · Scene 1 | hero() | A captioned view of Grace at her counter. Five source dialogue cues, Pause, Skip, audio settings. | End of the final cue or skip opens title. Reload restarts the intro cue sequence. |
| P03-title · Scene 1 | hero() | Title against shop backdrop with the learner’s name and role. | start sets the timestamp and enters audit. |
| P04-audit · Scene 2A | audit() | Review the rule sheet and open each of five draft entries. Left list tracks viewed entries. Right panel shows debit and credit. | sheet plus five distinct seen IDs unlock auditNext. |
| D01-rule-sheet · Scene 2 | ruleSheet() | Modal table of account types, normal increases and expandable opening balances. | Close/Escape returns to the active screen. Available during mapping. |
| P05-audit-action · Scene 2B | actionPage() | Choose the first debugging action after inspection. | auditChoice retains the first answer for TD. Retry A/C; B opens comparison. |
| P06-comparison · Scene 2B | actionPage() | Five observations and expected accounts in a checklist. Review S-02, S-03, S-04. | configure enters mapping once compared. |
| P07-rules · Scene 2C | mapping() | Active account pair on the left, saved rules on the right. Expand the last saved T-account to inspect its reason. | map records each complete pair. Only the six accepted pairs unlock ledger. |
| P08-trial-balance · Scene 3A | sortPage() | Ledger balance beside two tap/keyboard column options. Committed placements build the running totals. | column records and locks correct placements. Complete 11 before readDifference. |
| D02-ledger-book · Scene 3 | ledgerBook() | Expand an account to read its June debit and credit movements. Expand source transactions to view the eight originals. | book is available in Scene 3. Close to resume. Correcting journals appear when posted. |
| P09-difference · Scene 3A | difference() | Totals stand beside numeric amount and short-column inputs. | difference accepts 14100 or 14,100 and Debit. Wrong submissions prompt comparison. |
| P10-evidence · Scene 3B | tracePage() | Compare Trade Payables, Delivery Expense, Cash against source records. Classify each error after inspection. | evidence records distinct views. type accepts one-sided posting then transposition; correction follows both. |
| P11-corrections · Scene 3C | correctPage() | Suspense is persistent above two errors. Select either error and a correcting entry. | post previews rejected entries without committing. Each correct journal posts once. Nil plus both IDs unlock console. |
| P11b-ledger-cleared · Scene 3C | correctPage() | Both IDs posted; inspect corrected totals. | console unlocks only at nil. |
| P12-test-bank · Scene 4A | testPage() | Choose a case from four categories. Inspect amount, select predicted debit and credit, then run. | predict locks the first complete prediction. Runs keep the initial and latest actual. No result is shown on a new manual case before run. |
| P13-balanced-mismatch · Scene 4A | testPage() | Compare expected and actual. Separate labels show Amounts balance and Account mismatch for T10. | repair offers three routines and six rules. Correct target repairs, reruns and invalidates an old regression report. |
| P14a-regression-ready · Scene 4B | regression() | Empty report awaiting a complete run. | runAll computes ten outcomes from the latest rules. |
| P14-regression-fail · Scene 4B | regression() | Open after manual category coverage. Run all ten; every failing row has an investigation action. | runAll snapshots latest outcomes. investigate opens the failing case in the console; unresolved faults block handover. |
| P15-regression-pass · Scene 4B | regression() | Review the full expected/actual report after all three routine fixes. | confirmReport requires ten passes and explicit confirmation. |
| P16a-handover-choice · Scene 4C | handover() | Grace asks whether she can rely on equal totals. Choose a summary. | Correct summary opens three fields. |
| P16-handover · Scene 4C | handover() | Grace’s question, summary choices, then three editable free-text fields. | summary B/C prompt a retry. submit requires A, all three fields and a passing report. |
| P16b-recap-trace · Scene 5 | recapPage() | Full-screen store loop under a dark overlay. Picture 1 beside “Trace the difference”, its explanation, two facts from the learner record and Next. Pause/Play background control. | recapNext crossfades (300ms) to slide 2 and focuses its heading. Reload restarts at slide 1. |
| P16c-recap-test · Scene 5 | recapPage() | Picture 2 beside “Test beyond the totals”, case and repair facts, Back and View my results. | recapDone saves recapDone and opens the results. Later visits skip the recap. |
| P17-debrief · Scene 5 | debrief() | Weighted score, five strands, four personal feedback panels, ten-case report and optional reflection. | Reflection writes immediately without points. finish records completion. |
| P18-completion · Scene 5 | finishPage() | Grace’s closing line, return to debrief, export, facilitator review or new attempt. | review keeps evidence. mark recalculates RS from human review. New attempt has a cancellation step. |
| D03-rubric-review · moderation | respond(facilitator) | Review the verbatim answers and toggle three marks. | Save marks or close without committing. |
| F01-cohort · §8 | facilitator.html + cohort.js | Import completed learner logs. Inspect strand averages, common error categories and first-attempt patterns without displaying names. | A repeated attempt ID replaces that report. Reload clears imported reports. |

## Layout and interaction
See Design-system.md for the live geometry, typography, responsive rules, colours and formal component roles. Each financial table and amount is selectable text.

The account and test selectors are native controls. Tab traverses the visible controls, Enter or Space activates buttons, and Escape dismisses dialogs. There is no required drag gesture. Data tables announce Debit and Credit in full. Results include a text label alongside styling. Core actions have 44px minimum height. Screen headings use a 160ms, 3px arrival motion; reduced-motion mode cuts directly. Navigation and validation are synchronous, with no animation gate. Opening cue changes are timed; skip and pause remain operable.

## Resume and back
Accepted entries, original attempts, media settings and reflection text persist locally after each meaningful event. A reloaded audit or trace reopens its overview with prior viewed items retained. The selected case persists. Unsubmitted accounting selector values can be re-entered. Back from regression returns to the console. Finish permits debrief review. Previously scored activities are locked for the run; New attempt starts a clean record. The browser Back button is normal browser navigation rather than a scored scene control.
