# Legal Advice Knowledge Base

An India-focused legal guidance website that provides three practical legal options, step-by-step actions, and relevant official sources. It includes offline guidance for supported legal topics, so the demo does not require API credentials or an internet connection.

## Quick Start — Run the Project

**Prerequisites:** Node.js and npm installed.

### First-time setup

From the project folder, install dependencies and start both the API and website:

```bash
cd "/Users/kushal/Documents/projects/AI PROJECT"
npm install
npm run dev
```

### Every subsequent demo

Open a terminal in the project folder and run:

```bash
npm run dev
```

This single command starts the API on port `3001` and the Vite website, normally at `http://localhost:5173/`. If port `5173` is already in use, Vite selects the next available port and prints the exact URL in the terminal. For this workspace, the current running app is at `http://localhost:5175/`.

No API keys are needed to start or demonstrate supported offline questions. Enter a question in the site and select **Analyse**; offline answers include three escalating options and saved official source links. Saved source links are not checked live in offline mode.

## Optional online providers

To enable AI answers and live official-domain research, copy `.env.example` to `.env` and add server-side provider credentials. Gemini and OpenRouter can provide AI analysis; Tavily is the primary live search provider, with Brave as an optional fallback. Keep credentials in `.env`; never put them in a `VITE_` variable or commit that file. `/api/health` reports configuration status without exposing key values.

Online services are optional. Provider failures and unavailable networks fall back to the built-in local knowledge base. A one-minute in-memory cooldown avoids repeating slow failed requests.

## Offline coverage and limitations

Offline topics include traffic and helmet challans, challan disputes, rental deposit disputes, unpaid salary, consumer complaints, online financial fraud, online harassment or threats, legal notices, and contract disputes. Topic matching is local and rule-based; unfamiliar issues receive a general evidence checklist and follow-up questions.

Guidance is educational information, not a substitute for advice from a qualified Indian lawyer. Procedures, deadlines, and case-specific legal rules need current verification. Offline source URLs are saved references and are not checked live. Avoid entering names, phone numbers, account details, or other identifying information.

## Development checks

```bash
npm test
npm run build
npm run lint
```

The test suite mocks provider requests and covers failover, model rotation, research fallback, offline network failures, topic matching, input validation, and diagnostics. For a local backend test with all external requests mocked as unavailable, run `node server.js --simulate-offline` while the Vite frontend is running. Restart with `node server.js` for normal online-capable operation.
