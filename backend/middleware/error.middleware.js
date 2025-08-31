export const notFound = (req, res, next) => {
  res.status(404).json({ error: "NotFound", path: req.originalUrl });
};

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  console.error("[error]", message);
  if (err.stack) console.error(err.stack);
  res.status(status).json({ error: err.name || "Error", message, details: err.details || null });
};
