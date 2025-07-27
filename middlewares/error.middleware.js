// middlewares/error.middleware.js
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
};
