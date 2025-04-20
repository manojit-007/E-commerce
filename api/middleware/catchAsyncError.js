
// Async Error Handler Middleware
export default (anyFunction) => (req, res, next) => {
  Promise.resolve(anyFunction(req, res, next)).catch(next);
};
