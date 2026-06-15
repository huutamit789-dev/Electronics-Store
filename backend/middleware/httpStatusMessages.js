const statusErrorType = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  304: 'Not Modified',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  409: 'Conflict',
  410: 'Gone',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout'
}

function getErrorType(statusCode) {
  if (!statusCode || statusCode >= 500) {
    return statusErrorType[statusCode] || 'Server Error'
  }

  if (statusCode >= 400) {
    return statusErrorType[statusCode] || 'Client Error'
  }

  if (statusCode >= 300) {
    return statusErrorType[statusCode] || 'Redirect'
  }

  if (statusCode >= 200) {
    return statusErrorType[statusCode] || 'Success'
  }

  return statusErrorType[statusCode] || 'Information'
}

module.exports = { getErrorType, statusErrorType }
