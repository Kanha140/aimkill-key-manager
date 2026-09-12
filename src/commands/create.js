const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { generateKey } = require('../utils/api');
const { isReseller, validateChannel } = require('../utils/permissions');

// Subcommand version: /create key
const createSubcommandData = new SlashCommandBuilder()
    .setName('create')
    .setDescription('AIMKILL License creation commands')
    .addSubcommand(subcommand =>
        subcommand
            .setName('key')
            .setDescription('Create a software license key (Owner & Reseller only in set channel)')
            .addStringOption(option =>
                option
                    .setName('key')
                    .setDescription('License key text to create (e.g. AIMKILL-VIP-01)')
                    .setRequired(true)
            )
            .addIntegerOption(option =>
                option
                    .setName('days')
                    .setDescription('License duration in days (e.g. 1, 7, 30, 90, 365, 9999 for Lifetime)')
                    .setRequired(true)
                    .addChoices(
                        { name: '1 Day (Trial)', value: 1 },
                        { name: '3 Days', value: 3 },
                        { name: '7 Days (Weekly)', value: 7 },
                        { name: '15 Days', value: 15 },
                        { name: '30 Days (Monthly)', value: 30 },
                        { name: '60 Days (2 Months)', value: 60 },
                        { name: '90 Days (Quarterly)', value: 90 },
                        { name: '180 Days (6 Months)', value: 180 },
                        { name: '365 Days (1 Year)', value: 365 },
                        { name: '9999 Days (Lifetime Unlimited)', value: 9999 }
                    )
            )
            .addBooleanOption(option =>
                option
                    .setName('hwid_lock')
                    .setDescription('Lock license to first machine hardware ID (Default: True)')
                    .setRequired(false)
            )
            .addStringOption(option =>
                option
                    .setName('notes')
                    .setDescription('Customer name, buyer tag, or notes')
                    .setRequired(false)
            )
    );

// Standalone alias: /createkey
const createKeyStandaloneData = new SlashCommandBuilder()
    .setName('createkey')
    .setDescription('Create a software license key (Owner & Reseller only in set channel)')
    .addStringOption(option =>
        option
            .setName('key')
            .setDescription('License key text to create (e.g. AIMKILL-VIP-01)')
            .setRequired(true)
    )
    .addIntegerOption(option =>
        option
            .setName('days')
            .setDescription('License duration in days (e.g. 1, 7, 30, 90, 365, 9999 for Lifetime)')
            .setRequired(true)
            .addChoices(
                { name: '1 Day (Trial)', value: 1 },
                { name: '3 Days', value: 3 },
                { name: '7 Days (Weekly)', value: 7 },
                { name: '15 Days', value: 15 },
                { name: '30 Days (Monthly)', value: 30 },
                { name: '60 Days (2 Months)', value: 60 },
                { name: '90 Days (Quarterly)', value: 90 },
                { name: '180 Days (6 Months)', value: 180 },
                { name: '365 Days (1 Year)', value: 365 },
                { name: '9999 Days (Lifetime Unlimited)', value: 9999 }
            )
    )
    .addBooleanOption(option =>
        option
            .setName('hwid_lock')
            .setDescription('Lock license to first machine hardware ID (Default: True)')
            .setRequired(false)
    )
    .addStringOption(option =>
        option
            .setName('notes')
            .setDescription('Customer name, buyer tag, or notes')
            .setRequired(false)
    );

async function executeCreateKey(interaction) {
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

    // 2. STRICT RESELLER/OWNER CHECK: Only Owner or Reseller can generate keys!
    if (!isReseller(interaction.member)) {
        return interaction.reply({
            content: '🚫 **Access Denied!**\nSirf **Owner** aur authorized **Resellers** hi license key generate kar sakte hain!',
            ephemeral: true
        });
    }

    await interaction.deferReply();

    const customKey = interaction.options.getString('key').trim();
    const days = interaction.options.getInteger('days');
    const hwidLock = interaction.options.getBoolean('hwid_lock') ?? true;
    const notes = interaction.options.getString('notes') || `Issued by ${interaction.user.tag}`;

    const result = await generateKey({
        customKey,
        days,
        hwidLock,
        notes: `${notes} (Discord: ${interaction.user.tag} / ID: ${interaction.user.id})`
    });

    if (!result.success || !result.license) {
        return interaction.editReply({
            content: `❌ **Failed to create license key:** ${result.error || 'Server rejected request or duplicate key.'}`
        });
    }

    const lic = result.license;
    const durationDisplay = days === 9999 ? '♾️ Lifetime Unlimited' : `⏳ ${days} Day(s)`;

    const embed = new EmbedBuilder()
        .setColor(0x10B981)
        .setTitle('🛡️ AIMKILL KEY MANAGER • LICENSE GENERATED')
        .setDescription(`Nayi license key successfully create ho gayi aur cloud database me sync ho chuki hai!`)
        .addFields(
            {
                name: '🔑 License Key',
                value: `\`\`\`${lic.key}\`\`\``,
                inline: false
            },
            {
                name: '⏳ Duration',
                value: durationDisplay,
                inline: true
            },
            {
                name: '🔒 HWID Lock',
                value: hwidLock ? '✅ **Enabled** (Locks to 1st PC)' : '❌ **Disabled**',
                inline: true
            },
            {
                name: '📦 Application',
                value: `\`${lic.app_name || 'AIMKILLEXE'}\``,
                inline: true
            },
            {
                name: '👤 Issued By',
                value: `${interaction.user} (\`${interaction.user.tag}\`)`,
                inline: true
            },
            {
                name: '📝 Note / Buyer',
                value: notes,
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
            data: createSubcommandData,
            execute: async (interaction) => {
                const subcommand = interaction.options.getSubcommand();
                if (subcommand === 'key') {
                    return executeCreateKey(interaction);
                }
            }
        },
        {
            data: createKeyStandaloneData,
            execute: async (interaction) => {
                return executeCreateKey(interaction);
            }
        }
    ]
};
