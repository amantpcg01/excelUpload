// import { MongoClient } from "mongodb";
const {MongoClient} = require("mongodb");

class MongoHelper {
    static client;
    constructor(){}
    /*
     * connect to the mongodb database
     */
    static async connect(url) {
        this.client = new MongoClient(url,{ monitorCommands: true })
        await this.client.connect();
        return this.client;
    }

    disconnect(){
        MongoHelper.client.close();
    }

}

module.exports = MongoHelper;