const logger = (req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const origin = req.headers.origin || 'Unknown';
  
  // Log request details
  console.log('\n' + '='.repeat(80));
  console.log(`📡 [${timestamp}] NEW REQUEST`);
  console.log('='.repeat(80));
  console.log(`🔹 Method: ${method}`);
  console.log(`🔹 URL: ${url}`);
  console.log(`🔹 IP: ${ip}`);
  console.log(`🔹 Origin: ${origin}`);
  console.log(`🔹 User-Agent: ${userAgent.substring(0, 100)}...`);
  
  // Log request body if exists (excluding sensitive data)
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    // Remove sensitive fields
    if (sanitizedBody.password) sanitizedBody.password = '***';
    if (sanitizedBody.currentPassword) sanitizedBody.currentPassword = '***';
    if (sanitizedBody.newPassword) sanitizedBody.newPassword = '***';
    console.log(`🔹 Body: ${JSON.stringify(sanitizedBody, null, 2)}`);
  }
  
  // Log query params if exists
  if (req.query && Object.keys(req.query).length > 0) {
    console.log(`🔹 Query: ${JSON.stringify(req.query, null, 2)}`);
  }
  
  console.log('='.repeat(80));
  
  // Capture response
  const originalSend = res.send;
  res.send = function(data) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    const statusCode = res.statusCode;
    
    console.log('\n' + '='.repeat(80));
    console.log(`✅ [${new Date().toISOString()}] RESPONSE COMPLETED`);
    console.log('='.repeat(80));
    console.log(`🔹 Status: ${statusCode}`);
    console.log(`🔹 Duration: ${duration}ms`);
    console.log(`🔹 URL: ${method} ${url}`);
    
    if (statusCode >= 400) {
      console.log(`⚠️ Error Response: ${data}`);
    }
    
    console.log('='.repeat(80) + '\n');
    
    originalSend.call(this, data);
  };
  
  next();
};
module.exports = logger;