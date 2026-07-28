import z from "zod";

const createApplicationSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.email()
});

const updateStatusSchema = z.object({
  status: z.enum([
    "pending",
    "under_review",
    "approved",
    "rejected"
  ])
});

export {
  createApplicationSchema,
  updateStatusSchema
};
