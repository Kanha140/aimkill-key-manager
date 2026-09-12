const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const { loadConfig, saveConfig } = require('../utils/config');
const { isOwner } = require('../utils/permissions');
const { syncChannelSet, syncChannelReset } = require('../utils/api');

// Subcommand version: /channel set, /channel reset, /channel list
const channelSubcommandData = new SlashCommandBuilder()
    .setName('channel')
    .setDescription('Configure designated channel for bot commands (Owner/Admin only)')
    .addSubcommand(subcommand =>
        subcommand
            .setName('set')
            .setDescription('Set the channel where bot commands will work')
            .addChannelOption(option =>
                option
                    .setName('channel')
                    .setDescription('Channel to set (Defaults to current channel)')
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(false)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('reset')
            .setDescription('Reset bot channel setting (Remove channel lock)')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('list')
            .setDescription('Show the currently set bot channel')
    );

// Standalone aliases: /setchannel and /resetchannel
const setChannelStandaloneData = new SlashCommandBuilder()
    .setName('setchannel')
    .setDescription('Set the channel where bot commands will work (Owner/Admin only)')
    .addChannelOption(option =>
        option
            .setName('channel')
            .setDescription('Channel to set (Defaults to current channel)')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
    );

const resetChannelStandaloneData = new SlashCommandBuilder()
    .setName('resetchannel')
    .setDescription('Reset bot channel setting (Owner/Admin only)');

async function handleChannelSet(interaction) {
    if (!isOwner(interaction.member)) {
        return interaction.reply({
            content: '👑 **Access Denied:** Sirf **Owner** ya **Administrator** hi bot channel set kar sakte hain!',
            ephemeral: true
        });
    }

    const targetChannel = interaction.options.getChannel('channel') || interaction.channel;
    const config = loadConfig();

    config.set_channel = targetChannel.id;
    config.allowed_channels = [targetChannel.id];
    saveConfig(config);

    // Sync with web panel API in background
    syncChannelSet(targetChannel.id).catch(() => {});

    const embed = new EmbedBuilder()
        .setColor(0x3B82F6)
        .setTitle('📍 AIMKILL KEY MANAGER • CHANNEL SET')
        .setDescription(`Bot channel successfully set ho gaya hai!`)
        .addFields(
            {
                name: '🎯 Active Bot Channel',
                value: `${targetChannel} (\`${targetChannel.name}\` • ID: \`${targetChannel.id}\`)`,
                inline: false
            },
            {
                name: '🔒 Strict Enforcement',
                value: 'Ab bot ke sabhi commands (`/create key`, `/delete key`) **sirf aur sirf** isi channel me kaam karenge! Kisi dusre channel me bot execute nahi hoga.',
                inline: false
            },
            {
                name: '👤 Configured By',
                value: `${interaction.user} (\`${interaction.user.tag}\`)`,
                inline: true
            }
        )
        .setFooter({ text: 'AIMKILL KEY MANAGER • Channel Security Lock' })
        .setTimestamp();

    return interaction.reply({ embeds: [embed] });
}

async function handleChannelReset(interaction) {
    if (!isOwner(interaction.member)) {
        return interaction.reply({
            content: '👑 **Access Denied:** Sirf **Owner** ya **Administrator** hi channel reset kar sakte hain!',
            ephemeral: true
        });
    }

    const config = loadConfig();
    delete config.set_channel;
    config.allowed_channels = [];
    saveConfig(config);

    // Sync with web panel API in background
    syncChannelReset().catch(() => {});

    const embed = new EmbedBuilder()
        .setColor(0xF59E0B)
        .setTitle('🔄 AIMKILL KEY MANAGER • CHANNEL RESET')
        .setDescription(`Channel lock hata diya gaya hai!`)
        .addFields(
            {
                name: '⚠️ Status',
                value: 'Abhi koi channel set nahi hai. Bot commands ko kisi channel me restrict karne ke liye `/channel set` run kare.',
                inline: false
            },
            {
                name: '👤 Reset By',
                value: `${interaction.user} (\`${interaction.user.tag}\`)`,
                inline: true
            }
        )
        .setFooter({ text: 'AIMKILL KEY MANAGER • Use /channel set to lock to a channel' })
        .setTimestamp();

    return interaction.reply({ embeds: [embed] });
}

async function handleChannelList(interaction) {
    const config = loadConfig();
    const setChannelId = config.set_channel || (config.allowed_channels?.[0] || null);

    const description = setChannelId
        ? `🎯 **Active Bot Channel:** <#${setChannelId}> (ID: \`${setChannelId}\`)\n*Bot ke sabhi commands sirf isi channel me accept honge.*`
        : '⚠️ *Koi channel set nahi hai. Commands enable karne ke liye Owner `/channel set` kare.*';

    const embed = new EmbedBuilder()
        .setColor(0x3B82F6)
        .setTitle('📋 AIMKILL KEY MANAGER • ACTIVE CHANNEL')
        .setDescription(description)
        .setFooter({ text: 'AIMKILL KEY MANAGER • Channel Security Manager' })
        .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = {
    commands: [
        {
            data: channelSubcommandData,
            execute: async (interaction) => {
                const subcommand = interaction.options.getSubcommand();
                if (subcommand === 'set') return handleChannelSet(interaction);
                if (subcommand === 'reset') return handleChannelReset(interaction);
                if (subcommand === 'list') return handleChannelList(interaction);
            }
        },
        {
            data: setChannelStandaloneData,
            execute: async (interaction) => {
                return handleChannelSet(interaction);
            }
        },
        {
            data: resetChannelStandaloneData,
            execute: async (interaction) => {
                return handleChannelReset(interaction);
            }
        }
    ]
};
