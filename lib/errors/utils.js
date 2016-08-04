var randomstring = require('randomstring');

function generateErrorId() {
    return randomstring.generate({
        length: 14,
        capitalization: 'uppercase'
    });
}

module.exports.generateErrorId = generateErrorId;