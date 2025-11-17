const fs = require('fs');
const path = require('path');

// Load allowed thumbprints from environment or config
const ALLOWED_THUMBPRINTS = process.env.ALLOWED_CLIENT_THUMBPRINTS
  ? process.env.ALLOWED_CLIENT_THUMBPRINTS.split(',')
  : [
      '1F:2D:94:4C:C9:D8:6C:8E:B2:09:F2:AA:80:F5:22:2F:67:68:A9:15:34:1A:77:D7:13:18:88:A6:33:FE:F7:73'
    ];

const isAzureEnvironment = () => {
  // Azure App Service sets several environment variables
  return process.env.WEBSITE_SITE_NAME !== undefined ||
         process.env.WEBSITE_INSTANCE_ID !== undefined ||
         process.env.WEBSITE_SKU !== undefined;
};

const validateClientCertificate = (req, res, next) => {
  // === CRITICAL: Skip validation in Azure App Service ===
  // Azure terminates SSL at the front-end; req.socket is not a TLS socket
  if (isAzureEnvironment() || process.env.NODE_ENV === 'development' || process.env.SKIP_MTLS === 'true') {
    console.log(`⚠️ Skipping mTLS validation - Azure detected: ${isAzureEnvironment()}`);
    req.clientCertVerified = false; // Explicitly mark as not verified
    return next();
  }

  try {
    // === FIX: Use req.socket instead of req.connection ===
    const cert = req.socket.getPeerCertificate();

    // === FIX: Handle null certificate gracefully ===
    if (!cert || Object.keys(cert).length === 0) {
      console.error('❌ No client certificate provided or SSL not configured');
      return res.status(401).json({
        success: false,
        message: 'Client certificate required'
      });
    }

    // === FIX: Check for fingerprint256 existence ===
    if (!cert.fingerprint256) {
      console.error('❌ Certificate missing SHA256 fingerprint');
      return res.status(401).json({
        success: false,
        message: 'Invalid certificate format'
      });
    }

    // Normalize thumbprints for comparison
    const receivedThumbprint = cert.fingerprint256.toUpperCase().replace(/:/g, '');
    const expectedThumbprints = ALLOWED_THUMBPRINTS.map(t =>
      t.toUpperCase().replace(/:/g, '')
    );

    // Validate
    if (!expectedThumbprints.includes(receivedThumbprint)) {
      console.error('❌ Invalid certificate thumbprint:', cert.fingerprint256);
      return res.status(403).json({
        success: false,
        message: 'Invalid client certificate'
      });
    }

    console.log('✅ Client certificate validated:', cert.subject?.CN || 'Unknown');
    req.clientCertVerified = true;
    next();

  } catch (error) {
    console.error('❌ Certificate validation error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Certificate validation error'
    });
  }
};

module.exports = validateClientCertificate;
