
<div align="center">

# 🤖 AI Interview Platform

### Your intelligent mock interview coach — powered by AI, built for real-world readiness.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-4F46E5?style=for-the-badge)](https://ai-interview-platform-mu-liard.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-96.9%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

</div>

---

## 📌 Overview

**AI Interview Platform** is a full-stack, AI-powered mock interview web application that helps candidates prepare for technical and behavioral interviews through realistic, intelligent simulations. The platform generates role-specific questions, evaluates answers in real time, and provides detailed feedback — all in an intuitive, modern interface.

Whether you're preparing for your first job or aiming for FAANG, this platform gives you a private, judgment-free space to sharpen your skills.

---

## ✨ Features

- 🎯 **AI-Generated Interview Questions** — Role and difficulty-specific questions generated dynamically
- 💬 **Real-Time Answer Evaluation** — Instant AI-driven feedback on responses
- 📊 **Performance Analytics** — Visual dashboards to track progress across sessions using Recharts
- 🔐 **Authentication & Profiles** — Secure user auth and session management via Supabase
- 📁 **Session History** — Review past interviews and monitor improvement over time
- 🌓 **Dark / Light Mode** — Seamless theme switching with `next-themes`
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
| **Testing** | Vitest, React Testing Library, jsdom |
| **Deployment** | Vercel |

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
# Fill in your Supabase URL and anon key in .env

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
├── pages/             # Route-level page components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and helpers
├── integrations/      # Supabase client and API integrations
└── types/             # TypeScript type definitions
```

---

## 🌐 Live Demo

🔗 **[https://ai-interview-platform-mu-liard.vercel.app](https://ai-interview-platform-mu-liard.vercel.app)**

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
