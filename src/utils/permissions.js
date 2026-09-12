const { PermissionsBitField } = require('discord.js');
const { loadConfig } = require('./config');

/**
 * Check if the user is the Bot Owner or Server Owner / Admin
 */
function isOwner(member) {
    if (!member) return false;
    const configuredOwner = (process.env.OWNER_ID || '').trim();

    // 1. Configured Owner ID in .env
    if (configuredOwner && String(member.id) === configuredOwner) {
        return true;
    }

    // 2. Discord Server Owner
    if (member.guild && member.guild.ownerId && String(member.id) === String(member.guild.ownerId)) {
        return true;
    }

    // 3. Server Administrator Permission
    if (member.permissions?.has(PermissionsBitField.Flags.Administrator)) {
        return true;
    }

    return false;
}

/**
 * Check if the user is an authorized Reseller (or Owner)
 */
function isReseller(member) {
    if (!member) return false;
    if (isOwner(member)) return true;

    const config = loadConfig();
    const resellers = config.resellers || [];
    return resellers.includes(String(member.id));
}

/**
 * Get the currently set channel ID
 */
function getSetChannel() {
    const config = loadConfig();
    if (config.set_channel) {
        return config.set_channel;
    }
    if (Array.isArray(config.allowed_channels) && config.allowed_channels.length > 0) {
        return config.allowed_channels[0];
    }
    return null;
}

/**
 * Check channel restrictions
 * Returns:
 *   { allowed: true } if valid channel
 *   { allowed: false, reason: 'NOT_SET' | 'WRONG_CHANNEL', setChannelId: string }
 */
function validateChannel(channelId) {
    const setChannelId = getSetChannel();

    if (!setChannelId) {
        return {
            allowed: false,
            reason: 'NOT_SET',
            setChannelId: null
        };
    }

    if (String(channelId) === String(setChannelId)) {
        return {
            allowed: true,
            reason: 'OK',
            setChannelId
        };
    }

    return {
        allowed: false,
        reason: 'WRONG_CHANNEL',
        setChannelId
    };
}

module.exports = {
    isOwner,
    isReseller,
    getSetChannel,
    validateChannel
};
