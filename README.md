# Jeeya & Smit · Shubh Vivah (wedding invitation website)

An illustrated, story-style wedding invitation made for phones, in the style of a Rajasthani palace video invite.

## What guests see

1. **The opening.** A monogram crest draws itself on ivory paper with watercolour roses. When the guest taps "Open the invitation", the music starts.
2. **The camera pulls back.** The monogram turns out to be painted in the sky of a carved sandstone arch, with a garden, a balustrade, a peacock and a lily pool.
3. **Save the date.** Butterflies fly in and form a heart, the couple walks in hand in hand, and "Save the date, Jeeya & Smit" appears in gold.
4. **Swiping walks along the palace.** Each swipe pans the camera to the next arch, with a parallax garden behind. The time of day moves on as the story goes, and each arch holds one part of the card:
   1. Save the date (day)
   2. Shri Ganesh blessing, with temple bells (dawn)
   3. The invitation, unrolling on a paper scroll (day)
   4. The bride's family (day)
   5. The groom's family (day)
   6. 9 December: Ganesh Pujan, Kirtan, Prasad, with marigold strings (morning)
   7. 11 December: Bhaat (Mayra), Tilakotsav (golden afternoon)
   8. 12 December: Haldi, Ashirwad Samaroh and dinner, with lanterns (dusk)
   9. Venue, countdown, map and "Save the dates" (night, with diyas)
   10. Family greetings: Darshanabhilashi, Vishesh Aagrah, Mithi Manuhar (night)
   11. "Awaiting your arrival", with call and WhatsApp buttons (moonlight, with the couple)

All the art is drawn in code (SVG), so there are no photos to download and nothing to license. It is plain HTML, CSS and JavaScript with no build step, so it hosts on Render or GitHub Pages as-is.

## How guests move through it

- **Phone:** swipe left or up to go forward, and right or down to go back. You can also tap: the right side goes forward, the left third goes back. A tap during the opening animation skips to the end of it.
- **Computer:** use the arrow buttons beside the story, the arrow keys, or the mouse wheel. The story shows as a phone-shaped frame.
- Each step has its own link (for example `#day-3`), so you can share a link that opens on one step.

## Files

| File | What it does |
| --- | --- |
| `content.js` | **All the wording, dates, times, names and phone numbers.** Edit this file for any detail. |
| `app.js` | The order of the scenes, each scene's time of day and decorations (`SLIDES`), and the camera, swipe, butterflies, couple walk, countdown, music and calendar download. |
| `art.js` | The illustrations: arch, pillars, garden, balustrade, pool, peacock, couple, lanterns, diyas, marigolds, bells, the monogram crest and the Ganesh line drawing. |
| `styles.css` | Type, layout and the small looping motions (lamps flicker, bells sway, water shimmers). |
| `index.html` | Page shell and link-preview tags (Open Graph, Twitter, JSON-LD). |
| `assets/music/wedding-theme.wav` | Placeholder instrumental. Replace it with your song. |
| `assets/og-image.jpg` | Share-preview image (1200 × 630). |
| `tools/make_music.py`, `tools/make_og.py` | Regenerate the placeholder music and the share image. |
| `render.yaml` | Render Blueprint for a static site. |

## Before you share

1. **Use your real address for link previews.** Deploy first, then in `index.html` replace every `YOUR-SITE-NAME.onrender.com` with your address. WhatsApp and Facebook do not run JavaScript, so these tags must be real text in the HTML.
2. **Swap in your music.** Put your file in `assets/music/` (MP3 works), then update `music.src` in `content.js`. Only use music you have the right to play.
3. **Check the details in `content.js`.** The card gives Mukundgarh Mandi for 9 December and Jamuna Resort, Jhunjhunu for 11 and 12 December, which is the most likely reading of the card. Change `place` if that is wrong.
4. Open the link on a phone, swipe through, and check the link preview.

## Run it on your computer

```bash
cd wedding-invitation
python -m http.server 8000
```

Then open <http://localhost:8000>. You need an internet connection for the fonts.

## Host on GitHub Pages (free)

1. Create a GitHub repository, for example `wedding-invitation`, and upload the contents of this folder to its root.
2. Go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
3. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`. Put that address in step 1 of **Before you share**.

## Host on Render (free static site)

- **Blueprint:** push the folder to GitHub, then in Render choose **New → Blueprint** and pick the repository. `render.yaml` sets everything up. If the folder is inside a bigger repo, set the root directory to `wedding-invitation`.
- **Static Site:** in Render choose **New → Static Site**. Set **Root Directory** to `wedding-invitation` only if it is in a subfolder, leave **Build Command** empty, and set **Publish Directory** to `.`.

## Notes

- The countdown counts to 7:15 PM IST on 12 December 2026 (the Ashirwad Samaroh).
- "Save the dates" downloads a `.ics` calendar file with every event.
- Music pauses when the guest switches apps and resumes when they come back.
- Visitors who have reduced motion turned on skip the camera moves, butterflies and walk, and see simple fades.
