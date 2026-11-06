# Media and motion handoff
The simulation centres on reading accounts, comparing postings and testing routines. The accounting workspace is native 2D HTML. All required evidence is available by keyboard and touch. The project requires no 3D model supply.

| Item | Included in the kit | Production owner and integration |
|---|---|---|
| Grace at Zuri Home Supplies | app/assets/zuri-shop.jpg, an original generated shop still. Used by the timed shop introduction and role confirmation. | Art director approves Grace, shop continuity and morning light. Retain as the loading, reduced-motion and playback-error poster. |
| Opening sequence | 62-second sequence of five timed caption cues over the still, plus skip and pause. | Video editor supplies one 16:9 1080p, 60–75s MP4. Suggested final path app/assets/intro.mp4. Mount one video inside the intro hero, object-fit cover. On ended go to title; Skip uses the same transition. On load/play failure use the existing cue sequence. |
| Voices | Recorded with Eleven v4: Grace (custom voice Joy) and the narrator (Dr. Omondi) for the five intro cues, four scene briefings and Grace's closing line. Feedback and hints use the device voice when enabled. | Kenyan-English speaker approves both voices. Details, files and fallbacks in Audio.md. |
| Ambience and opening cues | Shop ambience loop, door chime, till and phone buzz in the opening, each switchable under Audio & captions. Workspace confirmation sounds and music are not included. | Sound editor may replace any file in place; see Audio.md. |
| MIVA identity and typography | Official MIVA Open University logo, white vector lockup (app/assets/brand/miva-open-university.svg, from the brand kit), on the splash; locally bundled Afacad / Manrope, including OFL notices. | Identity owner confirms logo use. |
| Debrief recap pictures and store loop | Temporary picture crops of zuri-shop.jpg in app/assets/debrief/. The store loop in app/assets/video/ is generated with Kling 4.0 at 720p; its master is in production/debrief-source/. | Replace in place. Slots, specs, behaviour and generation prompts are in Debrief-media.md. |

## Grace’s shop briefing edit
| Approximate time | Picture | Speech / purpose |
|---|---|---|
| 0–14.5s | Nairobi morning street into a homeware shop, then shelves, till and invoices. | Narrator introduces the shop and its automated posting system. |
| 14.5–26.5s | Grace at laptop; customer paying by mobile money. Retain the shop, costume and counter from the still. | Grace explains the month-end problem. |
| 26.5–42s | Handwritten sales notebook, source document, laptop pilot dashboard. | Narrator assigns the learner’s role and task. |
| 42–57s | Hold a readable, uncluttered view while the narrator names the assessment areas. | Preserve the speed and fictional-figures wording. |
| 57–62s | Settle on the title composition; render learner name and role in the interface. | Start prompt and title sting. |

Keep baked lettering off footage where the live UI supplies the same information. The actual production narration, caption timecodes and score sheet must match the final approved edit. Resume paused media from its pause point; mute/skip must preserve the visual transcript and access to Start. For final release verify delivery of shop ambience and Kenyan voices on target devices.

## Product cover and interaction motion
| Trigger | Element / timing | Function and completion |
|---|---|---|
| Splash opens | Wordmark, 1.8s hold | Continue and timer both dispatch to cover. |
| Cover mounts | Muted, inline 15.0s repeat; 24fps master | Product-only MP4 (or WebM) plays in its own region. Static DOM title and Start remain centred below. Each click on Start opens identity immediately and unmounts the player. |
| Reduced motion / media unavailable | Exact poster frame | Start remains active. A reduced-motion user can explicitly play. Media failure leaves the poster visible. |
| Pause animation / Play animation | Immediate | Preserve the current timestamp when paused. Resume from that timestamp. |
| Demonstration beats | Three 5s scenes; 0.5s overlap transitions | Cycle audit, trial balance, test console. Cursor and tint move to the selected posting; debit placement updates the register; test execution reveals the actual posting and success status. The sequence starts partway into the audit hold so its final and first frames meet at rest. Demo interactions never write learner evidence. |
| Shop briefing | 14.5s, 12s, 15.5s, 15s, 5s cue holds | Cue completion advances the caption; Pause preserves remaining duration. Settings suspend the timer; Skip or final cue opens role confirmation. |
| Workspace renders | Heading and inspector fade from 50% opacity and translate 3px to origin in 160ms ease-out | Data and input become active immediately. Reduced-motion preference removes the transition. |
| Row selection / hover | Background colour interpolation, 120ms | Selected ID drives its inspector on the same event. Correctness is indicated with text. |
| Corrections, regression, scoring | Synchronous amounts and labels | Update from the committed data first. Only accepted journals change suspense; repairs invalidate stale regression. Motion never controls a gate. |

### Re-rendering the product animation
The review composite is Cover-preview.mp4 (1920 × 1080). The live player uses app/assets/product-loop.mp4 plus a WebM fallback (1410 × 552). Both live files exclude the cover title and CTA. The poster is the first product-only frame. The source renderer is cover-source/render.cjs. With Node, the npm package sharp and ffmpeg on PATH, run the following from production/. These commands are optional for editing the video; playing the kit requires no such dependencies.

```sh
node cover-source/render.cjs Cover-preview.mp4
ffmpeg -i Cover-preview.mp4 -vf crop=1410:552:255:111 -an -c:v libx264 -crf 17 -pix_fmt yuv420p -movflags +faststart ../app/assets/product-loop.mp4
ffmpeg -i ../app/assets/product-loop.mp4 -frames:v 1 ../app/assets/product-poster.png
ffmpeg -i ../app/assets/product-loop.mp4 -an -c:v libvpx-vp9 -crf 34 -b:v 0 ../app/assets/product-loop.webm
```
