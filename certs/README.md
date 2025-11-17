# Certificate Setup for Local Testing

## Option 1: Skip mTLS (Recommended for development)

Set in `.env`:

```
SKIP_MTLS=true
NODE_ENV=development
```

## Option 2: Test mTLS locally

1. Start HTTPS server:

```bash
NODE_ENV=production node server.js
```

2. Test with client certificate:

```bash
curl -k --cert certs/apim-client-cert.pem --key certs/apim-client-key.pem https://localhost:3004/health
```

3. Expected response:

```json
{"status":"healthy","database":"connected"}
```
