# Environment Configuration Guide

This guide explains how to configure the application for local development and production deployment.

## 🔥 Quick Start (HTTP - No Configuration Needed!)

**The app now uses HTTP by default** for local development and LAN access. This avoids all certificate issues!

```bash
# 1. Start backend
cd chat-backend
npm start

# 2. Start frontend (in another terminal)
npm run dev

# 3. Access from any device:
# - Local: http://localhost:5173
# - Network: http://YOUR_IP:5173
```

✅ **No .env files needed** - the app auto-detects everything!

For HTTPS setup (production), see [NETWORK_ACCESS_GUIDE.md](./NETWORK_ACCESS_GUIDE.md)

## Frontend Configuration

### 1. Create Environment File (Optional)

The frontend now **automatically detects** the correct API URL:
- When accessed via `localhost` → uses `http://localhost:5001`
- When accessed via network IP → uses `http://[SAME_IP]:5001`
- **Matches the protocol (HTTP/HTTPS)** of the current page automatically

**For local development, no `.env` file is needed!** The system auto-adapts.

If you want to override the automatic detection, create a `.env.development.local` file:

```bash
# Optional: Override automatic API URL detection
VITE_API_BASE_URL=http://localhost:5001

# For production with HTTPS:
# VITE_API_BASE_URL=https://your-domain.com/api
```

### 2. Vite Configuration

The `vite.config.js` should already be configured to bind to `0.0.0.0` for network access:

```javascript
export default defineConfig({
  // ... other config
  server: {
    host: '0.0.0.0', // Allow external connections
    port: 5173
  }
})
```

## Backend Configuration

### 1. Create Environment File

Create a `.env` file in the `chat-backend` directory:

```bash
# Server Configuration
PORT=5001

# HTTPS Mode (default: false - uses HTTP)
# USE_HTTPS=true  # Set to true only for production or localhost HTTPS testing

# API Keys (required)
OPENROUTER_API_KEY=your_openrouter_api_key_here
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Firebase Admin Credentials (for production - optional)
# GOOGLE_APPLICATION_CREDENTIALS=path/to/your/firebase-admin-key.json

# For production with custom certificates:
# CERT_PATH=/path/to/cert.pem
# KEY_PATH=/path/to/key.pem
```

**Key Features:**
- **HTTP by default** - avoids certificate issues for local/LAN development
- **Dynamic CORS** - accepts requests from any origin automatically
- **No manual IP configuration** - detects request origin automatically
- **Optional HTTPS** - set `USE_HTTPS=true` when needed

### 2. Firebase Configuration

For production or shared environments:

1. **Firebase Console Setup:**
   - Go to Firebase Console > Authentication > Settings > Authorized domains
   - Add your host IP or domain: `http://192.168.1.100` or `http://your-domain.com`

2. **Firebase Admin Credentials:**
   - Download the Firebase Admin SDK private key from Firebase Console
   - Set `GOOGLE_APPLICATION_CREDENTIALS` to the path of the JSON file
   - Or configure Firebase Admin credentials directly in your environment

## Running for Shared Access

### 1. Start the Backend

```bash
cd chat-backend
npm start
```

The backend will:
- Run on port 5001
- Accept connections from any IP (if firewall allows)
- Use **dynamic CORS** that automatically accepts requests from any origin
- Use the actual request origin for API referer headers

### 2. Start the Frontend

```bash
npm run dev
```

The frontend will:
- Run on port 5173  
- Bind to `0.0.0.0` for network access
- Use **HTTP by default** (no certificate issues!)
- **Automatically detect** the correct API URL:
  - `http://localhost:5001` when accessed via localhost
  - `http://[YOUR_IP]:5001` when accessed via network IP
- No manual configuration needed!

### 3. Access from Other Devices

Team members can access the application at:
- `http://YOUR_IP_ADDRESS:5173` (replace with your actual IP)
- Example: `http://192.168.1.100:5173`

## Firewall Configuration

Ensure your firewall allows incoming connections on:
- Port 5173 (frontend)
- Port 5001 (backend)

### Windows Firewall

```cmd
netsh advfirewall firewall add rule name="Vite Dev Server" dir=in action=allow protocol=TCP localport=5173
netsh advfirewall firewall add rule name="Node Backend" dir=in action=allow protocol=TCP localport=5001
```

### Linux/macOS

```bash
# Ubuntu/Debian
sudo ufw allow 5173
sudo ufw allow 5001

# macOS (if using pfctl)
# Configure through System Preferences > Security & Privacy > Firewall
```

## Production Deployment

For production deployment:

1. Set `VITE_API_BASE_URL` to your production backend URL
2. Set `FRONTEND_URL` to your production frontend URL
3. Configure Firebase for your production domain
4. Use proper SSL certificates (HTTPS)
5. Set up proper environment variable management
6. Configure your web server (nginx, Apache, etc.) for proper routing

## Troubleshooting

### Common Issues

1. **CORS Errors:** The system uses dynamic CORS - if issues persist, check browser console for specific errors
2. **Firebase Auth Errors:** Add your domain/IP to Firebase authorized domains in the Firebase Console
3. **Network Access Issues:** Check firewall settings and ensure ports 5173 and 5001 are open
4. **API Connection Errors:** Verify the backend is running on port 5001 and accessible
5. **IP Address Changes:** No action needed - the system auto-adapts to new IPs!

### Debug Steps

1. Check browser DevTools Network tab for failed requests
2. Verify environment variables are loaded correctly
3. Check backend logs for CORS and referer information
4. Test API endpoints directly with curl or Postman

## Security Considerations

- Never commit `.env` files to version control
- Use strong API keys and rotate them regularly
- Configure Firebase security rules properly
- Use HTTPS in production
- Implement proper authentication and authorization
- Consider rate limiting for API endpoints
