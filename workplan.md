# ZUBBY (formerly JABEE) Brand Storytelling Website — Project Workplan

> **Purpose:** This document is the single source of truth for any AI agent or developer working on this project.  
> Reading this file alone is enough to fully understand what was built, why, how it works, and what still needs to be done — no chat history required.

---

## 1. What Is ZUBBY?

**ZUBBY** (formerly JABEE) is a ride-booking app for office professionals in Burdwan, West Bengal, India.  
- **Tagline:** "Go On" / "Office professionals' favourite ride booking app."  
- **Core Value Proposition:** Fixed daily motorcycle captains for office commuters. Same captain, same time, same fare — every weekday. Zero surge pricing, zero rebooking.  
- **Contact / Support:** support@zubby.in  
- **Company Location:** Burdwan, West Bengal, India  
- **App Platform:** Android (Google Play)  

---

## 2. What This Codebase Is

This is a **brand storytelling website** for ZUBBY — a single-page marketing site that narrates the commuter's journey through cinematic scroll-driven sections, character animations, and a full bike reveal animation.

**Not** an app dashboard or e-commerce site. It is a **pure marketing/brand showcase** for:
1. Telling the commuter's pain story visually
2. Revealing the ZUBBY bike as the solution
3. Showcasing features and team
4. Driving Google Play downloads

---

## 3. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 14** (App Router) |
| Language | **JavaScript** (not TypeScript) |
| Styling | **Tailwind CSS v3** + custom CSS in `globals.css` |
| Scroll Engine | **Lenis** (`lenis@^1.3.26`) — smooth scroll library |
| Animation | **GSAP** + **ScrollTrigger** (`gsap@^3.15.0`) |
| Icons | **Lucide React** (`lucide-react@^0.453.0`) |
| Image Processing | **Sharp** (dev only — runs `node convert-frames.mjs` to generate WebP frame sequences) |
| Fonts | Google Fonts — **Poppins** (body) + **Montserrat** (display/headings) |
| Package Manager | **npm** |
| Dev Server | `npm run dev` on `localhost:3000` |

### Key `package.json` scripts
```json
"dev"   : "next dev"
"build" : "next build"
"start" : "next start"
"lint"  : "next lint"
```

---

## 4. Project Directory Structure

```
D:\CODING\JABEE\
├── convert-frames.mjs          # One-time utility: converts PNG frames → WebP
├── next.config.js              # Next.js config (reactStrictMode, image remotePatterns)
├── tailwind.config.js          # Tailwind theme extensions
├── package.json
├── postcss.config.js
│
├── public/                     # All static assets
│   ├── logo-white.png          # Full brand logo: "Jabee Go On" — black on white BG (3286×1312)
│   ├── brandIcon.png           # Square icon logo with orange ring (2016×2116, transparent BG)
│   ├── jabeeLogo.jpg           # 3D Lego-style logo (1405×292)
│   ├── Bike.jpg                # Hero bike photo
│   ├── jabeebikeparts.png      # Bike parts exploded view
│   ├── character1.jpg          # Character 1 — office professional (thumbnail)
│   ├── character2.jpg          # Character 2 — waiting at gate (thumbnail)
│   ├── character2Fullsize.jpg  # Character 2 full body
│   ├── character2bg.png        # Character 2 full background scene
│   ├── character3.jpg          # Character 3 — stressed, dark scene (thumbnail)
│   ├── character3Fullsize2.jpg # Character 3 full body
│   ├── character3bg.png        # Character 3 full background scene
│   ├── character4.jpg          # Character 4 — relieved, bright office (thumbnail)
│   ├── character4Fullsize.jpg  # Character 4 full body
│   ├── character4bg.png        # Character 4 full background scene
│   │
│   ├── logoAnimation/          # 150 WebP frames (frame-001.webp … frame-150.webp)
│   │                             Used in LoadingScreen as the animated logo intro
│   │
│   ├── character1Animation/    # 150 WebP frames (frame-001.webp … frame-150.webp)
│   │                             Used in Character1ScrollCanvas — scroll-driven character walk-in
│   │
│   └── bikeAnimation/          # 200 WebP frames (frame-001.webp … frame-200.webp)
│                                 Used in BikeScrollCanvas — scroll-driven bike build-up reveal
│
├── src/
│   ├── app/
│   │   ├── layout.js           # Root layout: metadata, fonts, body classes
│   │   ├── page.js             # MAIN PAGE — entire single-page website (924 lines)
│   │   └── globals.css         # Tailwind imports + custom animations/utilities
│   │
│   ├── components/
│   │   ├── LoadingScreen.jsx   # Preload gate: plays logoAnimation, blocks scroll until ready
│   │   ├── SmoothScroll.jsx    # Lenis + GSAP ScrollTrigger integration (renders null)
│   │   ├── Character1ScrollCanvas.jsx  # Scroll-driven canvas animation for Character 1
│   │   └── BikeScrollCanvas.jsx        # Scroll-driven canvas animation for bike reveal
│   │
│   └── hooks/
│       ├── useFrameSequence.js # Shared module-level image cache + loading hook
│       └── frameEaser.js       # GSAP-ticker-based frame interpolation (smooth frame transitions)
│
└── stitch_jabee_brand_storytelling_website/  # Design reference files (Figma/Stitch exports)
    ├── jabee-mainpage-for-mobileOnly/        # Mobile-specific design screens
    ├── jabee_sharp_storytelling_complete_brand_experience-main/  # Full desktop design
    ├── jabee_brand_storytelling_website-for_bottompart_only/     # Bottom section designs
    ├── jabee_color_system_swatch_card/       # Official brand color swatches
    ├── brandicon.jpeg, brandlogo.jpeg        # Raw brand assets
    └── character*fullsize*.jpg              # Reference character images
```

