# StudyMate AI

An AI-powered study companion that helps students organize their learning, summarize notes, generate quizzes, create study plans, and get help with academic questions — all in one modern, responsive web app. The three AI tools are powered by Google Gemini through a secure Node/Express backend.

![Tech](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white) ![Tech](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white) ![Tech](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwindcss&logoColor=white) ![Tech](https://img.shields.io/badge/Node-Express-v4a02c?logo=node) ![Tech](https://img.shields.io/badge/Gemini_API-blue?logo=google)

---

## Overview

| Feature              | AI-powered? |
| -------------------- | ----------- |
| AI Study Assistant   | Yes — Gemini generates answers with full conversation context |
| Notes Summarizer     | Yes — summary / key points / topics derived from your actual notes |
| Quiz Generator       | Yes — fresh MCQs generated on demand for any topic + difficulty |
| Study Planner        | No — planning stays local (Local Storage), as before |

There are no hardcoded question banks or canned assistant responses. Every AI response is generated from the user's actual input.

## Gemini API Integration

- Uses the official [`@google/genai`](https://www.npmjs.com/package/@google/genai) SDK (v2.x) on the server.
- The model is **centralized** in `server/config.js` (`GEMINI_MODEL`, default `gemini-3.5-flash`). Change it in one place, or override with the `GEMINI_MODEL` env var.
- Gemini outputs are validated server-side:
  - Chat: replies are returned as formatted Markdown-ish text.
  - Summarizer: JSON is parsed and checked (`summary`, `keyTakeaways`, `importantTopics`, `revisionNotes`); word/compression stats are computed from the real input.
  - Quiz: JSON is parsed and every question is validated (question text, **exactly 4 options**, in-range `correctAnswer`, non-empty `explanation`).
  - Malformed/empty Gemini output triggers **one retry with a stricter "JSON only" instruction**, then a friendly error.
- Requests ask for different content each time (high temperature + "vary" instruction), so generating another quiz on the same topic produces different questions.

## Architecture

```
React frontend (Vite, src/)             (Vercel)
        │  fetch("/api/...")              Static site (dist/) + Serverless Functions
        │  — same relative URLs on      /api/chat · /api/summarize · /api/quiz
        │    Vercel and in local dev     · /api/generate-quiz · /api/health
        ▼                                      │
                                          @google/genai SDK
                                          (GEMINI_API_KEY lives here, server-only)
                                                 ▼
                                          Google Gemini API
```

- **In production the API runs as Vercel Serverless Functions** in the `api/` directory — no Express process and no `npm run dev:server` needed on Vercel.
- The same request-handling code powers both entry points: Vercel Functions and the local Express dev server share `server/handlers.js` (→ `server/llm.js`), so behavior is identical locally and deployed.
- **API keys live only on the server.** The browser never sees `GEMINI_API_KEY`; the key is read from the server environment via `process.env.GEMINI_API_KEY` in `server/llm.js` and configured in the Vercel dashboard.
- Every request is validated and failures are mapped (auth, rate limits, timeouts, network, invalid JSON, empty responses) to friendly messages — no secrets or stack traces reach the UI.
- Locally, a small in-memory rate limiter (`RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MS`) protects the Express AI endpoints; Vercel handles infrastructure protection in the cloud. Submit buttons are also disabled while a request is running.

## Project Structure

```
├── index.html
├── vite.config.js          # Vite config + /api dev proxy → :3001
├── vercel.json             # Vercel build output (dist/) + SPA fallback
├── api/                    # Vercel Serverless Functions (production API)
│   ├── chat.js             #   POST /api/chat
│   ├── summarize.js        #   POST /api/summarize
│   ├── quiz.js             #   POST /api/quiz          (used by the frontend)
│   ├── generate-quiz.js    #   POST /api/generate-quiz (alias of /api/quiz)
│   └── health.js           #   GET  /api/health
├── server/
│   ├── index.js            # Local Express dev server (routes use shared handlers)
│   ├── handlers.js         # Shared request handlers for Express + Vercel Functions
│   ├── config.js           # Centralized Gemini model name
│   ├── llm.js              # @google/genai calls, validation & error mapping
│   └── prompts.js          # System prompts for assistant / summarizer / quiz
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Navbar.jsx · Footer.jsx · Button.jsx · ToolCard.jsx
│   │   ├── FeatureCard.jsx · Toast.jsx · ToastContext.jsx
│   │   ├── ScrollToTop.jsx · ThemeContext.jsx
│   │   └── tools/
│   │       ├── AssistantTool.jsx · SummarizerTool.jsx
│   │       ├── QuizTool.jsx · PlannerTool.jsx
│   ├── pages/              # Home · About · Features · Tools · Contact
│   ├── data/features.js
│   └── utils/
│       ├── api.js          # Backend client + friendly error mapping
│       ├── assistant.js    # Sends chat history → /api/chat
│       ├── summarizer.js   # Sends notes → /api/summarize
│       ├── quiz.js         # Requests + validates quiz JSON → /api/quiz
│       ├── format.js       # Safe markdown-ish renderer for chat
│       ├── storage.js      # Local Storage helpers
│       └── helpers.js
└── public/favicon.svg
```

## Prerequisites

- **Node.js 18+** (Vite 8 needs 20.19+ / 22.12+; either is fine)
- **npm**
- A **Google Gemini API key** from [Google AI Studio](https://aistudio.google.com/apikey)

## Installation & Setup

1. **Clone / copy the project**, then install dependencies:

   ```bash
   npm install
   ```

2. **Create the `.env` file** (it is gitignored — never commit it):

   ```bash
   cp .env.example .env
   ```

3. **Add your Gemini API key.** Edit `.env` and set:

   ```
   GEMINI_API_KEY=your_api_key_here
   ```

   Optional variables (see `.env.example`):

   | Variable              | Default         | Purpose                                        |
   | --------------------- | --------------- | ---------------------------------------------- |
   | `GEMINI_API_KEY`      | —               | **Required.** Google Gemini API key (server-only) |
   | `GEMINI_MODEL`        | `gemini-3.5-flash` | Model used for all AI features              |
   | `GEMINI_BASE_URL`     | Gemini default   | Override for proxies / local mock testing     |
   | `PORT`                | `3001`          | Backend port                                   |
   | `RATE_LIMIT_MAX`      | `20`            | Max AI requests per window (0 disables)        |
   | `RATE_LIMIT_WINDOW_MS`| `60000`         | Rate-limit window                              |

   > **Security:** `.env` is in `.gitignore` and must never be committed. The key is read by `server/llm.js` only and is never sent to the browser, displayed in the UI, or surfaced in error messages.

## How to Run

### Development (two terminals)

```bash
# Terminal 1 — start the Gemini-backed API on :3001
npm run dev:server

# Terminal 2 — start the frontend dev server on :5173
npm run dev
```

Open http://localhost:5173. Vite proxies `/api/*` to the backend, so no CORS setup is needed.

> Start both processes before using the AI Study Assistant, Summarizer, or Quiz Generator. If the backend is down, those tools show a friendly "could not reach the AI service" error instead of crashing. The same AI endpoints work on Vercel without the Express server — see *Deploying to Vercel* below.

### Production (self-hosted single process)

```bash
npm install
npm run build       # builds the frontend into /dist
npm start           # Express serves /dist + the /api endpoints
```

Open http://localhost:3001.

### Deploying to Vercel (recommended)

The production deployment runs the API as **Vercel Serverless Functions** located in `api/`. `npm run dev:server` is **not** required (or running) on Vercel.

1. Push the repository to GitHub (or use `vercel` CLI / Vercel Git integration).
2. **Import the project** in [vercel.new](https://vercel.new). Vercel detects the Vite framework automatically and uses the settings in `vercel.json` (`npm run build`, output `dist/`).
3. **Add environment variables** (Project → Settings → Environment Variables):
   - `GEMINI_API_KEY` — your Google Gemini API key (required).
   - `GEMINI_MODEL` — default `gemini-3.5-flash-lite` (optional).
   - `GEMINI_BASE_URL` — default is Google's endpoint (optional, only if you proxy).
4. **Deploy.** The static frontend is served from `dist/`, and `/api/*` requests hit the Serverless Functions (`/api/chat`, `/api/summarize`, `/api/quiz`, `/api/generate-quiz`, `/api/health`). The SPA fallback in `vercel.json` keeps client-side routes working after refresh.

> To test the exact Serverless Functions locally before pushing, run `npx vercel dev` at the project root (loads `.env` automatically and serves `api/` exactly like Vercel). The regular `npm run dev` + `npm run dev:server` flow continues to work unchanged.

### Health check

```bash
curl http://localhost:3001/api/health
# → { "ok": true, "aiConfigured": true }
```

`aiConfigured` is `true` only when `GEMINI_API_KEY` is set on the server.

### Lint

```bash
npm run lint
```

## AI Features

### 1. AI Study Assistant
- Sends the full conversation history (last 20 messages) to Gemini, so follow-ups like "give me an example" are answered in context.
- The **system instruction** (in `server/prompts.js`) tells Gemini to be a helpful, accurate educational assistant that adapts to the requested detail level and uses examples when helpful.
- Handles arbitrary educational questions across programming, computer science, math, science, history, and general study topics.
- Shows a typing indicator with "StudyMate AI is thinking…" while generating.

### 2. Notes Summarizer
- Gemini generates a summary, key points, important topics, and optional revision notes **based only on the text you paste**. The backend computes word-count/compression stats from your actual input.
- Shows "Analyzing your notes…" while generating, with clear error states.

### 3. Quiz Generator
- You pick a topic, difficulty (Easy / Medium / Hard), and count (3 / 5 / 10).
- Gemini returns `{ questions: [{ question, options, correctAnswer, explanation }] }`.
- Both the backend **and** the frontend validate the schema (question text, exactly 4 options, in-range answer index, non-empty explanation). Invalid JSON is retried once with a stricter instruction, then a friendly error is shown — the app never crashes.
- Shows "Generating your personalized quiz…" while generating; scoring/review works exactly as before.

## Error Handling

All failure modes are mapped to user-friendly messages in `server/llm.js` and `src/utils/api.js`:

- Missing API key → `503 NOT_CONFIGURED`
- Invalid API key / auth failure → `502 AUTH_FAILED` ("Authentication failed. Please check the API configuration." / "The API key does not have permission to access this service.")
- Deprecated or wrong model → `502 MODEL_NOT_FOUND` ("The selected Gemini model ... was not found or is unavailable.")
- Bad input (empty notes/topic, too-short notes) → `400 BAD_REQUEST`
- Rate limits / quota (Gemini HTTP 429 or local limiter) → `429 RATE_LIMITED` ("Too many requests or API quota exceeded. Please wait a moment and try again.")
- Gemini 5xx → `502 SERVER_ERROR` ("The AI service encountered a temporary server error. Please try again.")
- Network errors → `503 NETWORK` ("Unable to connect to the AI service. Please check your internet connection.")
- Timeouts → `504 TIMEOUT`
- Empty or invalid Gemini JSON → retried once (stricter instruction), then `502 INVALID_RESPONSE`
- Unknown API route → `404`

**Retries:** transient Gemini errors (`429`, `503`, temporary `5xx`, network) are retried up to **3 attempts** with **exponential backoff** (`1s → 2s → 4s`). Authentication errors (invalid key) are NEVER retried. The `@google/genai` SDK also has built-in retry on transient HTTP failures.

**Server diagnostics:** every Gemini failure is logged verbosely to the server console with HTTP status, upstream status code/message, error details, and the model in use — so you can tell a `401`/`403`/`404`/`429`/`5xx`/timeout/invalid-request/malformed-response apart during development. API keys and secrets are never logged.

Technical details, stack traces, and secrets are never shown to the user or sent to the browser.

## Notes

- Tasks and chat history are stored in your browser's Local Storage under the `studymate_` prefix.
- The contact form simulates a successful submission without sending any data.
- Light / Dark / System theming is preserved and applies to every screen.

---

Built with React, Vite, Tailwind CSS, Express, and the Google Gemini API (`@google/genai`) for **Task 3: AI Website Generation**.