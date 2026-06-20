# Prasanth Chintapalli — Lead Software Engineer Portfolio

A modern, premium, single-page **static portfolio website** for a senior
engineering leader (Lead / Staff / Principal / Engineering Manager roles).

Dark theme · glassmorphism · animated hero network · smooth scroll reveals ·
animated counters & skill bars · interactive timeline · SVG system-design
diagrams with live data flow · fully responsive · accessible · SEO-ready ·
print-friendly. **No backend, no build step, no framework.**

---

## Quick start

It's pure HTML/CSS/JS — just open it.

```bash
# Option A: open directly
open index.html            # macOS  (use 'start' on Windows, 'xdg-open' on Linux)

# Option B: serve locally (recommended — avoids file:// quirks)
python3 -m http.server 8080
# then visit http://localhost:8080
```

---

## File structure

```
.
├── index.html              # Markup, all sections, SEO meta, JSON-LD
├── robots.txt              # Crawler directives + sitemap reference
├── sitemap.xml             # XML sitemap for search engines
├── README.md               # This file
└── assets/
    ├── css/
    │   └── styles.css      # Design tokens + all styling (commented by section)
    ├── js/
    │   └── main.js         # All interactions (commented by module)
    ├── img/
    │   └── profile.svg     # Profile photo PLACEHOLDER — replace with a real photo
    └── resume.txt          # Placeholder note — add your real resume.pdf here
```

---

## Sections

1. **Hero** — photo, name, title, executive summary, animated rotating
   keywords, particle/network canvas, typing code snippet, CTA buttons.
2. **Stats** — animated counters (experience, team size, projects, systems).
3. **About** — summary, leadership philosophy, principles, core strengths.
4. **Technical Expertise** — animated skill cards & bars (Backend, Cloud, Data, Frontend).
5. **Career Timeline** — interactive vertical timeline that animates on scroll.
6. **Major Projects** — cards with SVG architecture diagrams, scale & impact.
7. **System Design Showcase** — large SVG architecture diagram with animated data flow.
8. **Leadership & Impact** — animated metrics/counters + leadership cards.
9. **Certifications & Achievements** — interactive card grid.
10. **Contact** — email, LinkedIn, GitHub, download resume.

---

## Customization guide

All placeholder content is realistic but fictional. Replace it with yours.

### 1. Text content
Edit `index.html` directly. Each section is clearly marked with comments like
`<!-- 4. CAREER TIMELINE -->`. Update names, dates, companies, bullet points,
projects, certifications, etc.

### 2. Profile photo
Replace `assets/img/profile.svg` with a real square photo
(recommended **640×640**, JPG or PNG). Then update the `src` in the hero:

```html
<!-- index.html -->
<img class="profile-card__img" src="assets/img/profile.jpg" alt="Portrait of ...">
```

### 3. Resume download
Add your PDF as `assets/resume.pdf`. The "Download Resume" buttons already
point there. (Delete `assets/resume.txt` once done.)

### 4. Contact links
In the **Contact** section (and the JSON-LD block at the top of `index.html`),
replace:
- `prasanthkumar.cpk@gmail.com` → your email
- `https://www.linkedin.com/in/your-handle` → your LinkedIn
- `https://github.com/your-handle` → your GitHub

### 5. Stats & metrics
Counters use `data-count` (target number) and `data-suffix` (e.g. `+`):

```html
<div class="stat__num" data-count="12" data-suffix="+">0</div>
```

### 6. Skill bars
Each skill uses `data-level` (0–100); the bar fills to that percentage on scroll:

```html
<div class="skill"><span>Java</span><i data-level="95"></i></div>
```

### 7. Rotating hero keywords
Edit the `words` array in `assets/js/main.js` (Module 8).

### 8. Colors & theme
All colors live as CSS custom properties at the top of `assets/css/styles.css`
under `:root`. Tweak the brand gradient palette:

```css
--violet: #7c5cff;
--blue:   #27c0ff;
--green:  #2ee6a6;
--pink:   #ff7ac6;
```

---

## Print-friendly resume mode

The site ships with a dedicated `@media print` stylesheet. Press **Cmd/Ctrl+P**
to get a clean, single-column, light-background version (animations, nav,
canvas, and decorative elements are hidden automatically). Great for sharing
a quick PDF of the page itself.

---

## Accessibility & performance

- Respects `prefers-reduced-motion` — disables the particle canvas, parallax,
  typing, and rotating keywords, and reveals all content immediately.
- Semantic HTML5 landmarks, skip link, visible focus styles, `aria-*` labels.
- Animations use **transform/opacity** + `requestAnimationFrame` for 60 FPS.
- The hero canvas pauses when scrolled offscreen to save CPU/battery.
- Scroll handlers are throttled with `requestAnimationFrame`.
- Particle density is capped and scaled to viewport size.

---

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). Uses
`backdrop-filter`, Intersection Observer, and CSS custom properties — all
broadly supported. Graceful fallbacks are included where observers are absent.

---

## Deploy

Any static host works — no build needed:

- **GitHub Pages**: push to a repo, enable Pages on the branch root.
- **Netlify / Vercel / Cloudflare Pages**: drag-and-drop the folder or connect the repo.
- **S3 / any CDN**: upload the files as-is.

---

## License

Personal portfolio template — adapt freely for your own use.
