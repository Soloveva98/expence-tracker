import { z } from 'zod';

/**
 * Shared Zod schemas and types for the expense tracker.
 *
 * These are consumed by both the NestJS API (request validation) and the
 * Next.js web app (form validation / typed fetch), so the contract lives in
 * exactly one place. This is scaffolding — extend it as the domain grows.
 */

/** Supported expense categories. Extend as needed. */
export const expenseCategorySchema = z.enum([
  'food',
  'transport',
  'housing',
  'entertainment',
  'health',
  'other',
]);
export type ExpenseCategory = z.infer<typeof expenseCategorySchema>;

/** Payload for creating an expense. */
export const createExpenseSchema = z.object({
  title: z.string().min(1).max(120),
  amount: z.number().positive(),
  category: expenseCategorySchema,
  spentAt: z.coerce.date(),
  note: z.string().max(500).optional(),
});
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

/** A persisted expense as returned by the API. */
export const expenseSchema = createExpenseSchema.extend({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type Expense = z.infer<typeof expenseSchema>;
