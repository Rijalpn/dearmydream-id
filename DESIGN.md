# Design System & Aesthetic Specification

## System Name: DearMyDream Soft Neo-Brutalist Scrapbook
**Version:** 1.0.0  
**Source Asset:** Profile Picture `@dear_mydream.id` (Extracted Palette & Visual Marks)  
**Aesthetic Theme:** Soft Neo-Brutalism x K-Pop Memory Scrapbook  
**Target Optimization:** 100% Mobile-First (iOS Safari, Android Chrome) & High-End Desktop

---

## 1. Color Palette (Extracted from Profile Picture)

Warna diambil dan diselaraskan langsung dari profile picture stiker `DearMyDream` dengan lightstick Neobong & background sage:

```css
:root {
  /* Canvas & Backgrounds */
  --color-bg-sage: #748C7B;           /* Primary Sage Green Background dari PP */
  --color-bg-sage-dark: #5C7463;      /* Deeper Sage for contrast sections */
  --color-bg-canvas: #F4F8F4;         /* Soft Cream White for card surfaces */
  --color-bg-card: #FFFFFF;           /* Crisp White for polaroid frames */

  /* Brand Accents (PP Bubble Lettering & Neobong) */
  --color-lime-pop: #6ECC65;          /* Green 'DEAR' Bubble color */
  --color-lime-pop-hover: #5DB855;    /* Darker Lime for hover state */
  --color-pastel-mint: #AEF29C;       /* Soft Mint 'DREAM' color */
  --color-neobong-neon: #D1F737;      /* NCT Neon Champagne Lightstick Lime */
  --color-sparkle-gold: #FEF08A;      /* Star Sparkle Gold Accent */

  /* Text & Ink Strokes (Neo-Brutalist Lines) */
  --color-ink: #16281E;               /* Deep Forest Ink for borders & text */
  --color-ink-muted: #4A6354;         /* Muted sage-forest for subtitles */
  --color-white: #FFFFFF;

  /* Status Colors */
  --color-status-live: #22C55E;       /* Live green dot */
  --color-status-tba: #EAB308;        /* TBA Amber dot */
}
```

---

## 2. Neo-Brutalist Visual Tokens

Menggabungkan ketegasan **Neo-Brutalism** (garis tebal, bayangan solid) dengan kelembutan sudut membulat (*Soft Neo-Brutalism*) agar tetap manis dan ramah bagi audiens K-Pop.

### 2.1 Strokes & Borders
* **Card Border:** `2.5px solid var(--color-ink)`
* **Pill / Button Border:** `2px solid var(--color-ink)`
* **Divider / Tape Stroke:** `1.5px solid var(--color-ink)`

### 2.2 Solid Drop Shadows (No Blurry AI Shadows)
* **Shadow Small (Buttons/Pills):** `3px 3px 0px var(--color-ink)`
* **Shadow Medium (Cards/Polaroids):** `4px 4px 0px var(--color-ink)`
* **Shadow Large (Hero Container/Modals):** `6px 6px 0px var(--color-ink)`
* **Shadow Active (Pressed):** `1px 1px 0px var(--color-ink)` dengan `transform: translate(2px, 2px)`

### 2.3 Border Radii
* **Pill Badges & Buttons:** `9999px` (Capsule full-round)
* **Outer Cards & Containers:** `20px`
* **Inner Image / Polaroid Frame:** `10px`
* **Modal Windows:** `24px`

---

## 3. Typography Hierarchy

Kombinasi font modern sans-serif tebal untuk keterbacaan tinggi dipadu dengan font tulisan tangan otentik (*handwritten script*) untuk kesan jurnal kenangan:

| Role | Font Family | Weight | Size (Mobile → Desktop Fluid clamp) |
| :--- | :--- | :--- | :--- |
| **Hero Display** | `'Plus Jakarta Sans', sans-serif` | 800 (Extra Bold) | `clamp(1.75rem, 5vw, 2.75rem)` |
| **Section Titles** | `'Plus Jakarta Sans', sans-serif` | 800 (Bold) | `clamp(1.4rem, 4vw, 2.0rem)` |
| **Card Headings** | `'Plus Jakarta Sans', sans-serif` | 700 (Bold) | `clamp(1.1rem, 2.5vw, 1.35rem)` |
| **Polaroid Notes** | `'Caveat', cursive` | 700 (Bold Script) | `clamp(1.15rem, 2vw, 1.45rem)` |
| **Body & Details** | `'Plus Jakarta Sans', sans-serif` | 500 / 600 | `clamp(0.9rem, 1.5vw, 1.0rem)` |
| **Pill Tags & Badges** | `'Plus Jakarta Sans', sans-serif` | 700 | `0.8rem` |

