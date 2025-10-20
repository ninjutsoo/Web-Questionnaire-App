# Network Access & HTTPS Configuration Guide

## The Problem with Self-Signed Certificates

The mkcert self-signed certificates (`localhost+3.pem`) only work on localhost because:

1. **Not trusted by browsers** - Self-signed certs are rejected by default
2. **Hostname mismatch** - Certificate is for "localhost", not your IP address (35.16.52.222)
3. **TLS handshake fails** - Remote devices can't establish secure connections
4. **Mixed content errors** - Browsers block HTTP→HTTPS or HTTPS→HTTP requests

## Solution: HTTP for Development, HTTPS for Production

### ✅ Current Setup (Default - HTTP)

**For local development and LAN testing:**
- Frontend runs on **HTTP** (`http://localhost:5173` or `http://35.16.52.222:5173`)
- Backend runs on **HTTP** (`http://localhost:5001`)
- **No certificate issues** - works on all devices immediately
- **Dynamic API detection** - automatically uses correct IP
- **Standard practice** for local development

### Access URLs:
- **Local**: `http://localhost:5173`
- **Network**: `http://35.16.52.222:5173` (accessible from any device on your network)
- **Backend**: `http://localhost:5001` or `http://35.16.52.222:5001`

---

## Alternative Solutions

### Option 1: Enable HTTPS for Localhost Only (Using mkcert)

**Use case:** Testing HTTPS features locally (camera, microphone, etc.)

**Setup:**
```bash
# Frontend .env.development.local
USE_HTTPS=true

# Backend .env
USE_HTTPS=true
```

**Limitations:**
- ❌ Only works on the host machine (localhost)
- ❌ Other devices will reject the certificate
- ✅ Good for testing camera/mic locally

---

### Option 2: Use a Tunnel Service (Quick Remote Testing)

**Best for:** Sharing with remote testers, demos, quick testing

#### Using Cloudflare Tunnel (Free, Recommended)

1. **Install cloudflared:**
   ```bash
   # Windows (with winget)
   winget install Cloudflare.cloudflared
   
   # Or download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
   ```

2. **Run tunnel:**
   ```bash
   # Terminal 1 - Frontend tunnel
   cloudflared tunnel --url http://localhost:5173
   
   # Terminal 2 - Backend tunnel
   cloudflared tunnel --url http://localhost:5001
   ```

3. **Get URLs:**
   - Cloudflare provides HTTPS URLs like: `https://random-name.trycloudflare.com`
   - Update frontend .env with backend tunnel URL:
     ```bash
     VITE_API_BASE_URL=https://backend-tunnel-url.trycloudflare.com
     ```

4. **Share the frontend tunnel URL** - works from anywhere with trusted HTTPS!

#### Using ngrok (Alternative)

1. **Install ngrok:** https://ngrok.com/download

2. **Run tunnels:**
   ```bash
   # Terminal 1 - Frontend
   ngrok http 5173
   
   # Terminal 2 - Backend
   ngrok http 5001
   ```

3. **Copy URLs and configure:**
   ```bash
   # .env.development.local
   VITE_API_BASE_URL=https://your-backend-url.ngrok.io
   ```

**Pros:**
- ✅ Trusted HTTPS certificates
- ✅ Works from anywhere
- ✅ Easy setup (minutes)
- ✅ Great for demos/testing

**Cons:**
- ❌ URLs change each time (unless paid plan)
- ❌ Requires internet connection
- ❌ Adds latency
- ❌ Not for production

---

### Option 3: Production Setup (Real Domain + Let's Encrypt)

**Use case:** Production deployment

#### Prerequisites:
1. **Domain name** (e.g., `myapp.example.com`)
2. **Server with public IP** (cloud VM, VPS, etc.)
3. **Ports 80 and 443 open** in firewall

#### Setup Steps:

1. **Point DNS to your server:**
   ```
   A record: myapp.example.com → YOUR_SERVER_IP
   ```