---

## 5. Color System & Brand Identity

### Official Palette (from `tailwind.config.js`)
| Name | Hex | Usage |
|------|-----|-------|
| `jabee-orange` | `#FF6B1A` | Primary accent — CTAs, highlights, glows |
| `jabee-orangeDark` | `#E0550B` | Hover state for orange |
| `jabee-orangeLight` | `#FFF2EB` | Light tint backgrounds |
| `jabee-black` | `#111111` | Primary text color |
| `jabee-darkBg` | `#0B0D12` | Dark section background (Scene 3) |
| `jabee-warmGrey` | `#CFCBC6` | Transition/connector section background |
| `jabee-studioBg` | `#F6F5F2` | Default warm off-white background |
| `jabee-officeBg` | `#EAE6DF` | Office/warm section (Scene 4) |

### Fonts
- **Body:** Poppins (300–800 weights)
- **Display/Headings:** Montserrat (300–900 weights)
- Both imported from Google Fonts in `globals.css`

---

## 6. Page Sections (Full Scroll Journey)

The entire website lives in `src/app/page.js`. Every major section has both **Desktop** and **Mobile** variants (using `hidden lg:flex` / `block lg:hidden` Tailwind classes).

### Section Map

| Order | Section ID | Title | Background | Nav Mode |
|-------|-----------|-------|-----------|----------|
| 1 | `#story` / `#story-mobile` | Character 1 — "The Office Professional" | `#F6F5F2` (studio warm) | dark |
| 2 | _(no id)_ | Character 2 — "Same Journey Every Day" | `#CFCBC6` + `character2bg.png` | dark |
| 3 | _(no id)_ | Character 3 — "Then The Stress Begins" | `#0B0D12` (dark) + `character3bg.png` | light |
| 4 | _(no id)_ | Character 4 — "What If?" (Resolution) | `#EAE6DF` + `character4bg.png` | dark |
| 5 | `#bike-reveal-container` / `#bike-reveal-mobile` | Bike Reveal — "The Transformation" | White | dark |
| 6 | `#download-section` | Brand CTA + Google Play Download | White→`#F9F8F5` | — |
| 7 | `#team` | Meet the JABEE Team | `#FAFAFA` | dark |
| 8 | `#features` | App Features Grid (9 features) | White | dark |
| 9 | Footer | Links + Copyright | `#0B0D12` (jabee-black) | light |

### Navbar
- **Fixed position**, `z-40`
- Logo: text-based "JABEE." (orange period) — *TODO: replace with `logo-white.png` image*
- Nav links: Story, The Revelation, Features, Team
- CTA button: "Download App" → `#download-section`
- **Adaptive behavior:**
  - Transparent when at top
  - Dark frosted glass (`bg-[#0B0D12]/90`) when `navMode === 'light'` (dark sections)
  - White frosted glass (`bg-white/90`) when `navMode === 'dark'` (light sections)
- `data-nav-mode` attribute on each `<section>` drives the navbar color switching

