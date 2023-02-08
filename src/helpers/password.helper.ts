import { randomBytes, pbkdf2Sync } from 'crypto';
import config from '../config';

const  { passwordConfig } = config;

export default class Password {
	static generatePassword(length: number): string {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	static hashPassword(password: string): string {
		const salt = randomBytes(passwordConfig.BYTES).toString('hex');
		const hash = pbkdf2Sync(password, salt, passwordConfig.ITERATION, passwordConfig.KEY_LENGTH, passwordConfig.DIGEST).toString('hex');
		const data = `${salt}:${hash}`;
		return Buffer.from(data).toString('base64');
	}

	static comparePassword(password: string, hash: string): boolean {
		const data = Buffer.from(hash, 'base64').toString('ascii');
		const [salt, hashPassword] = data.split(':');
		const newHash = pbkdf2Sync(password, salt, passwordConfig.ITERATION, passwordConfig.KEY_LENGTH, passwordConfig.DIGEST).toString('hex');
		return newHash === hashPassword;
	}
}