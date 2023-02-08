// import dotenv from "dotenv";
const dotenv = require("dotenv");
dotenv.config();
// import http from "http";
const http = require("http");
// import fs from "fs";
const fs = require("fs");
// import app from "./src/app";
const app = require("./src/app");
// import { MongoHelper } from "./src/helpers/mongo.helper";
const MongoHelper = require("./src/helpers/mongo.helper");
const { MongoClient } = require('mongodb');
const { APP_PORT, HOST, NODE_ENV, DB_HOST, DB_PORT, DBNAME } = process.env;


// async function main() {
//   const uri = `mongodb://${DB_HOST}:${DB_PORT}/${DBNAME}`;
//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     console.log("Connected");
//   } catch (e) {
//     console.error(e);
//   } finally {
//     await client.close();
//   }
// }

// main();

// const server = http.createServer(app);
// const port = 3000;
// const host = HOST || "localhost";
// const env = NODE_ENV || "development";
// try {
//   server.listen(port, () => {
//     console.log(`Server running at http://${host}:${port} in ${env} mode`);
//   });
// } catch (error) {
//   console.log(error);
// }


// create http server
const runServer = async () => {
  const server = http.createServer(app);
  const port = 3000;
  const host = HOST || "localhost";
  const env = NODE_ENV || "development";
  try {
    server.listen(port, () => {
      console.log(`Server running at http://${host}:${port} in ${env} mode`);
    });
  } catch (error) {
    console.log(error);
  }
  try {
    let connection = `mongodb://${DB_HOST}:${DB_PORT}/${DBNAME}`;
    await MongoHelper.connect(connection);
    console.info(`Connected to Mongo!`, connection);
  }
  catch (error) {
    console.error("Unable to connect mongo!", error);
  }
}

runServer();