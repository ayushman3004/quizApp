# QuizVerse ⚡

> **Competitive Quiz, Structured Learning & Social Knowledge Platform**  
> Architected according to the QuizVerse PRD specification.

---

## 🏛️ System Architecture

QuizVerse is organized into a clean full-stack architecture:

```
quizApp/
├── backend/             # Next.js 16 (App Router) Backend deployable to Vercel
│   ├── prisma/
│   │   └── schema.prisma# PostgreSQL schema (Users, Quizzes, Ring Matches, Journey, Tournaments)
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/     # Serverless REST Microservices (Auth, The Ring, Journey, Creators, etc.)
│   │   │   └── page.tsx # Developer Telemetry & Live Interactive API Testing Console
│   │   └── lib/
│   │       ├── scoring.ts   # Section 15 Authoritative Scoring Engine (Base + Speed + Streak)
│   │       ├── archetypes.ts# Section 46 Player Archetype Engine (Speedster, Strategist, etc.)
│   │       ├── store.ts     # Authentic Seed Data Store & Resilient Data Layer
│   │       └── auth.ts      # JWT Authentication & Security
│   └── package.json
│
└── frontend/            # React Native Mobile Application (Expo SDK 58)
    ├── App.tsx          # Root container with Navigation & Actionable Notifications
    ├── src/
    │   ├── theme.ts     # QuizVerse Cyber Dark Design System tokens
    │   ├── services/    # Resilient Backend API client with offline fallback
    │   ├── components/  # HeaderBar, Navbar, Badges
    │   └── screens/
    │       ├── HomeScreen.tsx        # 1-Click Quick Battle, Daily Challenge, Journey resume
    │       ├── RingScreen.tsx        # The Ring PvP Arena, radar matchmaking, timer & live rankings
    │       ├── JourneyScreen.tsx     # Structured Subject → Topic → Lesson → Practice
    │       ├── CreatorsScreen.tsx    # Substack-style Quiz Masters with subscriber metrics
    │       ├── LeaderboardScreen.tsx # Competitive MMR, XP Legends, Streaks & Tournaments
    │       └── ProfileScreen.tsx     # 21-Day Streak, Archetype, Badges & Cosmetics Shop
    └── package.json
```

---

## 🚀 Quick Start Guide

### 1. Run the Next.js Backend (Port 3000)

```bash
cd backend

# Install dependencies (already installed)
npm install

# Start development server
npm run dev
# OR build and run production server:
npm run build
npm run start -p 3000
```

Open `http://localhost:3000` in your browser to access the **Interactive Developer Hub & API Telemetry Console**.

### 2. Run the React Native Mobile App

```bash
cd ../frontend

# Start Expo dev server
npm start

# Options:
# Press 'w' in terminal to preview in Web Browser
# Press 'i' to launch in iOS Simulator
# Press 'a' to launch in Android Emulator
# Scan QR code with Expo Go app on your physical iPhone/Android device!
```

---

## ☁️ Deploying the Backend to Vercel

1. Push this repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com):
   - Click **Add New Project** and select this repository.
   - Set **Root Directory** to `backend`.
   - In **Environment Variables**, configure:
     ```env
     DATABASE_URL="postgresql://user:password@your-neon-or-supabase-host/quizverse?sslmode=require"
     JWT_SECRET="your-ultra-secure-jwt-production-secret"
     ```
   - Click **Deploy**.
3. Prisma Client is automatically generated during deployment via the `postinstall` script.

---

## ⚡ PRD Feature Implementation Matrix

| PRD Section | Feature | Implementation Details |
|---|---|---|
| **Section 9 & 10** | **The Ring Arena & Matchmaking** | `/api/ring/matchmake` matches players based on MMR rating (e.g. 1680 MMR), question categories, and speed. |
| **Section 13, 14, 15** | **Authoritative Scoring Engine** | Base points (+100), Speed bonuses (+80 for 1-2s, +60 for 3-4s, +40 for 5-6s, +20 for 7-8s, +10 for 9-10s), Difficulty multipliers (1.0x to 2.0x), and Streak bonuses (+5%, +10%, +15%). |
| **Section 16** | **Live Ranking Movement** | Leaderboard updates dynamically after every question and communicates position movement against rivals. |
| **Section 18 & 19** | **Match Completion & Results** | Awards XP, Coins, MMR rating delta (+18 MMR), max streak records, and accuracy stats. |
| **Section 22 & 61** | **Journey Structured Learning** | Subject → Topic → Lesson → Practice → Challenge → Mastery with automated **Weak Area Identification** (e.g. Open Market Operations in Economics). |
| **Section 26** | **10 Question Formats** | Multiple Choice, Assertion/Reason, True/False, Numerical, and Image/Case questions. |
| **Section 29** | **Quiz Masters (Substack Model)** | Public creator identities (e.g. Rahul Sharma, Dr. Priya Nair) with subscriber counts, ratings, and published quizzes. |
| **Section 36** | **Tournaments & Arenas** | Daily Arena Cup #142 & Inter-College Championship with coin entry pools and brackets. |
| **Section 40** | **Friend Challenges** | "You scored 1,840. Can your friend beat you?" friend battle challenge engine. |
| **Section 46** | **Player Archetypes** | Evaluates response times and accuracy to classify players as **The Speedster**, **The Strategist**, **The Clutcher**, **The Scholar**, or **The Specialist**. |
| **Section 47** | **Multi-Leaderboard System** | Competitive MMR rating, XP levels, daily streaks, and Quiz Master rankings. |
| **Section 55** | **Actionable Notifications** | Streak risk alerts, tournament countdowns, and friend challenge triggers. |
