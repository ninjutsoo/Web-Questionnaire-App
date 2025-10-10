# HTTPS Setup Verification Guide

## ✅ Setup Completed

The following changes have been made to enable HTTPS with trusted certificates:

1. ✅ Installed `vite-plugin-mkcert` package
2. ✅ Updated `vite.config.js` to enable HTTPS
3. ✅ Installed mkcert local Certificate Authority
4. ✅ Created `start-dev-https.bat` helper script
5. ✅ Updated `.gitignore` to exclude certificates
6. ✅ Updated README.md with HTTPS instructions

## 🚀 How to Start the Server

### Windows (Recommended):
```bash
start-dev-https.bat
```

### Or Manually:
```bash
set PATH=%PATH%;C:\Users\mrosh\Downloads
npm run dev
```

## 🧪 Verification Steps

### 1. Check HTTPS is Working
- Open browser to: `https://localhost:5174` (or the port shown in terminal)
- Look for the 🔒 padlock icon in the address bar
- Click the padlock and verify the certificate is trusted (no warnings)

### 2. Test Camera Access (QR Scanner)
1. Sign in to your account
2. Go to **Questionnaire** → **Medications** section
3. Click the camera/QR scanner button
4. Browser should prompt for camera permission (click Allow)
5. Camera feed should appear without errors

### 3. Test Microphone Access (AI Chatbot)
1. Go to **AI Assistant** tab
2. Look for the microphone icon/toggle
3. Click to enable voice input
4. Browser should prompt for microphone permission (click Allow)
5. Speak and verify your speech is transcribed

### 4. Test Location Access (AI Chatbot)
1. In the **AI Assistant** tab
2. Toggle the location switch (EnvironmentOutlined icon)
3. Browser should prompt for location permission (click Allow)
4. Location should be shared with AI responses

### 5. Test Network Access (Other Devices)
1. Find your LAN IP: **35.16.37.243**
2. On another device (phone/tablet), open: `https://35.16.37.243:5174`
3. You may see a certificate warning on the device (this is normal - the mkcert CA is only installed on your dev machine)
4. Click "Advanced" → "Proceed anyway" (or similar)
5. Test camera/microphone permissions - they should work!

## 📱 Network Access Notes

**Important:** Other devices will show a certificate warning because the mkcert CA is only installed on your development machine. This is expected behavior. 

**Options:**
- For quick testing: Just accept the warning and proceed
- For trusted access: Install the mkcert CA on the other device (see [mkcert docs](https://github.com/FiloSottile/mkcert))

## 🔍 Troubleshooting

### Mixed Content Error (HTTPS → HTTP blocked)
**Error:** "Mixed Content: The page at 'https://...' requested an insecure XMLHttpRequest endpoint 'http://...'"

**Fix:**
1. Update `.env.development.local`: Change `VITE_API_BASE_URL` from `http://` to `https://`
2. Update `chat-backend/.env`: Change `FRONTEND_URL` from `http://` to `https://`
3. Restart backend: `cd chat-backend && npm run dev`
4. Restart frontend: Refresh browser

The backend will auto-detect HTTPS certificates and run on HTTPS!

### Server won't start
- Make sure mkcert.exe is at: `C:\Users\mrosh\Downloads\mkcert.exe`
- Run `mkcert -install` again if needed

### Certificate not trusted
- Open PowerShell as Administrator
- Run: `C:\Users\mrosh\Downloads\mkcert.exe -install`
- Restart your browser

### Camera/Microphone still blocked
- Verify you're using HTTPS (look for 🔒 in address bar)
- Check browser permissions: Settings → Privacy & Security → Site Settings
- Make sure the site has HTTPS (not HTTP)

### Port already in use
- If port 5173 is in use, Vite will automatically try 5174, 5175, etc.
- Check the terminal output for the actual port being used
- Update your access URL accordingly

## 📊 Current Server Status

- **Local URL:** https://localhost:5174
- **Network URL:** https://35.16.37.243:5174
- **Status:** ✅ Running with HTTPS
- **Certificate:** ✅ Trusted (mkcert CA installed)

## 🎉 Success Criteria

You'll know everything is working when:
- ✅ Browser shows 🔒 padlock (no warnings on localhost)
- ✅ Camera permission prompt appears and works
- ✅ Microphone permission prompt appears and works
- ✅ Location permission prompt appears and works
- ✅ Network access works (even with warning, permissions still function)

## 📝 For Team Members

Share these instructions:
1. Install mkcert from: https://github.com/FiloSottile/mkcert/releases
2. Run: `mkcert -install`
3. Clone the repo and run: `start-dev-https.bat` (Windows) or `npm run dev` (Mac/Linux)
4. Access `https://localhost:5173` (or the port shown)

---

**Note:** The warning on network devices is cosmetic - camera/microphone/location APIs will still work because the connection is HTTPS, just not with a publicly trusted certificate.

