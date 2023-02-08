const crypto = require('crypto');

function hashPassword(password){
    const salt = crypto.randomBytes(16).toString('hex'); 
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    const finalPassword = salt+"-"+hash;
    return finalPassword;
}

function comparePassword(password, hash){
    const [salt, hashPassword] = hash.split("-");
    const newHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return newHash === hashPassword;
}

module.exports = {
    hashPassword,
    comparePassword
}