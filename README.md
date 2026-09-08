# Simple Teleprompter (Static)

How to run locally:
1. Save the three files (index.html, styles.css, script.js) in a folder.
2. Open index.html in a browser (Chrome/Edge/Firefox).
3. Paste or load a .txt script, press "Start".

Deploy:
- GitHub Pages:
  1. git init; git add .; git commit -m "teleprompter";
  2. push to a GitHub repo.
  3. In repo Settings → Pages, choose the default branch and root (or `gh-pages` branch).
  4. Visit the published URL.

- Vercel/Netlify:
  - Connect your repo and they will auto-deploy a static site.

Notes:
- Speed is px/sec. Increase speed to scroll faster.
- Use Mirror mode if you need to reflect text for a teleprompter glass.
- Use Fullscreen for distraction-free display.

Mobile behavior:
- On small screens (<=900px) the input area and control buttons are hidden automatically when you start the teleprompter.
- Pause or Reset will restore the input UI so you can make edits.
