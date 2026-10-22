"use client";
import { useEffect, useRef, useState } from "react";

const ideas = [
  "What is the capital of France?",
  "Who invented the telephone?",
  "Which planet is known as the red planet?",
  "What is 284 multiplied by 6?",
];

const sourceLabel = { dataset: "Dataset match", calculator: "Calculator", rnn: "RNN prediction", none: "No answer" };

export default function Chat() {
  const [msgs, setMsgs] = useState([{ role: "bot", text: "Hi, I'm Knowza. Ask me a general knowledge question." }]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const box = useRef(null);

  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight, behavior: "smooth" }); }, [msgs, busy]);

  async function ask(text) {
    const question = text.trim();
    if (!question || busy) return;
    setQ("");
    setMsgs((m) => [...m, { role: "user", text: question }]);
    setBusy(true);
    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const d = await r.json();
      setMsgs((m) => [...m, { role: "bot", ...d, text: d.answer }]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: "Couldn't reach the server. Check your connection and try again.", source: "none" }]);
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="font-display text-2xl sm:text-3xl">Ask Knowza</h2>

      <div ref={box} aria-live="polite" className="scroll-thin mt-6 flex h-[420px] flex-col gap-3 overflow-y-auto rounded-3xl bg-forest-950/60 p-4 sm:p-5">
        {msgs.map((m, i) => (
          <div key={i} className={`max-w-[85%] ${m.role === "user" ? "self-end" : "self-start"}`}>
            <div className={`rounded-3xl px-5 py-3 text-[15px] leading-relaxed ${
              m.role === "user" ? "rounded-br-md bg-neon text-white" : "rounded-bl-md bg-forest-700 text-cream"}`}>
              {m.text}
            </div>
            {m.source && (
              <p className="mt-1 px-2 text-xs text-mist">
                {sourceLabel[m.source]}
                {m.confidence != null && ` · ${Math.round(m.confidence * 100)}% sure`}
                {m.matched && ` · matched “${m.matched}”`}
              </p>
            )}
          </div>
        ))}
        {busy && <div className="self-start rounded-3xl rounded-bl-md bg-forest-700 px-5 py-3 text-mist">Thinking…</div>}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {ideas.map((s) => (
          <button key={s} onClick={() => ask(s)} className="rounded-full bg-forest-700 px-4 py-2 text-xs text-cream/90 transition hover:bg-forest-600">{s}</button>
        ))}
      </div>

      <div className="mt-4 flex gap-2 rounded-full bg-forest-950/70 p-2 pl-6">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask(q)}
          placeholder="Type your question" aria-label="Your question"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-cream placeholder:text-mist/70 focus:outline-none" />
        <button onClick={() => ask(q)} disabled={busy || !q.trim()}
          className="rounded-full bg-neon px-6 py-3 text-sm font-medium text-white transition hover:bg-neon-deep disabled:opacity-40">Ask</button>
      </div>
    </div>
  );
}
