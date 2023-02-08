var admin = require("firebase-admin");

var serviceAccount = require("./adminsdk.json");

const adminConfig = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = adminConfig;