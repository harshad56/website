# ✅ Run Server on Port 3000 - Simple Guide

## 🎯 Quick Start (2 Steps)

### Step 1: Stop All Running Servers

**Press `Ctrl + C` in ALL terminal windows** where servers are running.

### Step 2: Start Servers (2 Terminals)

**Terminal 1 - Backend (Port 5000):**
```powershell
cd syntax-stage-builder-main\backend
npm run dev
```
Wait for: `🚀 CodeAcademy Pro Backend running on port 5000`

**Terminal 2 - Frontend (Port 3000):**
```powershell
cd syntax-stage-builder-main
npm run dev
```
Wait for: `Local: http://localhost:3000/` and `Network: http://192.168.0.102:3000/`

## ✅ Verify It's Working

1. **Open browser:** http://localhost:3000 or http://192.168.0.102:3000
2. **You should see the website!** (not blank page)

## 🔧 If Port 3000 is Still Busy

Run this command to kill any process on port 3000:

```powershell
# Find and kill process on port 3000
$port = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port) {
    Stop-Process -Id $port.OwningProcess -Force
    Write-Host "✅ Port 3000 cleared"
}
```

Then start the frontend server again.

## 📝 Important Notes

- ✅ **Port 3000** is now **locked** - server will fail if port is busy (instead of using 3001)
- ✅ **Both servers must run** - backend on 5000, frontend on 3000
- ✅ **Environment files** are configured for network IP (192.168.0.102)

## 🆘 Troubleshooting

**"Port 3000 is in use" error:**
- Kill the process: `Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force`
- Wait 2 seconds
- Start server again

**Still blank page:**
- Check browser console (F12)
- Make sure backend is running on port 5000
- Clear browser cache (Ctrl + Shift + Delete)

---

**Your website will now run on port 3000!** 🎉


