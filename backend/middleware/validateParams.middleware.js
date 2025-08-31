export const validateParams = (schema) => (req, res, next) => {
  const r = schema.safeParse(req.params);
  if (!r.success) return res.status(400).json({ error: "ValidationError", details: r.error.issues });
  req.validatedParams = r.data;
  next();
};
