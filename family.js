const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'family.json');

function load() {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, '{}');
    }

    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function save(data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function getAdopted(userId) {
    const data = load();

    return data[userId] || [];
}

function adopt(adopterId, adoptedId) {
    const data = load();

    if (!data[adopterId]) {
        data[adopterId] = [];
    }

    if (!data[adopterId].includes(adoptedId)) {
        data[adopterId].push(adoptedId);
    }

    save(data);
}

function abandon(adopterId, adoptedId) {
    const data = load();

    if (!data[adopterId]) {
        return false;
    }

    data[adopterId] = data[adopterId].filter(
        id => id !== adoptedId
    );

    save(data);

    return true;
}

module.exports = {
    getAdopted,
    adopt,
    abandon
};
