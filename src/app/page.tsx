export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Welcome to Clawxir</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Model Node</h2>
            <div className="bg-gray-700 p-4 rounded flex items-center space-x-4">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white">M</span>
              </div>
              <span>GPT-4</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Tool Node</h2>
            <div className="bg-gray-700 p-4 rounded flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white">T</span>
              </div>
              <span>Web Search</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Memory Node</h2>
            <div className="bg-gray-700 p-4 rounded flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white">M</span>
              </div>
              <span>Vector Store</span>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Getting Started</h2>
          <div className="prose prose-invert">
            <p>
              Clawxir helps you build and visualize AI agent circuits.
              Connect models, tools, and memory nodes to create powerful workflows.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}