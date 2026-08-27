export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">Template scaffold</h1>
      <p className="mt-4 text-muted-foreground">
        Replace this page with your template home page. Shared auth, leads, and admin login
        already live in packages/core — import from <code>@/auth</code>,{" "}
        <code>@/lib/features/leads</code>, etc.
      </p>
    </main>
  );
}
