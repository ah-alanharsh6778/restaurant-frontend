import { z } from 'zod';

export const customerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  email: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: 'Please enter a valid email address',
    }),
  phone: z
    .string()
    .optional()
    .or(z.literal('')),
  loyaltyPoints: z
    .number()
    .min(0, 'Loyalty points cannot be negative')
    .optional()
    .default(0),
});
