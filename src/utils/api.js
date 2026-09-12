/**
 * BR AUTH API Client
 * Handles communication with https://br-auth-all-panels.vercel.app
 */

const WEB_URL = process.env.WEB_URL || 'https://br-auth-all-panels.vercel.app';
const BOT_API_KEY = process.env.BOT_API_KEY || 'bot_br_live_9f733b9de44c9751167f40c2';

const API_BASE = `${WEB_URL.replace(/\/$/, '')}/api/v1`;

/**
 * Generate a license key on the web panel / MongoDB
 */
async function generateKey({ customKey = '', days = 30, hwidLock = true, notes = '' }) {
    try {
        const response = await fetch(`${API_BASE}/bot/generate-key`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${BOT_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                duration_days: parseInt(days) || 30,
                hwid_lock: Boolean(hwidLock),
                custom_key: (customKey || '').trim(),
                notes: notes || 'Issued by Discord Bot'
            })
        });

        const data = await response.json();
        return data;
    } catch (err) {
        console.error('API Error [generateKey]:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Delete / Revoke a license key from the panel & database
 */
async function deleteKey(licenseKey) {
    try {
        const trimmedKey = encodeURIComponent((licenseKey || '').trim());
        const response = await fetch(`${API_BASE}/licenses/${trimmedKey}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${BOT_API_KEY}`
            }
        });

        const data = await response.json();
        return {
            status: response.status,
            success: response.ok && (data.success !== false),
            message: data.message || (response.ok ? 'Key deleted successfully' : 'Failed to delete key'),
            data
        };
    } catch (err) {
        console.error('API Error [deleteKey]:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Whitelist a channel on the server panel
 */
async function syncChannelSet(channelId) {
    try {
        const response = await fetch(`${API_BASE}/bot/channel/set`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${BOT_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ channel_id: String(channelId) })
        });
        return await response.json();
    } catch (err) {
        console.error('API Error [syncChannelSet]:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Reset whitelisted channels on the server panel
 */
async function syncChannelReset() {
    try {
        const response = await fetch(`${API_BASE}/bot/channel/reset`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${BOT_API_KEY}`
            }
        });
        return await response.json();
    } catch (err) {
        console.error('API Error [syncChannelReset]:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Add a reseller on the server panel
 */
async function syncResellerAdd(userId) {
    try {
        const response = await fetch(`${API_BASE}/bot/reseller/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${BOT_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: String(userId) })
        });
        return await response.json();
    } catch (err) {
        console.error('API Error [syncResellerAdd]:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Delete a reseller on the server panel
 */
async function syncResellerDelete(userId) {
    try {
        const response = await fetch(`${API_BASE}/bot/reseller/delete`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${BOT_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: String(userId) })
        });
        return await response.json();
    } catch (err) {
        console.error('API Error [syncResellerDelete]:', err);
        return { success: false, error: err.message };
    }
}

module.exports = {
    generateKey,
    deleteKey,
    syncChannelSet,
    syncChannelReset,
    syncResellerAdd,
    syncResellerDelete
};
