import fs from "fs";
import path from "path";

/* Same cleaning as the notebook's tokenize() */
export function tokenize(text) {
  return String(text).toLowerCase().replace(/["']/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
}

const dir = path.join(process.cwd(), "data");
function load(name) {
  try { return JSON.parse(fs.readFileSync(path.join(dir, name), "utf8")); } catch { return null; }
}

let cache;
function init() {
  if (cache) return cache;
  const qa = load("qa.json") || [];
  const model = load("model.json"); // optional: exported from your trained notebook
  // inverse document frequency over dataset questions
  const df = {};
  const items = qa.map((r) => {
    const toks = new Set(tokenize(r.q));
    toks.forEach((t) => (df[t] = (df[t] || 0) + 1));
    return { q: r.q, a: r.a, toks };
  });
  const idf = (t) => Math.log(1 + items.length / (1 + (df[t] || 0)));
  const exact = new Map(items.map((i) => [tokenize(i.q).join(" "), i]));
  cache = { items, idf, exact, model };
  return cache;
}

export function stats() {
  const { items, model } = init();
  return { total: items.length, hasModel: !!model };
}

/* tiny calculator for "What is 284 multiplied by 6?" style questions */
function calc(question) {
  const t = tokenize(question);
  const nums = t.filter((x) => /^\d+$/.test(x)).map(Number);
  if (nums.length !== 2) return null;
  const s = t.join(" ");
  const [a, b] = nums;
  let r = null;
  if (/multiplied|times|product/.test(s)) r = a * b;
  else if (/divided/.test(s)) r = b ? Math.round((a / b) * 100) / 100 : null;
  else if (/plus|added|sum/.test(s)) r = a + b;
  else if (/minus|subtract|less/.test(s)) r = a - b;
  return r == null ? null : String(r);
}

/* RNN forward pass: embedding -> tanh RNN -> linear -> argmax (mirrors simpleRNN in the notebook) */
function rnnPredict(model, question) {
  const { vocab, E, H, V, emb, wih, whh, bih, bhh, fcw, fcb } = model;
  const ids = tokenize(question).map((t) => (t in vocab ? vocab[t] : 0));
  if (!ids.length) return null;
  let h = new Float64Array(H);
  for (const id of ids) {
    const nh = new Float64Array(H);
    for (let j = 0; j < H; j++) {
      let s = bih[j] + bhh[j];
      for (let k = 0; k < E; k++) s += wih[j * E + k] * emb[id * E + k];
      for (let k = 0; k < H; k++) s += whh[j * H + k] * h[k];
      nh[j] = Math.tanh(s);
    }
    h = nh;
  }
  const logits = new Float64Array(V);
  let max = -Infinity, best = 0;
  for (let v = 0; v < V; v++) {
    let s = fcb[v];
    for (let j = 0; j < H; j++) s += fcw[v * H + j] * h[j];
    logits[v] = s;
    if (s > max) { max = s; best = v; }
  }
  let z = 0;
  for (let v = 0; v < V; v++) z += Math.exp(logits[v] - max);
  const words = Object.keys(vocab);
  const word = words.find((w) => vocab[w] === best) ?? "<UNK>";
  return { word, confidence: 1 / z };
}

export function answer(question) {
  const { items, idf, exact, model } = init();

  const c = calc(question);
  if (c) return { answer: c, source: "calculator" };

  const key = tokenize(question).join(" ");
  if (exact.has(key)) return { answer: exact.get(key).a, source: "dataset", confidence: 1 };

  // weighted token-overlap against every dataset question
  const qt = new Set(tokenize(question));
  let best = null, bestScore = 0;
  for (const it of items) {
    let inter = 0, union = 0;
    qt.forEach((t) => { const w = idf(t); union += w; if (it.toks.has(t)) inter += w; });
    it.toks.forEach((t) => { if (!qt.has(t)) union += idf(t); });
    const score = union ? inter / union : 0;
    if (score > bestScore) { bestScore = score; best = it; }
  }
  if (best && bestScore >= 0.6) return { answer: best.a, source: "dataset", confidence: bestScore, matched: best.q };

  if (model) {
    const p = rnnPredict(model, question);
    if (p && p.word !== "<unk>" && p.word !== "<UNK>") return { answer: p.word, source: "rnn", confidence: p.confidence };
  }
  if (best && bestScore >= 0.35) return { answer: best.a, source: "dataset", confidence: bestScore, matched: best.q };
  return { answer: "I don't know that one yet. Try rewording it, or add more rows to data/qa.json.", source: "none" };
}
