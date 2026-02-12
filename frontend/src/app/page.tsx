import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-emerald-500 bg-clip-text text-transparent">
                Clawxir
              </span>
            </div>
            <nav>
              <Link 
                href="https://github.com/fbtopg/Clawxir" 
                className="text-zinc-400 hover:text-white transition-colors"
                target="_blank"
              >
                GitHub
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-8">
              Visualize Your{' '}
              <span className="bg-gradient-to-r from-violet-500 to-emerald-500 bg-clip-text text-transparent">
                OpenClaw Bot
              </span>
            </h1>
            <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
              See your bot's architecture in real-time with beautiful circuit visualizations.
              One command to install, one click to connect.
            </p>
            
            {/* Install Command */}
            <div className="bg-zinc-900 rounded-lg p-4 mb-8 max-w-lg mx-auto">
              <code className="text-emerald-400">clawhub install clawxir</code>
            </div>

            {/* Connect Button */}
            <button className="bg-gradient-to-r from-violet-500 to-emerald-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:opacity-90 transition-opacity mb-16">
              Visualize My Bot
            </button>
          </div>

          {/* Example Screenshots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="aspect-video relative bg-zinc-800 rounded-lg overflow-hidden mb-4">
                <Image
                  src="/example-1.png"
                  alt="Circuit visualization example"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Circuit View</h3>
              <p className="text-zinc-400">Watch your bot's components interact in real-time</p>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4">
              <div className="aspect-video relative bg-zinc-800 rounded-lg overflow-hidden mb-4">
                <Image
                  src="/example-2.png"
                  alt="Data flow example"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">Beautiful Data Flows</h3>
              <p className="text-zinc-400">See data moving between components with animated flows</p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900 p-6 rounded-lg">
              <div className="w-12 h-12 bg-violet-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">One-Click Setup</h3>
              <p className="text-zinc-400">Install the skill and click to connect. That's it!</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-lg">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
              <p className="text-zinc-400">Only visualizes architecture, never sees your data</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Customizable</h3>
              <p className="text-zinc-400">Themes, layouts, and animation styles</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-zinc-400">
            Built for the OpenClaw community.{' '}
            <Link 
              href="https://github.com/fbtopg/Clawxir"
              className="text-violet-500 hover:text-violet-400 transition-colors"
              target="_blank"
            >
              View on GitHub
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}