2. **Install web server (Nginx example):**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install nginx certbot python3-certbot-nginx
   ```

3. **Get SSL certificate:**
   ```bash
   sudo certbot --nginx -d myapp.example.com
   ```

4. **Configure Nginx:**
   ```nginx
   # /etc/nginx/sites-available/myapp
   server {
       listen 443 ssl http2;
       server_name myapp.example.com;
       
       # Certbot handles SSL certificates
       ssl_certificate /etc/letsencrypt/live/myapp.example.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/myapp.example.com/privkey.pem;
       
       # Serve frontend build
       location / {
           root /var/www/myapp/dist;
           try_files $uri $uri/ /index.html;
       }
       
       # Proxy API to backend
       location /api/ {
           proxy_pass http://localhost:5001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   
   # Redirect HTTP to HTTPS
   server {
       listen 80;
       server_name myapp.example.com;
       return 301 https://$server_name$request_uri;
   }
   ```

5. **Build and deploy frontend:**
   ```bash
   # On your dev machine
   npm run build
   
   # Copy dist/ to server
   scp -r dist/* user@server:/var/www/myapp/dist/
   ```

6. **Run backend as a service:**
   ```bash
   # Create systemd service: /etc/systemd/system/myapp-backend.service
   [Unit]
   Description=MyApp Backend
   After=network.target
   
   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/var/www/myapp/backend
   Environment="NODE_ENV=production"
   Environment="PORT=5001"
   ExecStart=/usr/bin/node server.js
   Restart=on-failure
   
   [Install]
   WantedBy=multi-user.target
   ```
   
   ```bash
   sudo systemctl enable myapp-backend
   sudo systemctl start myapp-backend
   ```

7. **Auto-renew certificates:**
   ```bash
   # Test renewal
   sudo certbot renew --dry-run
   
   # Certbot automatically sets up cron job for renewal
   ```

**Pros:**
- ✅ Trusted SSL certificates
- ✅ Production-ready
- ✅ SEO-friendly domain
- ✅ Full control

**Cons:**
- ❌ Requires domain ($10-15/year)
- ❌ More complex setup
- ❌ Server maintenance needed

---

## Current Configuration Summary

### Development (Default - HTTP)

**Frontend:**
- Protocol: HTTP
- URL: `http://localhost:5173` or `http://YOUR_IP:5173`
- Auto-detects API based on hostname

**Backend:**
- Protocol: HTTP (default)
- Port: 5001
- Dynamic CORS: accepts all origins
- Set `USE_HTTPS=true` in `.env` to enable HTTPS

**Environment Files:**
```bash
# .env.development.local (optional - auto-detection works without it)
VITE_API_BASE_URL=http://localhost:5001

# chat-backend/.env
PORT=5001
# USE_HTTPS=false  (default)
OPENROUTER_API_KEY=your_key
SENDGRID_API_KEY=your_key
```

---

## Troubleshooting

### Cannot access from other devices

1. **Check firewall:**
   ```bash
   # Windows
   netsh advfirewall firewall add rule name="Vite Dev Server" dir=in action=allow protocol=TCP localport=5173
   netsh advfirewall firewall add rule name="Node Backend" dir=in action=allow protocol=TCP localport=5001
   ```

2. **Verify servers are bound to 0.0.0.0:**
   ```bash
   netstat -ano | findstr ":5173 :5001"
   # Should show 0.0.0.0:5173 and 0.0.0.0:5001
   ```

3. **Check your IP address:**
   ```bash
   ipconfig  # Windows
   ifconfig  # Linux/Mac
   ```

### Mixed content errors

- Ensure both frontend and backend use the **same protocol** (both HTTP or both HTTPS)
- The app auto-detects and matches protocols

### CORS errors

- Backend uses dynamic CORS - should work automatically
- Check browser console for specific error messages
- Verify backend is running: `curl http://localhost:5001/api/health`

---

## Recommendations

- **Local dev:** Use HTTP (current setup) ✅
- **Testing camera/mic:** Use tunnel service or localhost HTTPS
- **Remote testing/demos:** Use Cloudflare Tunnel or ngrok
- **Production:** Use real domain + Let's Encrypt + Nginx/Apache

---

## Quick Start Commands

```bash
# Start backend (HTTP)
cd chat-backend
npm start

# Start frontend (HTTP)
npm run dev

# Access locally
http://localhost:5173

# Access from network
http://YOUR_IP:5173
```

To enable HTTPS for localhost testing:
```bash
# Set in both .env files
USE_HTTPS=true

# Then restart servers
```

