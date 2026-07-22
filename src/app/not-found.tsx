import Link from "next/link";

/** Plain 404 — what went wrong and the way back. */
export default function NotFound() {
  return (
    <main className="shell flex min-h-svh flex-col justify-center">
      <h1 className="type-serif text-headline font-semibold">404</h1>
      <p className="mt-4 text-base text-slate">This page doesn&apos;t exist.</p>
      <p className="mt-8">
        <Link
          href="/"
          className="transition-micro font-mono text-label text-ink transition-colors hover:text-signal"
        >
          → back to the start
        </Link>
      </p>
    </main>
  );
}
