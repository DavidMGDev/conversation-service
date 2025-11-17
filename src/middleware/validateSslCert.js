// APIM Client Certificate Thumbprints (provided by user)
const ALLOWED_THUMBPRINTS = [
  'FB:90:A8:56:0C:49:FF:DB:C2:F4:51:B4:E7:15:6A:9D:49:D9:E7:9B', // SHA-1
  '05:2D:22:FF:6B:1E:AD:9C:43:FC:13:99:52:F5:4F:F2:F5:7D:C6:FF:0B:AE:80:B9:A7:D9:9C:80:6A:CB:9B:3F'  // SHA-256
];

const validateClientCertificate = (req, res, next) => {
  // Skip validation in development mode for easier testing
  if (process.env.NODE_ENV !== 'production') {
    console.log('⚠️ Development mode: Skipping client certificate validation');
    return next();
  }

  try {
    // Get the client certificate from the TLS connection
    const cert = req.connection.getPeerCertificate();

    if (!cert || !cert.fingerprint256) {
      console.error('❌ No client certificate provided');
      return res.status(401).json({
        success: false,
        message: 'Client certificate required'
      });
    }

    // Normalize thumbprints for comparison (remove colons and convert to uppercase)
    const receivedThumbprint = cert.fingerprint256.toUpperCase().replace(/:/g, '');
    const expectedThumbprints = ALLOWED_THUMBPRINTS.map(t =>
      t.toUpperCase().replace(/:/g, '')
    );

    // Validate SHA-256 thumbprint (primary validation)
    if (!expectedThumbprints.includes(receivedThumbprint)) {
      console.error('❌ Invalid certificate thumbprint:', cert.fingerprint256);
      console.error('Expected one of:', ALLOWED_THUMBPRINTS);
      return res.status(403).json({
        success: false,
        message: 'Invalid client certificate'
      });
    }

    console.log('✅ Client certificate validated successfully');
    console.log('Certificate subject:', cert.subject?.CN || 'Unknown');
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
