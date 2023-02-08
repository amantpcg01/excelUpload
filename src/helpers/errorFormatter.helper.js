const { ZodIssue, ZodError } = require("zod");

const formatZodErrors  = (errors) => {
    return errors.issues.map((error) => `${error.path[0]}: ${error.message}`);
}

module.exports = formatZodErrors;