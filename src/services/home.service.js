const connectTable = require("../dbConfig/connectTable");
const table = require("../dbConfig/collectations");

class dataCrud{
    async findAll(){
        return await connectTable(table.USERS).find({}).toArray();
    }
}

module.exports = new dataCrud();