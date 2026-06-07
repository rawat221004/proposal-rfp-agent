# Proposal & RFP Agent with Hindsight Memory

An intelligent sales bidding and proposal generation platform designed for sales and support engineering teams. It integrates a deterministic relevance-ranked memory layer called **Hindsight** that remembers past proposals, client preferences, compliance requirements, and win/loss feedback outcomes to draft highly personalized sales proposals.

---

## 🛠️ Tech Stack & Key Files

The platform is designed with a full-stack modular architecture, optimizing data transmission and ensuring absolute security:

* **Frontend**: Single-Page React Application built on **Vite 6** + **TypeScript** + **Tailwind CSS v4** + **Lucide Icons** + **Motion**.
* **Backend**: **Node.js** & **Express** server operating as Vite middleware in development, and serving precompiled production assets in release.
* **Database Layer** (`/src/server/db.ts`): Thread-safe JSON-based local persistence that automatically hydra-seeds on launch to guarantee zero initial empty states.
* **Hindsight Memory Engine** (`/src/server/memoryRetriever.ts`): Algorithms matching incoming RFP requests against tag-similarity multipliers, previous outcome scores, and customer objections to rank relevant context.
* **AI Core** (`/server.ts`): Integrates the **`@google/genai`** SDK server-side utilizing `gemini-3.5-flash` with structured `responseSchema` guarantees.
* **Production Build System** (`/package.json`): Transpiles TypeScript files and bundles backend server endpoints into `dist/server.cjs` via **`esbuild`**.

---

## ⚙️ Environment Variables

The application relies on the following environment variables. Create a `.env` file in the root workspace to specify these values:

```env
# Google Gemini Creator API Key
# Automatically loaded by AI Studio. Never expose this to client-side bundles!
GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"

# Public Application Canonical URL (Configured by hosting pipelines)
APP_URL="http://localhost:3000"
```

---

## 📦 Local Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start Development App**:
   Runs Express full-stack on Port 3000, compounding Vite assets seamlessly:
   ```bash
   npm run dev
   ```
3. **Build Code for Production**:
   Compiles frontend assets to `/dist` and bundles the Express server to `dist/server.cjs` (CommonJS target output bypassing ES Modules filesystem constraints):
   ```bash
   npm run build
   ```
4. **Launch Server**:
   Starts standalone compiled Node server:
   ```bash
   npm run start
   ```

---

## 🔒 Security & Safe-to-Fail Fallbacks

* **Secret Separation**: The client application *never* imports Google Gemini APIs directly, preventing potential browser credential leakage. All generation runs server-side.
* **Connection Fault Tolerance**: If the Gemini API is blocked or has network issues, the backend automatically invokes high-fidelity, deterministic template engines based on active memories. The dashboard continues to work seamlessly without crashes!
