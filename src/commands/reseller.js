const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { loadConfig, saveConfig } = require('../utils/config');
const { isOwner } = require('../utils/permissions');
const { syncResellerAdd, syncResellerDelete } = require('../utils/api');

// Subcommand version: /reseller add, /reseller remove, /reseller list
const resellerSubcommandData = new SlashCommandBuilder()
    .setName('reseller')
    .setDescription('Manage authorized license resellers (Owner only)')
    .addSubcommand(subcommand =>
        subcommand
            .setName('add')
            .setDescription('Grant key generation permissions to a user (Owner only)')
            .addUserOption(option =>
                option
                    .setName('user')
                    .setDescription('The Discord user to authorize as reseller')
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('remove')
            .setDescription('Revoke key generation permissions from a user (Owner only)')
            .addUserOption(option =>
                option
                    .setName('user')
                    .setDescription('The Discord user to revoke')
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('list')
            .setDescription('List all authorized resellers')
    );

// Standalone aliases: /reseller_add and /reseller_remove
const resellerAddStandaloneData = new SlashCommandBuilder()
    .setName('reseller_add')
    .setDescription('Grant key generation permissions to a user (Owner only)')
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('The Discord user to authorize as reseller')
            .setRequired(true)
    );

const resellerRemoveStandaloneData = new SlashCommandBuilder()
    .setName('reseller_remove')
    .setDescription('Revoke key generation permissions from a user (Owner only)')
    .addUserOption(option =>
        option
            .setName('user')
            .setDescription('The Discord user to revoke')
            .setRequired(true)
    );

async function handleResellerAdd(interaction) {
    if (!isOwner(interaction.member)) {
        return interaction.reply({
            content: '👑 **Access Denied:** Sirf **Owner** ya **Administrator** hi naye resellers add kar sakte hain!',
            ephemeral: true
        });
    }

    const targetUser = interaction.options.getUser('user');
    const config = loadConfig();

    if (!config.resellers.includes(targetUser.id)) {
        config.resellers.push(targetUser.id);
        saveConfig(config);
    }

    // Sync with web panel API
    syncResellerAdd(targetUser.id).catch(() => {});

    const embed = new EmbedBuilder()
        .setColor(0x10B981)
        .setTitle('👔 AIMKILL KEY MANAGER • RESELLER ADDED')
        .setDescription(`User ${targetUser} ko authorized reseller bana diya gaya hai!`)
        .addFields(
            {
                name: '👤 Reseller',
                value: `${targetUser} (\`${targetUser.tag}\` • ID: \`${targetUser.id}\`)`,
                inline: false
            },
            {
                name: '🔑 Clearance',
                value: 'Ab ye user set kiye gaye channel me `/create key` aur `/delete key` use kar sakte hain.',
                inline: false
            },
            {
                name: '🛡️ Authorized By',
                value: `${interaction.user} (\`${interaction.user.tag}\`)`,
                inline: true
            }
        )
        .setFooter({ text: 'AIMKILL KEY MANAGER • Reseller Access Center' })
        .setTimestamp();

    return interaction.reply({ embeds: [embed] });
}

async function handleResellerRemove(interaction) {
    if (!isOwner(interaction.member)) {
        return interaction.reply({
            content: '👑 **Access Denied:** Sirf **Owner** ya **Administrator** hi resellers remove kar sakte hain!',
            ephemeral: true
        });
    }

    const targetUser = interaction.options.getUser('user');
    const config = loadConfig();

    config.resellers = config.resellers.filter(id => id !== targetUser.id);
    saveConfig(config);

    // Sync with web panel API
    syncResellerDelete(targetUser.id).catch(() => {});

    const embed = new EmbedBuilder()
        .setColor(0xEF4444)
        .setTitle('🚫 AIMKILL KEY MANAGER • RESELLER REVOKED')
        .setDescription(`User ${targetUser} ki reseller permissions khatam kar di gayi hain!`)
        .addFields(
            {
                name: '👤 User',
                value: `${targetUser} (\`${targetUser.tag}\` • ID: \`${targetUser.id}\`)`,
                inline: false
            },
            {
                name: '⚡ Status',
                value: 'Ab ye user license key create ya delete nahi kar payenge.',
                inline: false
            },
            {
                name: '🛡️ Revoked By',
                value: `${interaction.user} (\`${interaction.user.tag}\`)`,
                inline: true
            }
        )
        .setFooter({ text: 'AIMKILL KEY MANAGER • Reseller Access Center' })
        .setTimestamp();

    return interaction.reply({ embeds: [embed] });
}

async function handleResellerList(interaction) {
    const config = loadConfig();
    const resellers = config.resellers || [];

    const description = resellers.length > 0
        ? resellers.map((id, index) => `${index + 1}. <@${id}> (ID: \`${id}\`)`).join('\n')
        : '⚠️ *Abhi koi reseller add nahi kiya gaya hai. (Server Owner aur Administrators ko by default key generate karne ka access hota hai).*';

    const embed = new EmbedBuilder()
        .setColor(0x8B5CF6)
        .setTitle('📋 AIMKILL KEY MANAGER • RESELLERS LIST')
        .setDescription(description)
        .setFooter({ text: 'AIMKILL KEY MANAGER • Reseller Access Center' })
        .setTimestamp();

    return interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = {
    commands: [
        {
            data: resellerSubcommandData,
            execute: async (interaction) => {
                const subcommand = interaction.options.getSubcommand();
                if (subcommand === 'add') return handleResellerAdd(interaction);
                if (subcommand === 'remove') return handleResellerRemove(interaction);
                if (subcommand === 'list') return handleResellerList(interaction);
            }
        },
        {
            data: resellerAddStandaloneData,
            execute: async (interaction) => {
                return handleResellerAdd(interaction);
            }
        },
        {
            data: resellerRemoveStandaloneData,
            execute: async (interaction) => {
                return handleResellerRemove(interaction);
            }
        }
    ]
};
