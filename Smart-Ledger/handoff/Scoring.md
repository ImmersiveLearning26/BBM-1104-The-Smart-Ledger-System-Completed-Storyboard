# Assessment and evidence

## Fixed by the storyboard
| Strand | Final weight | Evidence |
|---|---:|---|
| PR | 30% | Six account-pair mappings |
| LT | 15% | Eleven balance placements and size/direction of the difference |
| ED | 25% | Two diagnoses and two corrections |
| TD | 25% | Audit approach 10% of strand; testing 90% |
| RS | 5% | Three equally weighted criteria in the handover rationale |

All five strand percentages are on a 0–100 scale. Compute the weighted sum before rounding. Display one decimal. Strong starts at 80; Developing starts at 60. The storyboard example (80, 90, 75, 85, 80) returns 81.5. Opening, timing, hints, feedback review and reflection have zero direct weight.

## Local implementation choices for underspecified items
PR is the fraction of six pairs right on first complete submission. LT gives one item each for the eleven account placements plus one joint amount-and-side item. ED gives one item each for the two diagnoses and two journals. Wrong answers can be corrected to progress. A retry carries no separate deduction. Empty form submissions do not count as an attempt.

TD = 100 × [0.10 × first audit correct + 0.90 × (0.40 × category coverage + 0.30 × correct predictions + 0.30 × correct first revisions)]. Coverage is distinct categories exercised manually divided by four. The prediction denominator is the number of distinct manually predicted cases. A deliberate initial case choice from each category is enough before regression. A bulk run supplies no prediction credit. First revisions use three distinct fault targets as the denominator. Full coverage and successful repairs are completion gates, so first choices provide most differentiation across completed runs.

RS has one mark per written criterion. The offline starter suggests binary marks from text patterns (account classes plus debit/credit; source investigation plus suspense and correction; a limit or concrete undetectable error). It retains all original text and labels the result **indicative**. Equivalent phrasing, negation or contradictory explanations require human judgement. At Finish, Facilitator review can replace each mark and recalculate the weighted result. Use a reviewed grade for formal assessment. The summary choice gives feedback and gates submission; it does not add a second reasoning score.

## Evidence lifecycle
State under bbm1104-smart-ledger-v1 includes learner and simulation identifiers, name, role, start/completion timestamps, current page, audit views and first action, successful rule mappings, placements, difference, evidence views, diagnoses, correcting journals, selected cases, predictions, initial and revised actual entries, routine repairs, final regression report, handover, rationale, marks and optional reflection. The append-only log records choices, outcomes, hints and the suspense balance after each posted correction. Derive retries by task and item. The exported file adds strand scores, overall score, review status and current suspense balance. Each new attempt generates a fresh ID. Local facilitator access is for demonstrations.

## Calculation checks
The opening ledger has KSh 350,000 on each side. Debit-short 14,100 = missing payable debit 15,000 minus excess expense debit 900. Suspense is debit-positive internally. Posting E1 subtracts 15,000; posting E2 adds 900. Both orders clear to zero. Closing debits and credits are 465,000 each. T8 should fail with one missing leg, T9 with 5,400 against 4,500, T10 with the wrong debit class. The T10 draft has equal amounts.