### Scroll Progress Bar
- Fixed 3px bar at very top of viewport, `z-50`
- Fills with `jabee-orange` as user scrolls
- Has glow shadow: `shadow-[0_0_8px_#FF6B1A]`

---

## 7. Animation Systems

### 7A. Loading Screen (`LoadingScreen.jsx`)

**Flow:**
1. On mount, body scroll is locked (`overflow: hidden`)
2. Preloads two critical frame sets in parallel:
   - `logoAnimation`: 150 frames → plays as loading progress bar fills
   - `character1Animation`: 150 frames → needed immediately after loader exits
3. Minimum load time: **2500ms** (prevents flash on fast connections)
4. Maximum wait: **10000ms** (fallback on slow connections)
5. Progress bar + percentage counter shown
6. Exit: expands + fades (scale 1 → 1.5, opacity 0, blur) over **700ms**
7. On complete: `isLoading` state in `page.js` is set to `false`

**Canvas:** 1280×720 logical pixels, CSS-scaled to `max-h-[60vh]`

### 7B. Character 1 Scroll Animation (`Character1ScrollCanvas.jsx`)

- **Frames:** 150 WebP frames from `public/character1Animation/`
- **Trigger:** `#story` (desktop) or `#story-mobile` (mobile)
- **Behavior:** ScrollTrigger pins the section, scrubs 0→149 frames over 1200px of scroll
- **Smoothing:** `FRAME_EASE = 0.18` — frames ease toward target via `createFrameEaser`
- **Canvas:** 1280×720 logical, CSS `max-h-[580px] mix-blend-multiply`
- **mix-blend-multiply** makes the white background of the PNG frames invisible against the page background

### 7C. Bike Scroll Animation (`BikeScrollCanvas.jsx`)

- **Frames:** 200 WebP frames from `public/bikeAnimation/`
- **Trigger:** `#bike-canvas-pin` (desktop) or `#bike-reveal-mobile` (mobile)
- **Behavior:** ScrollTrigger pins the section, scrubs 0→199 frames over 1300px of scroll
- **Smoothing:** `FRAME_EASE = 0.18`
- **Loading:** Lazy (starts only after `isLoading === false`) — does NOT block the preloader
- **Canvas:** 1280×720 logical, CSS `max-h-[650px]`, `scale-[1.04]` on mobile for fullness

### 7D. Smooth Scroll (`SmoothScroll.jsx`)

- Uses **Lenis** smooth scroll library
- **Normal zones:** `lerp: 0.12, syncTouchLerp: 0.16` (light smoothing)
- **Animation zones** (when a pinned ScrollTrigger is active): `lerp: 0.07, syncTouchLerp: 0.06` (extra smooth for frame scrubbing)
- Automatically detects when user is in an animation section and adjusts easing
- `anchors: { offset: -70 }` to account for fixed navbar height
- `ScrollTrigger.config({ ignoreMobileResize: true })` prevents jitter from mobile address bar

### 7E. Reveal Animations (CSS + IntersectionObserver)

Three CSS classes trigger on scroll via IntersectionObserver in `page.js`:
- `.reveal-on-scroll` — fade up (translateY 24px → 0)
- `.reveal-from-left` — slide from left (translateX -30px → 0)
- `.reveal-from-right` — slide from right (translateX 30px → 0)

All use `cubic-bezier(0.16, 1, 0.3, 1)` spring easing, 0.8s duration.

### 7F. Frame Easer (`frameEaser.js`)

- Pure GSAP ticker-based interpolation — works independently of scroll method
- Frame-rate independent: uses `gsap.ticker.deltaRatio()` for 60Hz/120Hz parity
- Self-stopping: removes itself from the ticker when `current === target`
- API: `createFrameEaser({ ease, onFrame })` → `{ setTarget(value), kill() }`

---

## 8. Image Loading System (`useFrameSequence.js`)

### Architecture
- **Module-level `Map` cache** — all components sharing the same folder get the same `Image` object instances (desktop + mobile canvases, loader + scroll canvas)
- Loading is started once per folder — subsequent calls return the existing entry
- Frames load in batches of 8 to avoid flooding the network

### `loadSequence(folder, count, onProgress?)`
- Starts loading `frame-001.webp` through `frame-{count}.webp` from `/{folder}/`
- Returns the cache entry: `{ frames, promise, listeners, loaded }`
- Progress callback receives fraction 0→1

