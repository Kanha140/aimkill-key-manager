const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { deleteKey } = require('../utils/api');
const { isReseller, validateChannel } = require('../utils/permissions');

// Subcommand version: /delete key
const deleteSubcommandData = new SlashCommandBuilder()
    .setName('delete')
    .setDescription('AIMKILL License revocation commands')
    .addSubcommand(subcommand =>
        subcommand
            .setName('key')
            .setDescription('Revoke and delete a license key (Owner & Reseller only in set channel)')
            .addStringOption(option =>
                option
                    .setName('key')
                    .setDescription('The license key to delete (e.g. AIMKILL-VIP-01)')
                    .setRequired(true)
            )
    );

// Standalone alias: /deletekey
const deleteKeyStandaloneData = new SlashCommandBuilder()
    .setName('deletekey')
    .setDescription('Revoke and delete a license key (Owner & Reseller only in set channel)')
    .addStringOption(option =>
        option
            .setName('key')
            .setDescription('The license key to delete (e.g. AIMKILL-VIP-01)')
            .setRequired(true)
    );

async function executeDeleteKey(interaction) {
    // 1. STRICT CHANNEL CHECK: Only works in the set channel!
    const channelCheck = validateChannel(interaction.channelId);
    if (!channelCheck.allowed) {
        if (channelCheck.reason === 'NOT_SET') {
            return interaction.reply({
                content: '⚠️ **Bot Channel Set Nahi Hai!**\nPehle Owner ya Admin ko `/channel set` command se channel set karna hoga tabhi bot commands work karenge.',
                ephemeral: true
            });
        }
        return interaction.reply({
            content: `❌ **Galat Channel!**\nBot sirf set kiye gaye channel me kaam karta hai: <#${channelCheck.setChannelId}>.\nKripya us channel me command chalaye!`,
            ephemeral: true
        });
    }

    // 2. STRICT RESELLER/OWNER CHECK: Only Owner or Reseller can delete keys!
    if (!isReseller(interaction.member)) {
        return interaction.reply({
            content: '🚫 **Access Denied!**\nSirf **Owner** aur authorized **Resellers** hi license key delete kar sakte hain!',
            ephemeral: true
        });
    }

    await interaction.deferReply();

    const licenseKey = interaction.options.getString('key').trim();
    const result = await deleteKey(licenseKey);

    if (!result.success) {
        return interaction.editReply({
            content: `❌ **Failed to delete key:** ${result.message || 'Key not found or could not be removed.'}`
        });
    }

    const embed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('🗑️ AIMKILL KEY MANAGER • KEY REVOKED')
        .setDescription(`License key successfully delete ho gayi aur MongoDB cloud database se purge ho chuki hai.`)
        .addFields(
            {
                name: '🔑 Deleted Key',
                value: `\`\`\`${licenseKey}\`\`\``,
                inline: false
            },
            {
                name: '👤 Revoked By',
                value: `${interaction.user} (\`${interaction.user.tag}\`)`,
                inline: true
            },
            {
                name: '⚡ Status',
                value: '🔴 **Purged from Database**',
                inline: true
            }
        )
        .setFooter({ text: 'AIMKILL KEY MANAGER • Cloud Licensing Engine' })
        .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
}

module.exports = {
    commands: [
        {
            data: deleteSubcommandData,
            execute: async (interaction) => {
                const subcommand = interaction.options.getSubcommand();
                if (subcommand === 'key') {
                    return executeDeleteKey(interaction);
                }
            }
        },
        {
            data: deleteKeyStandaloneData,
            execute: async (interaction) => {
                return executeDeleteKey(interaction);
            }
        }
    ]
};
