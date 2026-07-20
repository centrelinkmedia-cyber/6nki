# ENKI — Institute of Creative Technology & Creator Operating System
**Release 2.6.18 (Harmonic Architecture)**

---

## 🏛️ Brand & Philosophical Direction

ENKI is engineered not as a conventional music or media website, but as a **private innovation institute** and **creator operating system** uniting:
1. **Music & Spatial Acoustics**
2. **Cinematic Film Architecture**
3. **Voice Acting & Vocal Direction**
4. **Transmedia Writing & Lore Bible Construction**
5. **Generative Design & Sacred Geometry UI**
6. **Executive Business Strategy & Sovereign Token Economics**

### First Impression vs. Deeper Substructure
- **On the Surface**: Apple-level simplicity, minimal charcoal/black glassmorphic panels (`#0a0a0c`), refined corporate typography, and zero clutter. A serious, premium corporate creative agency and futuristic research organization.
- **Underneath (The Codex & Esoteric Substructure)**: Subtly derived from ancient principles of human creativity.
  - **Sumerian Namesake**: Named after *Enki*, the ancient Sumerian architect of wisdom, craftsmanship, and creation who gifted humanity the *Me* (the blueprints of civilization).
  - **Fundamental Acoustic Standard ($432\text{ Hz}$ vs $440\text{ Hz}$)**: All system audio and interface sound feedback are tuned to $432\text{ Hz}$ harmonic resonance to reduce listener cognitive fatigue.
  - **Golden Ratio Grid Systems ($\Phi = 1.6180339887$)**: Toggleable golden spiral and harmonic grid proportions (`Φ` button in navbar) governing spacing, layout balance, and visual calm.

---

## 🚀 Key Platform Features

### 1. 🌐 Multi-Disciplinary Creator Network (`/network`)
- Verified creator roster across 6 primary disciplines.
- High-fidelity profiles displaying **Ascension Tier** (`Apprentice` -> `Artisan` -> `Luminary` -> `Architect`) and **Harmonic Resonance Score**.
- Portfolio inspection modal supporting lossless audio stems, script PDFs, and design canvases.
- Direct **Sovereign Collaboration & Bounty Proposal** system with escrow allocation.

### 2. 🎙️ ENKI Studios — Live Creative Audio Rooms (`/studios`)
- Built on **LiveKit WebRTC Real-Time Audio Architecture**.
- Specifically structured as a **professional creative conference room**, avoiding Discord/gaming aesthetics.
- **Top Bar**: Studio Name, Discipline Tag, Host Card, and Audio Preset (`Lossless 48kHz / 432Hz Master`).
- **Stage Section (`ON STAGE:`)**: Host (`👑`), Active Speakers (`🎙️ Speaker` with animated VU meters and mute controls), and host promotion/demotion tools.
- **Audience Section (`LISTENERS: 247 people`)**: High-capacity real-time listener grid with stage request invitations.
- **Conference Console**: `[Request Mic]`, `[Mute/Unmute]`, `[Share Asset to Room]`, `[Tip Host $NKI]`, and `[Leave Studio]`.
- **Integrated Room Tabs**: Stage View, Real-Time Conference Chat, and Shared Stage Assets/PDF Viewer.

### 3. ⚡ The Treasury ($NKI Internal Economy) (`/treasury`)
- Sovereign internal currency circulation (`$NKI`).
- Daily **432Hz Node Synchrony Check-In** reward (`+108.00 NKI`).
- Peer-to-peer instant tipping right inside live studios or directly via creator dossiers.
- Immutable **Transaction Ledger** tracking all system grants, stem pack bounties, masterclass rewards, and service settlements.

### 4. ✨ The Ascension — Creator Growth Systems (`/ascension`)
- Four-tier advancement pipeline (`Apprentice`, `Artisan`, `Luminary`, `Architect`).
- Curated educational masterclasses across acoustic engineering, vocal direction, screenwriting, and golden ratio UI design.
- **Executive Business Strategy Pack**: Downloadable verified legal contracts, stem pack licensing agreements, and transmedia royalty matrices.

### 5. 🌍 The Nexus — Sovereign Marketplace (`/nexus`)
- Direct peer-to-peer creative service exchange transacted in `$NKI`.
- License $432\text{ Hz}$ ambient stems, hire cinematic voice actors for franchise narration, or contract transmedia lore bibles without intermediary fees.

### 6. 📜 The Codex (`/codex`)
- Interactive deep-dive into the architectural philosophy of ENKI.
- **Sacred Mathematical Canvas**: Interactive SVG visualizer allowing toggling between *Golden Spiral*, *Flower of Life*, and *Harmonic Proportions Grid*.
- **The Five Pillars**: Interactive audio-reactive nodes detailing how ancient wisdom translates into modern React, LiveKit, and Supabase code.

---

## 🗄️ Supabase Backend Architecture (`supabase/schema.sql`)

The complete, production-ready SQL database schema is included at `supabase/schema.sql` and `/home/user/supabase_schema.sql`. It defines:
- `profiles`: User accounts, discipline categories, $NKI wallet balance, ascension tier, resonance scores, and JSONB portfolios.
- `studios`: Live audio rooms, LiveKit room identifiers, audio presets, listener metrics, and active shared stage assets.
- `studio_members`: Real-time participant state (`host`, `speaker`, `listener`), raised hands, and mute status.
- `studio_messages`: Conference chat history and shared document links inside live rooms.
- `nki_transactions`: Ledger of sovereign rewards, peer tips, marketplace escrow, and system grants.
- `marketplace_listings`: Creator services, pricing in $NKI, and verification tags.
- `ascension_modules` & `ascension_progress`: Educational progression tracking and verification triggers.
- `collaborations`: Escrow bounties and multi-disciplinary joint ventures.
- **Row Level Security (RLS)**: Enforces strict data ownership and public read/private update policies.

### Hybrid Persistence & Cross-Tab Engine
If live `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` credentials are provided in `.env`, the platform connects to your cloud database automatically. If run in standalone/sandbox mode without external keys, ENKI activates its **High-Fidelity Local Persistence Engine (`EnkiLocalDatabaseEngine`)** using `localStorage` and `BroadcastChannel`—enabling real-time multi-tab synchronization right inside your browser!

---

## 💻 Technical Stack & Local Development

- **Frontend**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) + Custom Glassmorphism & Sacred Geometry utilities
- **Real-Time Audio**: LiveKit (`livekit-client`) WebRTC integration + Web Audio API 432Hz Sound Generator (`sound-engine.ts`)
- **Backend Core**: Supabase (`@supabase/supabase-js`) + Complete PostgreSQL Schema

### Quick Start
```bash
# Navigate to the project folder
cd enki-platform

# Install dependencies
npm install

# Run the local development server (port 5173)
npm run dev
```

### Production Build
```bash
npm run build
```

---
*Built with Apple-level simplicity on the surface, powered by the ancient principles of human creativity underneath.*
