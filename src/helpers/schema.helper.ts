import { z } from "zod";

export const UserLogin = z.object({
    username: z.string({
        required_error: "Username is required!"
    }),
    password: z.string({
        required_error: "Password is required!"
    })
});
export type UserLogin = z.infer<typeof UserLogin>;