### `useFrameSequence(folder, count, { eager, trackProgress })`
- React hook wrapper around `loadSequence`
- `eager: false` delays loading until component decides to start (used by BikeScrollCanvas to wait for loader to exit)
- Returns `{ framesRef, progress, ready }`

### `nearestLoaded(frames, index)`
- Always returns the closest loaded frame to `index` — never draws a blank canvas even mid-load

### Frame File Naming Convention
```
public/{folder}/frame-001.webp
public/{folder}/frame-002.webp
...
public/{folder}/frame-{count}.webp   (zero-padded to 3 digits)
```

---

## 9. Frame Generation Tool (`convert-frames.mjs`)

Run once after adding PNG source frames:
```bash
node convert-frames.mjs
```

- Reads `public/{folder}/ezgif-frame-###.png` files
- Resizes to **1280px wide**, converts to **WebP quality 75**
- Outputs `public/{folder}/frame-###.webp`
- Covers folders: `bikeAnimation`, `character1Animation`, `logoAnimation`
- Originals (PNG) are left in place — delete manually after verification

**Current frame counts:**
| Folder | Frames | Source |
|--------|--------|--------|
| `logoAnimation` | 150 | JABEE logo animation |
| `character1Animation` | 150 | Character 1 walk-in animation |
| `bikeAnimation` | 200 | Bike build-up reveal animation |

---

## 10. State Management (page.js)

All state lives in `page.js` — there is no Redux, Zustand, or context.

```js
const [scrollProgress, setScrollProgress] = useState(0);    // 0–100 for progress bar
const [navScrolled, setNavScrolled] = useState(false);       // toggles nav background
const [navMode, setNavMode] = useState('dark');              // 'dark' | 'light'
const [isLoading, setIsLoading] = useState(true);            // controls loading screen + deferred loading
```

`isLoading` is the most critical state. When `true`:
- Loading screen is visible
- Lenis scroll is stopped
- BikeScrollCanvas does not start loading frames
- Character1ScrollCanvas and BikeScrollCanvas do not register ScrollTriggers

---

## 11. Responsive Design Strategy

### Breakpoint
- **Mobile:** `< 1024px` (`lg` breakpoint)
- **Desktop:** `≥ 1024px`

### Pattern
Every story section is duplicated:
```jsx
{/* DESKTOP VIEW */}
<section className="hidden lg:flex ...">
  {/* Full-layout grid with large text and side-by-side animation */}
</section>

{/* MOBILE VIEW */}
<section className="block lg:hidden ...">
  {/* Stacked layout: animation on top, text card below */}
</section>
```

### Mobile-specific Design Notes
- Character 1 animation canvas appears **above** the text card
- Background colors blend smoothly: Character 2 (`#CFCBC6`) → Character 3 (`#CFCBC6` dark overlay) → Character 4 (`#CFCBC6` to `#EAE6DF` gradient) — no harsh dark gradient
- Bike canvas is wider on mobile (`scale-[1.04]`)
- All font sizes are smaller with separate `text-[XXpx]` values

---

## 12. Tailwind Custom Utilities (globals.css)

| Class | Effect |
|-------|--------|
| `.reveal-on-scroll` | Fade+slide up on scroll |
| `.reveal-from-left` | Slide in from left |
| `.reveal-from-right` | Slide in from right |
| `.animate-float-1` | Float animation 4s |
| `.animate-float-2` | Float animation 4.8s (reversed) |
| `.animate-float-3` | Float animation 5.5s |
| `.glass-card` | White glassmorphism card (rgba 94% white, blur 12px) |
| `.dark-glass-card` | Dark glassmorphism (rgba 88% dark, blur 14px) |
| `.spotlight-glow` | Orange radial spotlight overlay |
| `.mask-fade-soft` | Radial gradient mask (soft fade) |
| `.mask-fade-edges` | Circle gradient mask (edge fade) |
| `.no-scrollbar` | Hides scrollbar (all browsers) |

---

## 13. Story Narrative (What the Sections Communicate)

The website tells a **4-act story** before revealing the product:

