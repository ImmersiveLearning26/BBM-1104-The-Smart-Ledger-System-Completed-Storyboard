# Voices and shop sound

Grace and the narrator are recorded for the five introduction cues, the four scene briefings (Grace, then the narrator) and Grace's closing line. The opening has shop ambience, a door chime, a till and a mobile-money phone buzz. Every graded answer plays a soft confirm or correction cue.

Feedback, hints and the two recap slides are fully scripted: 94 lines in `production/voice-lines.json`, of which 14 are recorded and 80 are still to record. A line plays its recording once the file exists. Until then it uses the device voice, when **Read feedback and hints aloud** is on.

## What plays where
| Moment | Audio | Code |
|---|---|---|
| Name entered → introduction | Cue 0 narration, door chime, ambience fades in to 35% | `introVoice(0)`, `introSounds(0)` |
| Each caption cue | That cue's recording. Cue 1 adds the till; cue 2 adds the phone buzz. | `scheduleCue()` |
| Title card | Ambience continues | `go()` keeps it for `intro` and `title` |
| Open the ledger / June ledger / test console | Scene briefing: Grace, then the narrator | `briefVoice(0/1/2)` |
| Briefing button (any scene) | That scene's briefing. Closing the dialog stops it. | `case 'brief'` |
| Finish | Grace: “Thank you for staying with the numbers until they made sense.” | `closingVoice()` |
| Feedback and hints (when *Read feedback and hints aloud* is on) | The message split into scripted segments and played in order, e.g. “Check the debit account (asset).” + “Hint:” + the rule. Falls back to the device voice if any segment is unrecorded. | `say()` in app.js, `segmentLine()` |
| Each recap slide | Narrator reads the heading and explanation | `recapVoice(i)` |
| Any graded answer | `confirm.mp3` or `correction.mp3`, 35% volume | `onRecord` hook in engine.js |
| Debrief recap | Music bed, 18% volume, when the file exists | `startMusic()` |

The cue timing keeps the original holds (14.5 s, 12 s, 15.5 s, 15 s, 5 s). A recording longer than its hold extends that cue to its length plus 0.9 s (`cueHold`). Every current line fits inside its hold.

## Controls and fallbacks
- **Audio & captions** has four switches:
  - Subtitles.
  - Recorded voices (on by default).
  - Sounds: ambience, answer cues and music (on by default).
  - Read feedback and hints aloud (off by default).
  Saves made before these switches existed read recorded voices and sounds as on.
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
| `app/assets/audio/sfx/confirm.mp3`, `correction.mp3` | Answer cues, synthesised with ffmpeg (a rising two-note chime and a soft falling tone) |
| `app/assets/audio/feedback/NNN-*.mp3`, `voice/recap-0.mp3`, `voice/recap-1.mp3` | **To record:** the file names are listed in `production/voice-lines.json` |
| `app/assets/audio/music/debrief-bed.mp3` | **Empty slot:** recap music bed |
| `production/voice-lines.json` | Every scripted line: speaker, voice, display text, the text to read, file, recorded yes/no |
| `production/build-voice-lines.cjs` | Rebuilds the script and `app/audio-manifest.js` from the curriculum and the files present |
| `app/audio-manifest.js` | Generated: clip paths and durations; `app/audio.js` plays them |
| `production/audio-masters/` | Untouched downloads, before levelling |

Voices: Eleven v4 (`elevenlabs_v4`) through Higgsfield. Grace uses the account's custom voice **Joy**; the narrator uses **Dr. Omondi (Lecturer)**. Sound effects: Mirelo text-to-audio through Higgsfield. The voices were levelled to −16 LUFS, mono, 96 kbps.

**Release check:** have a Kenyan-English speaker listen to both voices. Neither voice could be auditioned by ear while building, and Joy in particular was chosen as the closest available fit for a woman in her fifties. To replace a line, keep its file name, level it as below, then run `node production/build-voice-lines.cjs` to refresh its duration in `app/audio-manifest.js`:

```sh
ffmpeg -i new-line.mp3 -af "loudnorm=I=-16:TP=-1.5:LRA=11,aresample=44100" -ac 1 -c:a libmp3lame -b:a 96k app/assets/audio/voice/brief-0-grace.mp3
```

## Recording the remaining lines
1. For each entry in `production/voice-lines.json` with `"recorded": false`, generate the `spoken` text. Use Higgsfield model `elevenlabs_v4` with `voice_type: "element"` and the entry's `higgsfield_element`: the narrator for every feedback and recap line. Any other TTS works too, with an approved Kenyan-English voice.
2. Save each result at `app/assets/audio/<file>`, then level it:
   ```sh
   for f in app/assets/audio/feedback/*.mp3 app/assets/audio/voice/recap-*.mp3; do ffmpeg -y -i "$f" -af "loudnorm=I=-16:TP=-1.5:LRA=11,aresample=44100" -ac 1 -c:a libmp3lame -b:a 96k "$f.tmp.mp3" && mv "$f.tmp.mp3" "$f"; done
   ```
3. Run `node production/build-voice-lines.cjs`. The new files are wired in automatically, and it reports how many lines are still to record.

At about 0.7 Higgsfield credits a line, the 80 lines cost roughly 55 credits.

### Recap music bed
Use ElevenLabs Music v2 through Higgsfield (`elevenlabs_music_v2`), instrumental, 60 s:
> Calm, warm instrumental bed for a learning debrief: soft East African acoustic guitar and light marimba over a gentle pad, slow 80 bpm, hopeful and reflective, no vocals, no drums, even dynamics so speech sits on top, seamless loop.

Save it as `app/assets/audio/music/debrief-bed.mp3`, level it to about −26 LUFS, and re-run the builder.

`node verification/audio.cjs` checks the whole audio path: blocked audio, feedback segmenting, answer cues and the recorded/device fallback. `node verification/browser.cjs` fails if any feedback message the app can show is missing from the voice script.
