const fs = require('fs')
const path = require('path')
const { getErrorType } = require('./httpStatusMessages')

const logsDir = path.join(__dirname, '../logs')
const logFilePath = path.join(logsDir, 'error.log')

function ensureLogsDir() {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true })
  }
}

function logError(error, req) {
  ensureLogsDir()
  const timestamp = new Date().toISOString()
  const requestInfo = req ? `Request: ${req.method} ${req.originalUrl}` : 'Request: N/A'
  const errorEntry = [
    `--- ${timestamp} ---`,
    requestInfo,
    `Status: ${error.status || 500}`,
    `Message: ${error.message || 'Internal Server Error'}`,
    `Stack: ${error.stack || 'No stack trace available'}`,
    ''
  ].join('\n')

  fs.appendFileSync(logFilePath, `${errorEntry}\n`)
}

function errorHandler(err, req, res, next) {
  logError(err, req)

  if (res.headersSent) {
    return next(err)
  }

  const statusCode = err.status || 500
  const errorType = getErrorType(statusCode)

  res.status(statusCode).json({
    success: false,
    statusCode,
    errorType,
    message: err.message || 'Internal Server Error'
  })
}

module.exports = { errorHandler }
