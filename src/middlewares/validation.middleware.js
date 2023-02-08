const { z } = require("zod");

const LoginSchema = z.object({
    // In this example we will only validate the request body.
    body: z.object({
      // email should be valid and non-empty
      username: z.string().min(3),
      // password should be at least 6 characters
      password: z.string().min(6),
    }),
});

const validate = (schema) => (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
  
      next();
    } catch (err) {
      return res.status(400).send(err.errors);
    }
};

module.exports = {

}