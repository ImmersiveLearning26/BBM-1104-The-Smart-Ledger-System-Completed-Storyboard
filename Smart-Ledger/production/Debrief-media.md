# Debrief recap media

The debrief opens with a two-slide visual recap (Debrief · 1 of 2 → Next → Debrief · 2 of 2 → View my results) over a silent store loop. The recap code is in `app/pages/debrief-recap.js`. Its styles are the `.recap*` rules at the end of `app/style.css`. All headings, explanations, figures and the fact chips are live HTML. Each slide is narrated (`voice/recap-0.mp3`, `recap-1.mp3`, not yet recorded; see Audio.md), and a music bed plays under the recap once `audio/music/debrief-bed.mp3` exists. The figures come from the learner's saved record (`cash(14100)`, `suspense(s)`, `s.report`, `s.repairs`).

## Asset slots
Replace a file in place, keeping its name, and no code change is needed. Paths are relative to `app/`.

| Slot | Shown | Spec | Current file |
|---|---|---|---|
| `assets/debrief/trace-difference.webp` | Slide 1 picture, 3:2 frame (16:10 on phones), `object-fit: cover` | 1800 × 1200 or 1200 × 800 WebP, quality ≈ 80, under 250 KB | **Temporary.** Crop of `zuri-shop.jpg` showing the counter: invoices, sales notebook, phone. No calculator or delivery receipt. |
| `assets/debrief/test-system.webp` | Slide 2 picture, same frame | Same as above | **Temporary.** Crop of `zuri-shop.jpg` showing Grace at the laptop. She is smiling slightly; the brief asks for a neutral, attentive expression. |
| `assets/video/zuri-store-loop.mp4` | Full-screen background, `object-fit: cover`, under a dark gradient | 1920 × 1080 (or 1600 × 900), H.264, yuv420p, 24 fps, 8–12 s, no audio track, `+faststart`, under 3 MB | **Generated (Kling 4.0, 720p).** 1280 × 720, 24 fps, 9.5 s, silent, 0.9 MB. Grace reads, glances at the notebook, turns a page and settles back at the laptop. Camera locked. See *Store loop as generated* below. |
| `assets/video/zuri-store-poster.webp` | Video poster, reduced-motion still, failure fallback, and the CSS background shown before the video loads | The exact first frame of the final loop | **Generated.** First frame of the Kling loop. |

When the final media arrives, update the two `alt` strings in `recapSlides` (`app/pages/debrief-recap.js`) so they describe the new pictures.

## Store loop as generated
- **Model:** Kling 4.0 (`kling4_0`) on Higgsfield, image-to-video, 720p, 10 s, 16:9. Cost: 22.5 credits.
- **Keyframes:** `app/assets/zuri-shop.jpg` as both `start_image` and `end_image`, so the clip returns to its opening pose.
- **Prompt:** the *Store loop* prompt below, shortened to a locked camera and one page-turn.
- **Master:** `production/debrief-source/kling4-store-master-720p.mp4` is the untouched download: 1284 × 724, 241 frames, with an AAC track Kling added.
- **Seam:** the last 12 frames are blended frame by frame into the first 12, and playback starts at frame 12. Ignoring film grain, the loop point (SSIM 0.993) is smoother than an ordinary mid-clip step (0.990).

Rebuild the delivered loop from the master, from `production/`:

```sh
ffmpeg -i debrief-source/kling4-store-master-720p.mp4 -an -filter_complex "[0:v]crop=1280:720:2:2,setsar=1,format=yuv444p,split=3[a][b][c];[a]trim=start_frame=0:end_frame=12,setpts=N/24/TB[head];[b]trim=start_frame=12:end_frame=228,setpts=N/24/TB[body];[c]trim=start_frame=228:end_frame=240,setpts=N/24/TB[tail];[tail][head]blend=all_expr='A*(1-N/11)+B*(N/11)',setpts=N/24/TB[seam];[body][seam]concat=n=2:v=1:a=0,format=yuv420p[out]" -map "[out]" -r 24 -c:v libx264 -crf 20 -preset slow -movflags +faststart ../app/assets/video/zuri-store-loop.mp4
ffmpeg -i ../app/assets/video/zuri-store-loop.mp4 -frames:v 1 -c:v libwebp -quality 82 ../app/assets/video/zuri-store-poster.webp
```

### Rebuild the temporary pictures
Run from `app/assets/` (ffmpeg 6 with libx264 and libwebp).:

```sh
ffmpeg -y -i zuri-shop.jpg -vf "crop=800:533:520:408,scale=1200:800:flags=lanczos" -c:v libwebp -quality 82 debrief/trace-difference.webp
ffmpeg -y -i zuri-shop.jpg -vf "crop=742:495:930:110,scale=1200:800:flags=lanczos" -c:v libwebp -quality 82 debrief/test-system.webp
```

