import z from "zod";

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
});

const loginSchema = registerSchema;

export {
  registerSchema,
  loginSchema
};
