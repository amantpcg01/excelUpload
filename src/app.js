// import express, { Application } from 'express';
const express = require("express");
// import cors from 'cors';
const cors = require("cors");
const path = require("path");

// import routes from "./routes";
const routes = require("./routes");
// import { errorHandlerMiddleware } from './middlewares/error.middleware';
// const { errorHandlerMiddleware } = require("./middlewares/error.middleware");
// import { NOT_FOUND } from './utils/messages';
// const { NOT_FOUND } = require("./utils/messages");

const ENV = process.env;
const app = express();
const options = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
};

app.use(express.json());
app.use(cors(options));
app.use('/public', express.static(path.join(__dirname, './public')));
// register router
routes.map(route => {
	app.use(ENV.API_V1, route);
});

// not found handler
// app.get('**', (req, res) => {
// 	res.json({
// 		message: NOT_FOUND,
// 	});
// });

// error handler
// app.use(errorHandlerMiddleware);
module.exports = app;