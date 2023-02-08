const { sign, verify } = require("jsonwebtoken");
const { nanoid }  = require("nanoid");
const { config }  = require("../config");
const { security } = config;
const { jwt } = security;

class JwtHelper {
    generateToken(payload = {}) {
        let jti = nanoid(15);
        let token = sign(
            payload,
            jwt.secret,
            {
                expiresIn: jwt.expiresIn,
                issuer: jwt.issuer,
                algorithm: 'HS512',
                jwtid: jti
            }
        );
        return {
            jti: jti,
            token: token
        };
    }
    
    static verifyToken(token = '') {
        return new Promise((resolve, reject) => {
            try {
                let decoded = verify(token, jwt.secret);
                resolve(decoded);
            } catch (err) {
                reject(err);
            }
        });
    }
    
    static generateOtpToken(payload = {}) {
        let jti = nanoid();
        let token = sign(
            payload,
            jwt.secret,
            {
                expiresIn: '1h',
                issuer: jwt.issuer,
                algorithm: 'HS512',
                jwtid: jti
            }
        );
        return {
            jti: jti,
            token: token
        };
    }
    
    static createVerifyToken(payload = {}) {
        return sign(
            payload,
            jwt.secret,
            {
                expiresIn: '5h',
                issuer: jwt.issuer,
                algorithm: 'HS512'
            }
        );
    }
}