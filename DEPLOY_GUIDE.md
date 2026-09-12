# 🌐 AIMKILL KEY MANAGER • 24/7 CLOUD DEPLOY GUIDE

Discord bots ko 24/7 chalane ke liye persistent background runner chahiye hota hai.
Yahan 2 sabse aasan tarike diye gaye hain:

---

## ⚡ Option 1: Render.com Par 24/7 Free Deploy Kare (Recommended)

Render par bot 100% free me 24/7 live rehta hai. Is project me `render.yaml` aur built-in **Keep-Alive HTTP Server** pehle se set hai!

### Step 1: GitHub Par Code Dale
1. [github.com](https://github.com) par jaye aur **New Repository** banaye (Name: `aimkill-key-manager`).
2. Is folder (`d:\natikbotsrc`) ki files ko upload kare (ya GitHub Desktop se push kare).
   *(Note: `node_modules` upload karne ki jarurat nahi hai).*

### Step 2: Render.com Par Service Banaye
1. [render.com](https://render.com) par free account banaye ya login kare.
2. **New +** button dabaye -> **Web Service** select kare.
3. Apna GitHub repository connect kare.
4. Settings me:
   - **Name**: `aimkill-key-manager`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### Step 3: Environment Variables Dale
Niche **Environment Variables** section me 4 keys add kare:

| Key | Value |
| :--- | :--- |
| `DISCORD_TOKEN` | Aapka Discord Bot Token |
| `OWNER_ID` | Aapka Discord User ID |
| `BOT_API_KEY` | `bot_br_live_9f733b9de44c9751167f40c2` |
| `WEB_URL` | `https://br-auth-all-panels.vercel.app/` |

5. **Deploy Web Service** dabaye!

### Step 4: 24/7 Never-Sleep Keep Alive (Free)
Render ka free tier 15 minute inactivity par sleep me chala jata hai. Use rokne ke liye:
1. Render aapko ek live URL dega (e.g. `https://aimkill-key-manager.onrender.com`).
2. [cron-job.org](https://cron-job.org) ya [uptimerobot.com](https://uptimerobot.com) par jaye (Free).
3. Ek naya monitor banaye aur apna Render URL dal kar **Every 10 minutes** set kare.
4. Ab aapka bot **kabhi sleep nahi hoga aur 24/7 online rahega**!

---

## ⚡ Option 2: AIMKILL Web Panel Direct Deployer (Zero Setup)

Aapke panel (`https://br-auth-all-panels.vercel.app`) me built-in cloud bot runner hai:

1. `https://br-auth-all-panels.vercel.app/` par login kare.
2. Left sidebar me **Automation & Bots** -> **Bot Settings & Setup** ya **Discord Bots** par jaye.
3. **Deploy Bot Configuration** me:
   - **Discord Bot Token**: Aapka bot token
   - **Discord Owner ID**: Aapka numeric user ID
   - **Target Application**: `AIMKILLEXE` select kare.
4. **DEPLOY BOT NOW** dabaye!
5. Bot cloud server se connect hokar turant online aa jayega.

---

## ❓ Vercel par kyu nahi?
> **Note on Vercel**: Vercel ek *Serverless* platform hai (har request 10 second me close ho jati hai). Discord Bot ko Discord Gateway se 24/7 live WebSocket connection chahiye hota hai. Isliye Discord bots ke liye **Render**, **Koyeb**, ya **Railway** sabse best hote hain!
