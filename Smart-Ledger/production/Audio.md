# Voices and shop sound

Grace and the narrator are recorded. The recordings cover the five introduction cues, the four scene briefings (Grace, then the narrator) and Grace's closing line. The opening also has shop ambience, a door chime, a till and a mobile-money phone buzz. Live feedback and hints stay on the device voice.

## What plays where
| Moment | Audio | Code |
|---|---|---|
| Name entered → introduction | Cue 0 narration, door chime, ambience fades in to 35% | `introVoice(0)`, `introSounds(0)` |
| Each caption cue | That cue's recording. Cue 1 adds the till; cue 2 adds the phone buzz. | `scheduleCue()` |
| Title card | Ambience continues | `go()` keeps it for `intro` and `title` |
| Open the ledger / June ledger / test console | Scene briefing: Grace, then the narrator | `briefVoice(0/1/2)` |
| Briefing button (any scene) | That scene's briefing. Closing the dialog stops it. | `case 'brief'` |
| Finish | Grace: “Thank you for staying with the numbers until they made sense.” | `closingVoice()` |

The cue timing keeps the original holds (14.5 s, 12 s, 15.5 s, 15 s, 5 s). A recording longer than its hold extends that cue to its length plus 0.9 s (`cueHold`). Every current line fits inside its hold.

## Controls and fallbacks
- **Audio & captions** has four switches: subtitles; recorded voices; shop sounds; device voice for feedback. Recorded voices and shop sounds default to on. Saves made before this change also read as on.
- **Pause** in the introduction pauses the voice and ambience and keeps their position. **Settings** pauses them while open. **Skip** stops the voice. Leaving the title card stops all shop sound. Every page change stops the current line.
- If a recording is missing, blocked or refused by the browser's autoplay rules, the line falls back to the device voice when that switch is on, otherwise to silence. Captions, cue timing and every button carry on regardless.

## Files
| Path | Content |
|---|---|
| `app/assets/audio/voice/intro-0…4.mp3` | Introduction cues 0–4 (cue 1 is Grace) |
| `app/assets/audio/voice/brief-N-grace.mp3`, `brief-N-narrator.mp3` | Scene briefings 0–3 |
| `app/assets/audio/voice/closing-grace.mp3` | Closing line |
| `app/assets/audio/sfx/shop-ambience.mp3` | 18.6 s loop with a crossfaded seam, −24 LUFS |
| `app/assets/audio/sfx/door-chime.mp3`, `till.mp3`, `phone.mp3` | One-shots, −20 LUFS |
| `app/audio-manifest.js` | Clip paths and durations; `app/audio.js` plays them |
| `production/audio-masters/` | Untouched downloads, before levelling |

Voices: Eleven v4 (`elevenlabs_v4`) through Higgsfield. Grace uses the account's custom voice **Joy**; the narrator uses **Dr. Omondi (Lecturer)**. Sound effects: Mirelo text-to-audio through Higgsfield. The voices were levelled to −16 LUFS, mono, 96 kbps.

**Release check:** have a Kenyan-English speaker listen to both voices. Neither voice could be auditioned by ear while building, and Joy in particular was chosen as the closest available fit for a woman in her fifties. To replace a line, keep its file name and update its `dur` in `app/audio-manifest.js`, or re-run the levelling:

```sh
ffmpeg -i new-line.mp3 -af "loudnorm=I=-16:TP=-1.5:LRA=11,aresample=44100" -ac 1 -c:a libmp3lame -b:a 96k app/assets/audio/voice/brief-0-grace.mp3
```

`node verification/audio.cjs` checks the whole audio path, including blocked audio.
