# Knowza

General-knowledge answering app. Next.js 14 (App Router) + Tailwind CSS. The answer engine runs in a Next.js API route (`/api/ask`), so no separate backend is needed.

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000
```

## Use YOUR 5,704 questions (important)
The folder ships with a small sample dataset (`data/qa.json`, 71 rows). To use your real data, do ONE of these:

**A. From the notebook (recommended, also exports the RNN)**
1. Open your notebook, train as usual.
2. Paste `scripts/export_rnn.py` into a last cell and run it. It creates `model.json` and `qa.json`.
3. Put both files in `knowza/data/` (replace `qa.json`).

**B. From CSVs only (no RNN)**
```bash
python scripts/csv_to_json.py path/to/folder_with_a-f_csv
```

## How answers are chosen
1. Calculator for "What is 284 multiplied by 6?" style questions
2. Exact or close match in `qa.json` (TF-IDF weighted word overlap)
3. RNN prediction from `data/model.json` (your trained `simpleRNN`, run in plain JavaScript)
4. Weak dataset match, otherwise "I don't know"

Note: your RNN predicts only the first word of an answer, so the dataset lookup handles full answers.

## Deploy on Vercel
Push to GitHub, import the repo on vercel.com, click Deploy. No env vars needed. (Or `npx vercel`.)
Keep `data/model.json` under ~30 MB (`round(...,4)` in the export script keeps it small).

## Colors
forest `#2f4d43` · deep forest `#16251f` · neon orange `#ff5a1f` · cream `#f2ede4` · mist `#a8bdb2`
