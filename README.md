# OS3 — AI-assisted note taking

A lightweight note-taking app with Google Gemini wired in, built to test a specific idea: that the useful AI feature in a notes app isn't generation, it's **retrieval of what you already wrote and forgot**.

`TypeScript` · `React` · `Vite` · `Google Gemini API`

---

## Why I built it

Most AI note apps optimise for producing more text. That's the wrong end of the problem — the failure mode in personal notes isn't a blank page, it's that six months of notes become write-only storage you never search again.

OS3 is a small prototype for the opposite behaviour: capture stays fast and plain, and the model's job is surfacing relevance across existing notes.

## Running it locally

**Prerequisites:** Node.js 18+

```bash
npm install
cp .env.local.example .env.local   # add your GEMINI_API_KEY
npm run dev
```

Set `GEMINI_API_KEY` in `.env.local` to a key from [Google AI Studio](https://aistudio.google.com/apikey).

## Status

Working prototype. Scaffolded with Google AI Studio, then modified.

**What I'd do next:** local embeddings so retrieval works offline and notes never leave the device — the current version sends context to the API, which is the wrong tradeoff for personal notes.

## License

MIT
