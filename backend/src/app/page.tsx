import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white font-sans antialiased">
      {/* Background ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between pb-10 border-b border-slate-800/80 gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-400 flex items-center justify-center shadow-lg shadow-purple-500/25 ring-1 ring-white/20">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
                  QuizVerse Backend Engine
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                  Vercel Ready
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Competitive Gaming • Journey Learning • Creator Substack • Authoritative Ring Matchmaking
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="/api/health"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-white text-sm font-medium transition duration-200 flex items-center space-x-2 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>/api/health</span>
            </a>
            <a
              href="/api/quizzes"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition duration-200 shadow-lg shadow-purple-600/30"
            >
              Explore Quizzes JSON
            </a>
          </div>
        </header>

        {/* Hero Quick Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 my-10">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scoring Engine</span>
            <div className="text-xl font-bold text-amber-400 mt-1">Section 15 Authoritative</div>
            <p className="text-xs text-slate-500 mt-1">Base + Speed (1-10s) + Streak + Difficulty</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">The Ring</span>
            <div className="text-xl font-bold text-cyan-400 mt-1">1v1 & Multi Arena</div>
            <p className="text-xs text-slate-500 mt-1">Dynamic MMR matchmaking & live ranks</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Learning Journey</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">Subject → Mastery</div>
            <p className="text-xs text-slate-500 mt-1">Weak area diagnostics & practice</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Database Layer</span>
            <div className="text-xl font-bold text-purple-400 mt-1">Prisma PostgreSQL</div>
            <p className="text-xs text-slate-500 mt-1">Neon / Supabase / Vercel Postgres</p>
          </div>
        </section>

        {/* API Catalog & Test Console */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
              <span>🚀</span>
              <span>Available Microservice Endpoints</span>
            </h2>
            <span className="text-xs text-slate-400">Click any link to inspect live payload</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* The Ring Matchmaking */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  POST /api/ring/matchmake
                </span>
                <span className="text-xs text-slate-400">The Ring Arena</span>
              </div>
              <p className="text-sm text-slate-300">
                Matches players based on competitive MMR, category, and preferred question types. Generates short room codes (e.g. RNG4829).
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Modes: QUICK_MATCH, 1v1, MULTI, FRIEND</span>
                <a href="/api/ring/matches/RNG1000" target="_blank" className="text-purple-400 hover:underline">
                  Sample Match →
                </a>
              </div>
            </div>

            {/* Quizzes & Question Types */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  GET /api/quizzes
                </span>
                <span className="text-xs text-slate-400">Quizzes & Categories</span>
              </div>
              <p className="text-sm text-slate-300">
                Includes Economics (Monetary Policy), AI & Distributed Systems, UPSC exams, and World Trivia across 10 question formats.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Supports Assertion/Reason & Numerical</span>
                <a href="/api/quizzes" target="_blank" className="text-purple-400 hover:underline">
                  View Quizzes →
                </a>
              </div>
            </div>

            {/* Journey Structured Learning */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  GET /api/journey
                </span>
                <span className="text-xs text-slate-400">Journey Loop</span>
              </div>
              <p className="text-sm text-slate-300">
                Structured Subject → Topic → Lesson → Practice → Mastery progression with automated weak area identification.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Section 22 & 61 Learning Loop</span>
                <a href="/api/journey" target="_blank" className="text-emerald-400 hover:underline">
                  View Learning Paths →
                </a>
              </div>
            </div>

            {/* Quiz Masters (Substack Creator model) */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  GET /api/creators
                </span>
                <span className="text-xs text-slate-400">Quiz Masters</span>
              </div>
              <p className="text-sm text-slate-300">
                Creator profiles with followers count, published quizzes, player ratings, and 1-click follow action.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Section 29 Substack Ecosystem</span>
                <a href="/api/creators" target="_blank" className="text-cyan-400 hover:underline">
                  Explore Quiz Masters →
                </a>
              </div>
            </div>

            {/* Leaderboards */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  GET /api/leaderboard?type=COMPETITIVE
                </span>
                <span className="text-xs text-slate-400">Rankings</span>
              </div>
              <p className="text-sm text-slate-300">
                Competitive MMR rating, XP levels, daily streak leaders, and Quiz Master creator rankings.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Section 47 Multi-Rankings</span>
                <a href="/api/leaderboard?type=COMPETITIVE" target="_blank" className="text-pink-400 hover:underline">
                  View Leaderboard →
                </a>
              </div>
            </div>

            {/* Tournaments */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  GET /api/tournaments
                </span>
                <span className="text-xs text-slate-400">Tournaments</span>
              </div>
              <p className="text-sm text-slate-300">
                Daily Arena Cup, Inter-College Championship, entry coin pools, brackets and qualification stages.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Section 36 Tournament Brackets</span>
                <a href="/api/tournaments" target="_blank" className="text-indigo-400 hover:underline">
                  View Tournaments →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Vercel Deployment Instructions */}
        <section className="mt-12 p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/90 shadow-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-6 h-6 text-white" viewBox="0 0 76 65" fill="currentColor">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
            <h3 className="text-lg font-bold text-white">Deploying Backend to Vercel</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            This Next.js backend is configured with serverless API routes compatible with Vercel and Neon/Supabase PostgreSQL.
          </p>
          <div className="mt-4 p-4 rounded-xl bg-black/60 border border-slate-800 font-mono text-xs text-slate-300 space-y-2 overflow-x-auto">
            <div><span className="text-slate-500"># 1. Push repo to GitHub & import into Vercel</span></div>
            <div><span className="text-purple-400">git add . && git commit -m &quot;feat: quizverse backend ready for vercel&quot;</span></div>
            <div><span className="text-slate-500"># 2. Add Environment Variables in Vercel Dashboard</span></div>
            <div><span className="text-emerald-400">DATABASE_URL</span>=&quot;postgresql://...&quot;</div>
            <div><span className="text-emerald-400">JWT_SECRET</span>=&quot;your-production-secret&quot;</div>
            <div><span className="text-slate-500"># 3. Prisma Client automatically generates via npm postinstall</span></div>
          </div>
        </section>
      </div>
    </div>
  );
}
