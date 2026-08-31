# Product Requirements Document (PRD)

## Project Name: DearMyDream.id Landing Page & Memory Archive
**Version:** 1.0.0  
**Target URL / Account:** [@dear_mydream.id](https://www.instagram.com/dear_mydream.id/)  
**Primary Fandom:** NCT DREAM (Dreamzen) & Mark Lee (MarkF) — Bandung Chapter  
**Design Theme:** Soft Neo-Brutalism x K-Pop Scrapbook Archive  
**Tech Stack:** Modern HTML5, Modular CSS Custom Properties, Vanilla ES6+ (Vite Bundler Architecture)

---

## 1. Executive Summary & Vision

### 1.1 Problem Statement
`@dear_mydream.id` menyelenggarakan berbagai event berkala untuk fans K-Pop di Bandung (seperti perayaan ulang tahun Mark Lee, anniversary NCT DREAM, pajama party gathering, photobooth project). Namun, informasi event sering tersebar di berbagai tautan pendaftaran (Google Form/Linktree) dan postingan Instagram. Fans baru kesulitan melihat rekap event yang sudah berlangsung, serta media partner dan sponsor potensial tidak memiliki portal terpusat untuk menghubungi tim.

### 1.2 Product Vision
Membangun web landing page **"Event Hub & Memory Archive"** yang ringan, estetik, dan *zero-maintenance* untuk harga tiket dinamis. Web ini berfungsi sebagai:
1. **Spotlight Terkini:** Mengumumkan status event berikutnya (*Next Project TBA* atau *Open Registration*).
2. **Quick Action Hub:** 1-klik gabung grup WhatsApp komunitas & kontak admin untuk kolaborasi/sponsor.
3. **Interactive Memory Archive:** Menampilkan riwayat event lalu (*Dear Mark: Always Been Mark* & *Dear Dream: Pajama Party 10th Dreamversary*) dalam format kartu **Polaroid Scrapbook** interaktif dengan filter tab.
4. **Mobile First & Anti-AI Slop:** Responsif di perangkat iOS & Android dengan palet warna selaras dengan Profile Picture (Sage Green, Lime Neo, Cloud White, Deep Forest Ink), tanpa elemen generik/AI slop.

---

## 2. Target Audience & User Personas

| Persona | Kebutuhan Utama | Target Aksi di Web |
| :--- | :--- | :--- |
| **Dreamzen / MarkF Baru** | Ingin tahu komunitas NCT DREAM di Bandung & melihat keseruan event sebelumnya. | Klik `[ Gabung Grup WhatsApp ]`, lihat galeri polaroid event lalu. |
| **Peserta Event Terdaftar** | Mencari update status project berikutnya atau dokumentasi foto. | Membuka tab Memory Archive, mengecek detail rekap event. |
| **Tenant / Vendor (Photobooth/Merch)** | Ingin membuka booth jualan / instalasi photobooth (seperti Bobbliss, MJ Market). | Klik `[ Kontak Kolaborasi / Sponsor ]`. |
| **Media Partner / Komunitas Fandom** | Ingin cross-promote event gathering sesama fanbase K-Pop Jabar. | Mengakses kontak kemitraan di Hero / Footer. |

---

## 3. Functional Requirements & Feature Specifications

### 3.1 Top Navigation Bar (Header)
* **Brand Logo & Mark:** Logo stiker DearMyDream + Tagline *“My Dream is My Youth”*.
* **Status Indicator:** Pill badge dengan animasi live pulse (`🟢 Bandung Community Chapter`).
* **Instagram Shortcut:** Tombol direct link ke `@dear_mydream.id` dengan icon SVG Instagram otentik.

### 3.2 Hero Spotlight Section
* **Headline:** *"Bandung's Cozy Space for Dreamzen & MarkF"*.
* **Live Event State Card:**
  * Status: `Next Gathering: In Planning (TBA) ⏳` *(Dukungan mudah diubah ke status "Registration Open" saat ada event aktif)*.
  * Deskripsi ringkas: *"Tempat seru-seruan bareng fans Mark & NCT DREAM di Bandung. Noraebang, Photobooth, Freebies, and Forever Friendship."*
* **Dual Quick CTA Buttons (High Priority):**
  * **Primary CTA:** `[ 💬 Gabung Grup WhatsApp Dreamzen ]` *(Direct link ke WhatsApp group komunitas)*.
  * **Secondary Neo Button:** `[ 🤝 Kontak Kolaborasi / Sponsor ]` *(Direct link WhatsApp Admin untuk kemitraan, booth tenant & media partner)*.

### 3.3 Interactive Memory Archive (The Polaroid Deck)
Fitur utama untuk menampilkan riwayat event yang telah sukses diselenggarakan:
* **Tab Category Switcher:**
  * `[ ✦ Semua Kenangan (All) ]`
  * `[ 🐯 Mark Projects ]`
  * `[ 🌙 Dream Projects ]`
* **Polaroid Card Deck:**
  * **Card 1 (Event 1):** *“Dear Mark: Always Been Mark”*
    * Poster/foto event resolusi tinggi.
    * Tag: `🐯 Mark Birthday Project`
    * Tulisan tangan: `Bandung • Always With Mark`
    * Metadata: Gathering, Freebies, Games.
  * **Card 2 (Event 2):** *“Dear Dream: Pajama Party (10th Dreamversary & Birthday Celebration)”*
    * Poster/foto event Pajama Party.
    * Tag: `🌙 10th Dreamversary & Bday MK+JM`
    * Tulisan tangan: `Bandung • Agustus 2026`
    * Metadata: Daster & Pajama Dresscode, Bobbliss Photobooth, MJ Market GO, Special Pillow & Bag Charm Freebies.
  * **Card 3 (Teaser Card):** *“Vol. 03 — Next Story Soon”*
    * Tilted mystery card dengan stiker badge `✨ Coming Soon`.
* **Memory Lightbox / Popup Detail (Saat Polaroid Diklik):**
  * Modal clean menampilkan foto HD, tanggal, lokasi venue, dresscode yang dipakai, dan list sponsor/media partner tanpa reload halaman.

### 3.4 Community Manifesto & Pillars
* 3 kartu pilar ringkas bertema Soft Neo-Brutalist:
  1. 🎀 **Curated Fan Kits:** Starter pack photocard, bag charm, and bespoke keepsakes.
  2. 📸 **Photo Memories:** Aesthetic photobooth frame collaborations.
  3. 🎤 **Safe & Fun Gathering:** Noraebang party, cozy dresscode, and friendly atmosphere.

### 3.5 Footer & Fast Social Hub
* Quick links: Grup WhatsApp, Instagram `@dear_mydream.id`, Email/Admin Contact.
* Copyright: `© DearMyDream.id • Bandung, Indonesia. Made with 💚 by Fans for Fans.`

---

## 4. Non-Functional Requirements & Performance

### 4.1 Mobile-First Optimization (iOS & Android)
* **Fluid Typography:** Menggunakan CSS `clamp()` untuk ukuran font yang proporsional di semua layar (320px s/d 1440px+).
* **Touch Target Size:** Semua tombol dan kartu interaktif memiliki area sentuh minimal `48px x 48px`.
* **Safe Area Padding:** Mendukung `env(safe-area-inset-bottom)` untuk perangkat iPhone notch/home bar.
* **Smooth Touch Interaction:** Card polaroid responsif, mudah di-tap dan nyaman di layar HP.

### 4.2 Anti-AI Slop Guidelines
* **Iconography:** Menggunakan SVG murni (Lucide Icons) tanpa emoji generik atau ilustrasi AI berlebihan.
* **Copywriting:** Menggunakan bahasa Indonesia santai, natural, khas kultur fandom K-Pop Indonesia (misal: *Dreamzen, MarkF, Freebies, Noraebang, Photostrip, Doorprize*), tanpa kalimat klise corporate AI.
* **Asset Otentik:** Gambar dan poster di-scrape langsung dari akun asli `@dear_mydream.id` dalam kualitas HD.

---

## 5. Technical Architecture

```
d:/IGEH/
├── index.html              # Clean semantic HTML5 landing page
├── package.json            # Vite project configuration
├── vite.config.js          # Optimized bundler configuration
├── src/
│   ├── css/
│   │   ├── tokens.css      # Design tokens (colors, typography, neo-shadows)
│   │   ├── components.css  # Buttons, polaroid cards, tabs, modal, badges
│   │   └── main.css        # Layout grid, hero, animations, responsive media queries
│   ├── js/
│   │   ├── data.js         # Structured data for past events & media
│   │   ├── modal.js        # Interactive memory lightbox handler
│   │   ├── tabs.js         # Tab category filtering logic
│   │   └── main.js         # Entry point & micro-interactions
│   └── assets/
│       ├── brand/          # Logo & PP extracted assets
│       ├── events/         # HD scraped posters from @dear_mydream.id
│       └── icons/          # Clean SVG icons (WhatsApp, IG, Camera, Sparkles, etc.)
```
