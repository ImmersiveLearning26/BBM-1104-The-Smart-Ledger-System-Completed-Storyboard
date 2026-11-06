# Smart Ledger design system

## Page grammar
The motion cover demonstrates the interface. The name page collects one input. Grace’s briefing uses the shop image to establish the setting. Once the ledger opens, the transaction, source record or accounting comparison is the main visual.

Use a single task heading and one line of instruction where the action needs explanation. Keep a task next to the information needed to complete it. The narrow sidebar lists the four work areas as orientation. Activities advance through validated actions. The header carries the shop name, reporting period, briefing and audio settings. Show the rule sheet or ledger book beside the current heading where relevant.

## Tokens
| Role | Implementation | Where it belongs |
|---|---|---|
| Ink / paper | #191B22 / #FFFFFF | Text, primary CTA and workspace |
| Fog / rule | #F5F6F9 / #DCE0E8 | Summary background and dividers |
| Selected | #ECEEFE fill, #4655BB text | Active stage or selected draft |
| Success | #DFF5E9 fill, dark green text | Matched entry or equal amounts, explicitly labelled |
| Exception | #FFF0D9 fill, brown text | Incorrect account or missing/wrong amount |
| Titles | Local Afacad, 600; task h1 32–44px, h2 26px | One visual level per information level |
| Body and figures | Local Manrope, 15px base; 13–14px table/utility text; tabular figures | Labels, actions, ledger records |
| Surfaces | 8px controls, 12px summary panel, 16px dialog | Soft corners; one light divider at a time |
| Rhythm | 8px component spacing; 12–16px rows and labels; 18–52px adaptive section gaps | Align related controls on the same axis |
| Icons | 19px outline, 24px viewBox, 1.6px stroke; identity mark 23 × 25px | Rules / balances / console / report |

## Responsive layout
Desktop rail 196px, top bar 68px, content max width 1300px. At 980px the rail narrows to 158px. At 740px and below the rail becomes a compact brand strip displaying the current area; task and summary stack. Native selects and buttons support keyboard and touch. Wide evidence tables scroll within their own region. Long reports and reflection fields use natural page scrolling.

## Reference decisions
Billing reference → quiet register with one highlighted row. Checkout reference → the active account on the left and placed balances on the right. UI specimen → consistent typography, compact controls and reusable outline icons. The updated cover direction uses the product motion loop. The shop portrait belongs to the narrative briefing after name entry. See design/direction/ for review images and design/screens/ for the exact implementation.
