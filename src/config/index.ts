import { env } from 'process';

export interface IKnex {
  config: {
    client: string;
    connection: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
    };
    pool: {
      min: number;
      max: number;
    };
    migrations: {
      tableName: string;
    };
	debug: boolean;
  };
}

export interface PasswordConfig {
  BYTES: number;
  ITERATION: number;
  KEY_LENGTH: number;
  DIGEST: string;
  ALGO: string;
}

export interface ITimer {
	days: string[];
	times: string[];
	is_active: boolean;
}

export interface ISpacesConfig {
	key: string;
	secret: string;
	bucket: string;
	region: string;
}

export interface IConfig {
  env: string;
  app: {
    port: number;
  };
  knex: IKnex;
  passwordConfig: PasswordConfig,
  security: {
    jwt: {
      secret: string;
	  expiresIn: string;
	  issuer: string;
    };
  };
  tz: string;
  doConfig: ISpacesConfig;
}

// use this snippet to create a config file from env variables
const config: IConfig = {
	env: env.NODE_ENV || 'development',
	app: {
		port: env.APP_PORT ? parseInt(env.APP_PORT, 10) : 3001,
	},
	passwordConfig:{
		BYTES: 16,
		ITERATION: 1000,
		KEY_LENGTH: 64,
		DIGEST: 'sha512',
		ALGO:'aes-256-cbc',
	},
	knex: {
		config: {
			client: env.DB_CLIENT || 'mongo',
			connection: {
				host: env.DB_HOST || 'localhost',
				port: env.DB_PORT ? parseInt(env.DB_PORT, 10) : 5432,
				user: env.DB_USER || 'root',
				password: env.DB_PASSWORD || 'root',
				database: env.DB_NAME || 'test',
			},
			pool: {
				min: 2,
				max: 20,
			},
			migrations: {
				tableName: 'knex_migrations',
			},
			debug: env.NODE_ENV === 'development'
		},
	},
	security: {
		jwt: {
			secret: env.JWT_SECRET || 'secret',
			expiresIn: env.JWT_EXPIRES_IN || '1h',
			issuer: env.JWT_ISSUER || 'Techphant Consulting Group'
		},
	},
	tz: env.TZ || '',
	doConfig: {
		key: env.AWS_ACCESS_KEY_ID || '',
		secret: env.AWS_SECRET_ACCESS_KEY || '',
		region: env.SPACES_REGION || '',
		bucket: env.SPACES_BUCKET || ''
	}
};

export default config;
