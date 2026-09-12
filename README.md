# 🛡️ AIMKILL KEY MANAGER • DISCORD BOT SOURCE CODE

Complete Discord Slash Commands Licensing Bot Source Code for **AIMKILL KEY MANAGER** (`https://br-auth-all-panels.vercel.app`).

---

## ⚡ Features (Aapke Features)

1. **`/create key` (ya `/createkey`)**
   - **Reseller aur Admin** ke liye key generate karta hai.
   - **Ask Key & Days**: Custom Key name aur Duration in Days (1, 3, 7, 15, 30, 90, 365, 9999 Days for Lifetime) poochta hai.
   - **HWID Lock (Hardware Lock)**: Default ON rehta hai (First login PC par lock).
   - **Channel Lock**: Sirf set kiye gaye channel me kaam karta hai.
   - **Reseller Protection**: Sirf authorized Resellers aur Admins hi use kar sakte hain.

2. **`/delete key` (ya `/deletekey`)**
   - Database (MongoDB) aur panel se key delete/revoke karta hai.
   - Reseller aur Admin access only.

3. **`/channel set` (ya `/setchannel`)**
   - Bot ke commands ko specific channel me lock kar deta hai.
   - Set karne ke baad bot sirf usi channel me response dega.

4. **`/channel reset` (ya `/resetchannel`)**
   - Channel lock hata deta hai, bot pure server me kahi bhi chalega.

5. **`/reseller add` (ya `/reseller_add`)**
   - Kisi bhi Discord member ko Reseller banata hai taaki wo keys create/delete kar sake.

6. **`/reseller remove` (ya `/reseller_remove`)**
   - Reseller ki permissions khatam/revoke karta hai.

---

## 🚀 Setup & Installation (Bot Kaise Chalaye)

### Step 1: Discord Bot Token Nikale
1. [Discord Developer Portal](https://discord.com/developers/applications) par jaye.
2. **New Application** banaye (Name: `AIMKILL KEY MANAGER`).
3. Left menu me **Bot** par jaye:
   - **Reset Token** dabaye aur Token copy kare.
   - **Privileged Gateway Intents** me:
     - `SERVER MEMBERS INTENT` -> ON
     - `MESSAGE CONTENT INTENT` -> ON
4. Left menu me **OAuth2** -> **URL Generator** par jaye:
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: `Administrator` (ya Send Messages, Embed Links, Read Message History)
   - Niche Generated URL copy karke browser me khole aur apne Discord server me bot ko invite kare.

---

### Step 2: `.env` File Configure Kare
`d:\natikbotsrc\.env` file open kare:

```env
DISCORD_TOKEN=Aapka_Discord_Bot_Token_Yahan_Dale
OWNER_ID=Aapka_Discord_User_ID_Yahan_Dale
BOT_API_KEY=bot_br_live_9f733b9de44c9751167f40c2
WEB_URL=https://br-auth-all-panels.vercel.app/
```

> **Note**: Apna Discord User ID nikalne ke liye Discord settings me Developer Mode ON kare, fir apni profile par right click karke **Copy User ID** dabaye.

---

### Step 3: Bot Start Kare
Windows par direct:
- **`start.bat`** par double click kare!

Ya terminal me:
```bash
npm start
```

Bot online aate hi automatically sare Slash Commands Discord me register aur sync kar dega!

---

## 📖 Commands Guide (Command Kaise Use Kare)

| Command | Shorthand | Who Can Use | Description |
| :--- | :--- | :--- | :--- |
| `/create key` | `/createkey` | **Resellers & Admins** | Nayi license key banata hai (Key, Days, HWID Lock, Notes) |
| `/delete key` | `/deletekey` | **Resellers & Admins** | Purani key delete/revoke karta hai |
| `/channel set` | `/setchannel` | **Owner & Admins** | Bot commands ko specific channel me lock karta hai |
| `/channel reset` | `/resetchannel` | **Owner & Admins** | Channel lock hata deta hai |
| `/channel list` | - | **Everyone** | Whitelisted channels ki list dikhata hai |
| `/reseller add` | `/reseller_add` | **Owner & Admins** | Kisi user ko reseller banata hai |
| `/reseller remove` | `/reseller_remove`| **Owner & Admins** | Reseller permission hatata hai |
| `/reseller list` | - | **Everyone** | Current resellers ki list dikhata hai |
| `/help` | - | **Everyone** | Full commands directory aur help menu |

---

## 🔒 Security Architecture
- **Persistent Storage**: Resellers aur Channel settings `config.json` me save hoti hain.
- **Direct Cloud Sync**: Jab aap `/create key` ya `/delete key` karte hain, ye direct `https://br-auth-all-panels.vercel.app/api/v1` MongoDB par real-time sync hota hai.
- **Python Version**: Agar aap Linux/VPS par Python use karna chahte hain, to `python_version/` folder me `bot.py` aur `requirements.txt` bhi ready hai!
