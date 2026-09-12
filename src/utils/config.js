const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', '..', 'config.json');

const DEFAULT_CONFIG = {
    allowed_channels: [],
    resellers: []
};

function loadConfig() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) {
            saveConfig(DEFAULT_CONFIG);
            return { ...DEFAULT_CONFIG };
        }
        const data = fs.readFileSync(CONFIG_PATH, 'utf8');
        return Object.assign({}, DEFAULT_CONFIG, JSON.parse(data));
    } catch (err) {
        console.error('Error loading config:', err);
        return { ...DEFAULT_CONFIG };
    }
}

function saveConfig(config) {
    try {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error('Error saving config:', err);
        return false;
    }
}

module.exports = {
    loadConfig,
    saveConfig
};
