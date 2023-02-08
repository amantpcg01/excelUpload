const MongoHelper = require("../helpers/mongo.helper");
const connectTable =  (collection) => {
    return MongoHelper.client.db(process.env.DBNAME).collection(collection);
}

module.exports = connectTable;