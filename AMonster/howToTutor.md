Three steps, five minutes.

**1. Get an Anthropic API key**
Go to console.anthropic.com → API Keys → Create Key. Copy it.

**2. Open the file locally**
In `hologram-tutor.html`, find line 9:
```javascript
window.ANTHROPIC_API_KEY = 'YOUR_API_KEY_HERE';
```
Replace `YOUR_API_KEY_HERE` with your actual key. Save the file.

**3. Open in Chrome or Edge**
- Do NOT double-click the file (that opens as `file://` and blocks the microphone)
- Instead, run a local server from the folder where the file lives:

```bash
cd ~/Desktop/GTCT        # or wherever you saved it
python3 -m http.server 8080
```

Then open **http://localhost:8080/hologram-tutor.html** in Chrome or Edge.

---

**What you should see:**
- Dark stage with rotating rings, five persona cards at the bottom
- Click any persona (try Maryam or Ada first)
- Click **Begin** — she introduces herself and speaks
- Click **🎤 Speak** and ask her something — she responds and speaks back
- Paste an AXLE YouTube URL in the top-right field, click Load — video appears in the hologram circle

**If the mic doesn't work:** Chrome will ask for microphone permission the first time — allow it. If it still doesn't work, just type in the text box at the bottom instead.

**If the API call fails:** Open DevTools (F12) → Console — the error message will tell you exactly what's wrong (usually wrong key format or a billing issue on the Anthropic account).
