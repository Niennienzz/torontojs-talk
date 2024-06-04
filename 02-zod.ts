import { z } from "zod";

const newUserSchema = z.object({
  email: z.string().email(),
  nickname: z.string().min(5).max(32),
  password: z.string().min(10).max(64),
});

type NewUser = z.infer<typeof newUserSchema>;
type User = NewUser & { id: string };

const newUser = newUserSchema.parse({
  email: "joe@dragonflydb.io",
  nickname: "joe_df",
  password: "password1234Abcd#",
});

console.log(newUser);