---

## 4. Component Design Specifications

### 4.1 Quick CTA Buttons (Hero)
```css
/* Primary Button (WhatsApp Community) */
.btn-primary-neo {
  background-color: var(--color-neobong-neon);
  color: var(--color-ink);
  font-weight: 700;
  border: 2px solid var(--color-ink);
  border-radius: 9999px;
  padding: 14px 24px;
  box-shadow: var(--shadow-sm);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s ease-in-out;
}
.btn-primary-neo:hover {
  background-color: var(--color-pastel-mint);
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0px var(--color-ink);
}
.btn-primary-neo:active {
  transform: translate(2px, 2px);
  box-shadow: var(--shadow-active);
}

/* Secondary Button (Collaboration / Sponsor) */
.btn-secondary-neo {
  background-color: var(--color-white);
  color: var(--color-ink);
  font-weight: 700;
  border: 2px solid var(--color-ink);
  border-radius: 9999px;
  padding: 14px 24px;
  box-shadow: var(--shadow-sm);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s ease-in-out;
}
```

### 4.2 Interactive Polaroid Deck (Event Archive)
* **Washi Tape Accent:** Strip transparan bertekstur di bagian atas tengah frame polaroid (`background: rgba(254, 240, 138, 0.75); transform: rotate(-3deg);`).
* **Frame Physical Styling:**
  * Background: `#FFFFFF`
  * Padding: `14px 14px 24px 14px`
  * Border: `2.5px solid var(--color-ink)`
  * Shadow: `5px 5px 0px var(--color-ink)`
* **Tilt Rotation:**
  * Card 1: `transform: rotate(-2.5deg)`
  * Card 2: `transform: rotate(2deg)`
  * Card 3: `transform: rotate(-1.5deg)`
  * **On Hover / Tap Focus:** `transform: rotate(0deg) translateY(-6px) scale(1.02); box-shadow: 7px 7px 0px var(--color-ink);`

### 4.3 Tab Category Switcher
* Capsule container (`background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(8px); border: 2px solid var(--color-ink);`).
* Active Tab: `background: var(--color-neobong-neon); font-weight: 800; border: 2px solid var(--color-ink); box-shadow: 2px 2px 0px var(--color-ink);`.
* Inactive Tab: `background: transparent; color: var(--color-ink); border: 2px solid transparent;`.

### 4.4 Memory Capsule Lightbox (Modal Detail)
* **Backdrop:** `rgba(22, 40, 30, 0.7)` dengan `backdrop-filter: blur(6px)`.
* **Modal Dialog:** Card putih bersudut `24px`, border `3px solid var(--color-ink)`, shadow `8px 8px 0px var(--color-ink)`.
* **Close Button:** Tombol silang `X` tebal di pojok kanan atas dengan hover warna pastel.

---

## 5. Mobile-First Optimization Rules (iOS & Android)

1. **Touch Target Size:** Minimal `48px x 48px` untuk setiap link dan tombol (sesuai standar Apple HIG & Google Material).
2. **Safe Area Insets:**
   ```css
   body {
     padding-bottom: max(16px, env(safe-area-inset-bottom));
     padding-top: max(16px, env(safe-area-inset-top));
   }
   ```
3. **No Horizontal Overflow:** Semua container menggunakan `max-width: 100%; box-sizing: border-box; overflow-x: hidden;`.
4. **Card Grid in Mobile:** Di layar HP (< 640px), polaroid card ditampilkan dalam single vertical stack yang rapi dengan jarak antar kartu `24px` atau carousel geser horizontal yang mulus (*scroll-snap-type: x mandatory*).

---

## 6. Anti-AI Slop Guidelines

* 🚫 **No Generic AI Icons / Emojis:** Hindari ikon robotik generik. Gunakan ikon SVG garis bersih dari **Lucide Icons** (WhatsApp, Instagram, Calendar, MapPin, Sparkles, Heart, Camera, ExternalLink).
* 🚫 **No Generic Corporate Copy:** Copywriting harus mencerminkan energi fandom asli (*Dreamzen, MarkF, Noraebang, Freebies Kit, Bobbliss Photobooth, MJ Market, Pajama Party*).
* 🚫 **No Blurry Stock Images:** Poster dan aset diambil dari materi asli `@dear_mydream.id`.