### Encode the final media
```sh
ffmpeg -i master.mov -t 10 -an -vf "scale=1920:1080:flags=lanczos,fps=24,format=yuv420p" -c:v libx264 -crf 21 -preset slow -movflags +faststart video/zuri-store-loop.mp4
ffmpeg -i video/zuri-store-loop.mp4 -frames:v 1 -c:v libwebp -quality 80 video/zuri-store-poster.webp
ffmpeg -i picture.png -vf "scale=1800:1200:flags=lanczos" -c:v libwebp -quality 80 debrief/trace-difference.webp
```

## Generation prompts
Attach `app/assets/zuri-shop.jpg` as the reference image for continuity. Keep every output free of text overlays, captions, logos, watermarks and on-screen interface.

### Picture 1 · Trace the difference (3:2, 1800 × 1200)
> Realistic overhead photograph looking straight down at a worn wooden shop counter in a small homeware shop in Nairobi, Kenya. On the counter, tidily arranged: a small stack of printed supplier invoices, one delivery receipt, an open handwritten sales notebook with a pen, a basic desk calculator, and a smartphone lying face down. Natural morning daylight from a window on the right, soft shadows, warm wood tones, deep green and cream enamel accents matching the reference shop. Physically believable objects with correct proportions, no hands, no people. Paper is blank or has illegible, unreadable figures. No legible text, numbers, logos or brand names. Documentary editorial style, 35mm lens, shallow but even focus, tidy composition with breathing room at the edges.

Negative prompt: legible text, readable numbers, logos, brand names, watermark, extra fingers, warped calculator keys, melted objects, clutter, harsh flash, studio backdrop.

### Picture 2 · Test the system (3:2, 1800 × 1200)
> Realistic photograph of Grace Achieng, a Black Kenyan woman in her early fifties who owns a small homeware shop in Nairobi, seated at the same worn wooden counter reviewing a silver laptop. Keep her appearance identical to the reference image: dark loc updo, small gold hoop earrings, deep forest-green button-up shirt with rolled sleeves, gold wristwatch. Neutral, attentive expression, eyes on the screen, not smiling, not posing for the camera. Background: the reference shop's wooden shelves with green and cream floral enamel pots, kettles, woven baskets and a barred window with soft daylight. Sales notebook and phone on the counter. The laptop screen faces away from the camera. Natural morning light, three-quarter view from slightly left, 50mm lens, documentary editorial realism.

Negative prompt: visible screen content, text, logos, watermark, exaggerated smile, glamour retouching, changed outfit, different hairstyle, extra fingers, distorted hands.

### Store loop · background (16:9, 1920 × 1080, 10 s, 24 fps, silent)
> Locked-off, static-camera cinematic shot inside Zuri Home Supplies, a small homeware shop in Nairobi, matching the reference image exactly: wooden shelves of green and cream floral enamel cookware, kettles, woven baskets, a barred window with soft morning daylight. Grace Achieng (dark loc updo, gold hoop earrings, forest-green shirt, gold watch) sits at the worn wooden counter reviewing her laptop, with invoices, an open sales notebook and a mobile-money phone beside her. She makes only small natural movements: reads the screen, glances down at the notebook, turns a page, looks back to the laptop. The camera stays still or drifts almost imperceptibly. Calm, realistic, natural light with gentle dust in the window light. She ends in the same pose she starts in so the clip loops seamlessly. No camera cuts, no text, no captions, no logos, no on-screen interface, no audio.

Settings: 10 s, 24 fps, 16:9, static camera, first frame equal to last frame. Use first-and-last-frame conditioning with the same still if the model supports it. If the ends don't match, trim to the closest matching frames and add a 0.5 s crossfade from the tail into the head.

## Behaviour (implemented and tested)
| Situation | Result |
|---|---|
| Normal motion | `autoplay muted loop playsinline`. The **Pause background / Play background** control keeps the current time. |
| `prefers-reduced-motion: reduce` | No autoplay. The poster shows, and the learner can press Play background. |
| Video blocked or missing | The poster stays visible and the control hides. Next and View my results still work. |
| Picture blocked or missing | A tinted frame shows in its place, and the `alt` text stays on the frame for screen readers. |
| Slide change | 300 ms opacity crossfade, instant with reduced motion. Focus moves to the new heading. The hidden slide is out of the tab order. |
| Reload during the recap | The recap restarts at slide 1. |
| After View my results | `recapDone` is saved. Reload, *View debrief* from Finish, and facilitator re-marking all open the results directly. |

`node verification/browser.cjs` drives both slides and saves the `P16b-recap-trace` and `P16c-recap-test` references.
