// import { Request, Response, NextFunction } from "express";
// import { HttpCode } from "../enums";
// import { JwtHelper } from "../helpers";
// import { INVALID_TOKEN } from "../utils/messages";

const { Request, Response, NextFunction } = require("express");
const {HttpCode} = require("../enums");
const {JwtHelper} = require("../helpers");
const {INVALID_TOKEN} = require("../utils/messages");

async function jwtMiddleware(req, res, next) {
    try {
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        if(token) {
            const authHeader = req.headers.authorization || '';
            const isJwt = authHeader.includes('Bearer ');            
            if(isJwt) {
                const token = authHeader.replace('Bearer ', '');
                const user = await JwtHelper.verifyToken(token);
                req.user = user;
                next();
            } else {
                res.status(HttpCode.Unauthorized).json({
                    message: INVALID_TOKEN
                });
            }
        } else {
            res.status(HttpCode.Unauthorized).json({
                message: INVALID_TOKEN
            });
        }
    } catch (error) {
        res.status(HttpCode.Unauthorized).json({
            message: INVALID_TOKEN
        });
    }
}