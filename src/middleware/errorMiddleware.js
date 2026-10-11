const { api } = require('../utils/api')

const errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  const candidate = err?.statusCode ?? err?.code
  const statusCode =
    Number.isInteger(candidate) && candidate >= 400 && candidate <= 599
      ? candidate
      : 500

  let error = err
  if (!error || !error.message) {
    error = {
      statusCode,
      message: statusCode >= 500 ? 'Internal server error' : 'Request failed'
    }
  }

  if (statusCode >= 500) {
    console.error('❌', error.message)
  }

  return res.status(statusCode).json(api(null, statusCode, { err: error, req }))
}

module.exports = errorMiddleware
