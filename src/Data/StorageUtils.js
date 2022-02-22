
function load(key, defaultValue) {
    let item = localStorage.getItem(key);
    if (!item) {
        save(key, defaultValue);
        return defaultValue;
    }
    return JSON.parse(item);
}

function save(key, value) {
    if (typeof defaultValue !== 'string') {
        value = JSON.stringify(value)
    }
    localStorage.setItem(key, value);
}

module.exports = {
    load: load,
    save: save,
}