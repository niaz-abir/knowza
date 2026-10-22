import Chat from "@/components/Chat";
import { stats } from "@/lib/engine";

export const dynamic = "force-static";

const nav = [["Home", "#home"], ["About", "#about"], ["Ask Knowza", "#ask"]];

export default function Page() {
  const { total, hasModel } = stats();
  return (
    <main className="max-w-6xl px-3 py-4 mx-auto sm:px-6 sm:py-8">
      <section id="home" className="relative overflow-hidden rounded-[2rem] bg-forest-700 shadow-card">
        <div className="pointer-events-none absolute -right-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full border border-white/5" />
        <div className="pointer-events-none absolute -right-52 top-1/2 h-[760px] w-[760px] -translate-y-1/2 rounded-full border border-white/5" />

        {/* neon visor art */}
        <div className="visor pointer-events-none absolute right-[-60px] top-[18%] hidden h-[62%] w-[52%] md:block" aria-hidden>
          <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-forest-950 via-forest-900 to-black" />
          <div className="absolute left-[8%] top-[22%] h-[34%] w-[92%] rounded-[2.5rem] border-[10px] border-neon shadow-glow" />
          <div className="absolute left-[2%] top-[46%] h-9 w-[98%] rounded-full bg-neon shadow-glow" />
          <div className="absolute left-[30%] top-[52%] h-[40%] w-[40%] rounded-full bg-neon/60 blur-3xl" />
        </div>

        <header className="relative z-10 flex items-center justify-between p-4 sm:p-6">
          <nav className="flex gap-1 rounded-full bg-forest-800/80 p-1.5 text-sm backdrop-blur">
            {nav.map(([label, href], i) => (
              <a key={label} href={href}
                 className={`rounded-full px-4 py-2 transition ${i === 0 ? "bg-cream font-medium text-forest-900" : "text-cream/90 hover:bg-white/10"}`}>
                {label}
              </a>
            ))}
          </nav>
          <a href="#about" className="flex items-center gap-3 py-2 pl-5 pr-3 text-sm rounded-full bg-forest-900/70 text-mist">
            Menu <span className="flex gap-1"><i className="h-1.5 w-1.5 rounded-full bg-cream" /><i className="h-1.5 w-1.5 rounded-full bg-cream" /></span>
          </a>
        </header>

        <div className="relative z-10 px-6 pb-24 pt-20 sm:px-12 sm:pt-28 md:max-w-[55%]">
          <h1 className="text-5xl tracking-wide font-display sm:text-7xl">KNOWZA</h1>
          <p className="max-w-sm mt-5 text-base leading-relaxed text-cream/90">
            Ask a general knowledge question and get a straight answer. Trained on {total.toLocaleString()} questions.
          </p>
          <div className="flex items-center gap-4 mt-8">
            <a href="#ask" className="flex items-center gap-4 rounded-full bg-forest-900/70 py-3.5 pl-8 pr-5 text-sm font-medium transition hover:bg-neon hover:text-white">
              Ask a question <span className="flex gap-1"><i className="h-1.5 w-1.5 rounded-full bg-current" /><i className="h-1.5 w-1.5 rounded-full bg-current" /></span>
            </a>
            <span className="hidden text-xs text-mist sm:block">{hasModel ? "RNN model online" : "Dataset mode"}</span>
          </div>
        </div>

        <div id="about" className="relative z-10 grid gap-5 p-5 border-t border-white/5 bg-forest-900/60 backdrop-blur sm:grid-cols-3 sm:p-7">
          {[
            ["Dataset", `${total.toLocaleString()} question and answer pairs across science, history, geography and maths.`],
            ["Model", "A simple RNN reads your question word by word and predicts the first word of the answer."],
            ["Fast lookup", "Close matches in the dataset answer instantly. The RNN steps in for new wordings."],
          ].map(([t, d]) => (
            <div key={t}>
              <p className="text-sm font-medium text-neon-soft">{t}</p>
              <p className="mt-1 text-xs leading-relaxed text-mist">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="ask" className="mt-6 rounded-[2rem] bg-forest-800 p-4 shadow-card sm:p-8">
        <Chat />
      </section>

      <footer className="py-6 text-xs text-center text-forest-600">Knowza. Built with Next.js, Tailwind CSS and an RNN.</footer>
    </main>
  );
}
