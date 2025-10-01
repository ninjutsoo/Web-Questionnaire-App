# Environment Configuration Guide

This guide explains how to configure the application for shared environments and production deployment.

## Frontend Configuration

### 1. Create Environment File

Create a `.env.development.local` file in the project root (or `.env.production` for production):

```bash
# API Base URL - Replace with your host IP or domain
VITE_API_BASE_URL=http://localhost:5001

# For shared environments, use your host IP or domain:
# VITE_API_BASE_URL=http://192.168.1.100:5001
# VITE_API_BASE_URL=http://your-domain.com:5001
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

# Frontend URL for CORS and referer headers
FRONTEND_URL=http://localhost:3000

# For shared environments:
# FRONTEND_URL=http://192.168.1.100:5173
# FRONTEND_URL=http://your-domain.com:5173

# API Keys (required)
OPENROUTER_API_KEY=your_openrouter_api_key_here
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Firebase Admin Credentials (for production)
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/firebase-admin-key.json
```

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
- Use dynamic referer headers based on the request origin
- Log the configured frontend URL on startup

### 2. Start the Frontend

```bash
npm run dev
```

The frontend will:
- Run on port 5173
- Bind to `0.0.0.0` for network access
- Use the API base URL from environment variables
- Fall back to `http://localhost:5001` if not configured

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

1. **CORS Errors:** Ensure `FRONTEND_URL` matches the actual frontend URL
2. **Firebase Auth Errors:** Add your domain to Firebase authorized domains
3. **Network Access Issues:** Check firewall settings and IP binding
4. **API Connection Errors:** Verify `VITE_API_BASE_URL` is correct and backend is running

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
