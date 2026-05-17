<div align="center">

# 🤖 AI Interview Platform

### Your intelligent mock interview coach — powered by AI, built for real-world readiness.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-4F46E5?style=for-the-badge)](https://ai-interview-platform1313.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-96.9%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

</div>

---

## 📌 Overview

**AI Interview Platform** is a full-stack, AI-powered mock interview app that simulates real interview scenarios — the AI asks role-specific questions, listens to your answers via voice, evaluates them instantly, and delivers actionable feedback. Every session is saved so you can track improvement over time.

Built for job seekers at every level — from first-timers to senior developers targeting top-tier roles.

---

## ✨ Features

- 🎯 **AI-Generated Interview Questions** — Role and difficulty-specific questions generated dynamically
- 🎙️ **Voice Agent (Hands-Free Interview Mode)** — Speak your answers aloud; the AI listens, understands, and responds back in voice — zero extra dependencies, powered by browser-native Web Speech APIs + OpenAI via Supabase Edge Functions
- 💬 **Real-Time Answer Evaluation** — Instant AI-driven feedback on responses
- 📊 **Performance Analytics** — Visual dashboards to track progress across sessions using Recharts
- 🔐 **Authentication & Profiles** — Secure user auth and session management via Supabase
- 📁 **Session History** — Review past interviews and monitor improvement over time
- 📱 **Fully Responsive** — Optimized for desktop, tablet, and mobile
- ⚡ **Blazing Fast** — Powered by Vite with SWC for near-instant builds and HMR
- 🧪 **Tested** — Unit tests with Vitest and React Testing Library

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite |
| **UI Components** | shadcn/ui, Radix UI, Lucide Icons |
| **Styling** | Tailwind CSS, tailwindcss-animate |
| **State & Data Fetching** | TanStack React Query |
| **Routing** | React Router DOM v6 |
| **Forms & Validation** | React Hook Form + Zod |
| **Backend / Database** | Supabase (PostgreSQL + Auth + Realtime) |
| **Charts / Analytics** | Recharts |
| **Voice Agent** | Web Speech API (STT) + SpeechSynthesis (TTS) + OpenAI GPT-4o |
| **AI Backend** | Supabase Edge Functions + OpenAI GPT-4o |
| **Testing** | Vitest, React Testing Library, jsdom |
| **Deployment** | Vercel |

---

## 🎙️ Voice Agent — How It Works

One of the standout features of this platform is the **hands-free voice interview mode**, built entirely without any third-party voice SDK. It uses browser-native APIs wired to an AI backend — making it lightweight, fast, and cost-effective.

### Architecture

```
🎤 User speaks
      ↓
Web Speech API (SpeechRecognition)
— captures mic input, converts speech → text (free, built into Chrome/Edge)
      ↓
Supabase Edge Function
— receives the transcript
— sends it to OpenAI GPT-4o with a professional interviewer prompt
— returns the AI's response
      ↓
SpeechSynthesis API
— converts AI text → spoken audio (free, built into browser)
      ↓
🔊 User hears the AI interviewer speak back
      ↓
Transcript saved to Supabase DB
— available in Session History for later review
```

### Why No Vapi / ElevenLabs?

| Approach | Cost | Extra Packages | Data Control |
|---|---|---|---|
| **This project (Web APIs + Supabase)** | ~$0.01/session | Zero | Full control |
| Vapi / ElevenLabs | $0.05–$0.20/min | Heavy SDK | 3rd party |

By using the browser's built-in `SpeechRecognition` for speech-to-text and `SpeechSynthesis` for text-to-speech, the voice pipeline requires **no additional npm packages** — keeping the bundle lean and the architecture clean.

### Browser Support

| Browser | Voice Input | Voice Output |
|---|---|---|
| Chrome / Edge | ✅ Full support | ✅ Full support |
| Firefox | ⚠️ Partial | ✅ Full support |
| Safari | ✅ Full support | ✅ Full support |

> **Note:** For the best voice experience, Chrome or Edge is recommended.

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>=18.x`
- A [Supabase](https://supabase.com/) project (free tier works)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Swetapanigrahy/Ai_Interview_Platform.git
cd Ai_Interview_Platform

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in the following in your .env:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# OPENAI_API_KEY=your_openai_key  (used in Supabase Edge Function)

# 4. Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`.

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build locally
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run lint         # Lint the codebase
```

---

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components (shadcn/ui + custom)
│   └── VoiceInterview.tsx   # 🎙️ Voice agent UI component
├── pages/             # Route-level page components
├── hooks/             # Custom React hooks
│   └── useVoiceAgent.ts     # 🎙️ Web Speech API + Supabase integration
├── lib/               # Utility functions and helpers
├── integrations/      # Supabase client and API integrations
└── types/             # TypeScript type definitions

supabase/
└── functions/
    └── ai-interviewer/
        └── index.ts         # 🤖 Edge Function — calls OpenAI GPT-4o
```

---

## 🌐 Live Demo

🔗 **[https://ai-interview-platform1313.vercel.app](https://ai-interview-platform1313.vercel.app/)**

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by [Sweta Panigrahy](https://github.com/Swetapanigrahy)

⭐ If you found this project helpful, please consider giving it a star!

</div>
