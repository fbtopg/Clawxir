export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-violet-500 mb-4"></div>
        <p className="text-zinc-400">Connecting to your bot...</p>
      </div>
    </div>
  );
}