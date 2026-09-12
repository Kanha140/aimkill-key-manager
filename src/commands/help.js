const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const helpData = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display AIMKILL KEY MANAGER commands list and usage guide');

async function executeHelp(interaction) {
    const embed = new EmbedBuilder()
        .setColor(0x38BDF8)
        .setTitle('🛡️ AIMKILL KEY MANAGER • COMMAND DIRECTORY')
        .setDescription('Centralized software licensing bot integrated with AIMKILL cloud platform.')
        .addFields(
            {
                name: '🔑 License Commands (Resellers & Admins)',
                value: [
                    '• `/create key [key] [days] [hwid_lock] [notes]` - Generate a new license key with custom duration & HWID lock.',
                    '• `/delete key [key]` - Revoke and purge a license key from the system.'
                ].join('\n'),
                inline: false
            },
            {
                name: '📍 Channel Restrictions (Admins & Owner)',
                value: [
                    '• `/channel set [channel]` - Lock bot commands exclusively to a designated channel.',
                    '• `/channel reset` - Remove channel restriction (allows commands in any channel).',
                    '• `/channel list` - Show current channel whitelist.'
                ].join('\n'),
                inline: false
            },
            {
                name: '👔 Reseller Management (Admins & Owner)',
                value: [
                    '• `/reseller add [user]` - Authorize a user to generate and delete license keys.',
                    '• `/reseller remove [user]` - Revoke reseller key generation access.',
                    '• `/reseller list` - Display all authorized resellers.'
                ].join('\n'),
                inline: false
            },
            {
                name: 'ℹ️ Shorthand Standalone Aliases',
                value: '`/createkey`, `/deletekey`, `/setchannel`, `/resetchannel`, `/reseller_add`, `/reseller_remove`',
                inline: false
            }
        )
        .setFooter({ text: 'AIMKILL KEY MANAGER • https://br-auth-all-panels.vercel.app' })
        .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = {
    commands: [
        {
            data: helpData,
            execute: executeHelp
        }
    ]
};
