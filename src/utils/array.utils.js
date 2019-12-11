const unique = (list, key) =>  Array.from(new Set(list.map(s => s[key]))).map(id => list.find(item => item[key] === id));

module.exports = {
    unique
};