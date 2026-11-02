import { z } from 'zod';

export const matchFormSchema = z.object({
  techLeaderUserId: z.string().min(1, 'Please select a user'),
  npoUserId: z.string().min(1, 'Please select a user'),
  shortSummary: z.string().min(1, 'Please enter a short summary'),
  longSummary: z.string().min(1, 'Please enter a longer summary'),
});