| Act | Character | Emotion | Message |
|-----|-----------|---------|---------|
| 1 | **Character 1** (office professional, animated) | Neutral/routine | "Every weekday, the same road to work." |
| 2 | **Character 2** (waiting at gate, warm grey) | Familiar/resigned | "Every morning, he books the same ride." |
| 3 | **Character 3** (stressed, dark scene) | Frustration/anxiety | "Prices jump. Captains cancel. Time runs out." |
| 4 | **Character 4** (relieved, bright office) | Relief/hope | "What if he never had to book again?" |
| Reveal | **JABEE Bike** (200-frame build animation) | Satisfaction | "The Transformation — Building effortless commutes brick by brick." |

---

## 14. App Features Showcased (Features Section)

1. Fixed daily ride — book once, ride every weekday
2. Same captain, same time — same trusted professional every day
3. Same fair price, no surge — locked monthly fare
4. Scheduled pickups & alerts — 10-min notification before arrival
5. Live ride tracking — real-time GPS
6. Verified captains — background checks + ratings
7. In-app captain chat — masked phone numbers
8. UPI, Cash & Card payments — autopay or cash
9. Ride history & trip sharing — expense statements + family tracking

---

## 15. Team Section

Placeholder cards for team members (real names to be filled in):
- **Founders:** Founder & CEO, Co-Founder & COO
- **Tech Team:** Head of Engineering, Lead Android Dev, Lead Product Designer, Infrastructure Lead
- **Marketing & Community:** Head of Growth, Brand Communications, Corporate Partner, Community & Support

---

## 16. Known TODOs / Pending Work

- [ ] **Navbar logo:** Currently uses text `JABEE.` — should be replaced with `logo-white.png` image. The logo is `3286×1312` on a near-white background (not transparent). Use CSS `mix-blend-multiply` or create a cropped/transparent version.
- [ ] **Team names:** Placeholders like `[Founder Name]` need real names and photos
- [ ] **Team photos:** Currently showing emoji placeholders (`👤`, `⚙️`)
- [ ] **Google Play link:** CTA button points to `#playstore` (anchor) — needs real Play Store URL
- [ ] **Privacy Policy / Terms / Captain Code of Conduct:** Footer links point to `#` — need real pages
- [ ] **logo-white.png transparency:** Current file has white background (~RGB 255,255,253). For best navbar use, either create a transparent PNG or use `mix-blend-multiply` CSS

---

## 17. How to Run / Develop

```bash
# Install dependencies
npm install

# Start dev server (localhost:3000)
npm run dev

# Production build
npm run build

# After adding new PNG frames to public/{folder}/
node convert-frames.mjs
```

---

## 18. Common Patterns & Rules to Follow

1. **No new global state** — add to the existing 4 useState hooks in page.js if needed
2. **All canvas components** must accept `isLoading` prop and return early if `isLoading === true`
3. **Frame images** always live in `public/{folder}/frame-{001..N}.webp` (3-digit zero-padded)
4. **Critical frames** (needed before site reveals) must be added to the `CRITICAL` array in `LoadingScreen.jsx`
5. **Bike frames** are non-critical and should keep `eager: !isLoading` pattern
6. **ScrollTrigger** sections always use `pin: true, pinSpacing: true, scrub: true`
7. **NavMode** is driven by `data-nav-mode="dark|light"` attribute on each `<section>` — always add this when adding new sections
8. **Desktop/Mobile duplication** — every new story section needs both `hidden lg:flex` and `block lg:hidden` variants
9. **Tailwind only** — no inline `style` except for dynamic values (progress %, transforms)
10. **'use client'** directive required on all components that use React hooks or browser APIs

---

## 19. File Reference Quick Map

| I need to change... | Edit this file |
|--------------------|----------------|
| Page content / sections | `src/app/page.js` |
| Navbar | `src/app/page.js` lines 94–163 |
| Loading screen | `src/components/LoadingScreen.jsx` |
| Character 1 animation | `src/components/Character1ScrollCanvas.jsx` |
| Bike animation | `src/components/BikeScrollCanvas.jsx` |
| Smooth scroll behavior | `src/components/SmoothScroll.jsx` |
| Frame loading/cache | `src/hooks/useFrameSequence.js` |
| Frame easing smoothness | `src/hooks/frameEaser.js` |
| Colors / fonts / shadows | `tailwind.config.js` |
| CSS animations / utilities | `src/app/globals.css` |
| SEO / metadata | `src/app/layout.js` |
| Next.js config | `next.config.js` |
| Frame image generation | `convert-frames.mjs` |

---

*Last updated: 2026-10-18 | Project status: Active development*
