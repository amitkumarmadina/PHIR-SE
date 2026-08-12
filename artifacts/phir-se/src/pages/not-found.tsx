import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-white p-4">
      <div className="w-full max-w-md p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl text-center">
        <div className="flex items-center justify-center gap-2 mb-3 text-rose-500">
          <AlertCircle className="h-8 w-8" />
          <h1 className="text-2xl font-bold">404 Page Not Found</h1>
        </div>
        <p className="text-sm text-zinc-400">
          The memory or page you are looking for does not exist.
        </p>
        <a href="/" className="inline-block mt-6 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:opacity-90 transition-opacity">
          Return to PHIR SE
        </a>
      </div>
    </div>
  );
}
