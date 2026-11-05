import { expenseCategorySchema } from '@expence-tracker/shared';

export default function Home() {
  const categories = expenseCategorySchema.options;

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8">
      <h1 className="text-3xl font-bold">Expense Tracker</h1>
      <p className="text-sm opacity-70">
        Monorepo scaffold is ready. Web (Next.js) talks to the API (NestJS) and shares types via{' '}
        <code>@expence-tracker/shared</code>.
      </p>
      <section>
        <h2 className="mb-2 text-lg font-semibold">Categories from shared schema</h2>
        <ul className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <li
              key={category}
              className="rounded-full border px-3 py-1 text-sm capitalize opacity-80"
            >
              {category}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
