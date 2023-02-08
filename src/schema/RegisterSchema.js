const { z } = require("zod");

const RegisterSchema = z.object({
    username: z.string({
        required_error: "Username is required!"
    }).min(5),
    password: z.string({
        required_error: "Password is required!"
    })
});

module.exports = {
    RegisterSchema
}