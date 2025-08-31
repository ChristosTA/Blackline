export const validate = (schema) => (req, res, next) => {
  try {
    const target = req.method === "PATCH" ? req.body : req.body;
    const result = schema.safeParse(target);
    if (!result.success) {
      return res.status(400).json({ error: "ValidationError", details: result.error.issues });
    }
    req.validated = result.data;
    next();
  } catch (e) { next(e); }
};
