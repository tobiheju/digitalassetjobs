import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <h1 className="font-serif text-4xl font-normal text-[#1a365d]">404</h1>
        <h2 className="text-lg font-medium text-slate-700">
          Page not found
        </h2>
        <p className="max-w-sm text-sm text-slate-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/jobs"
          className="mt-2 rounded-md bg-[#1a365d] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a4a7f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a365d] focus-visible:ring-offset-2"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
