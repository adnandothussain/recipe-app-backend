interface IToken {
  ISSUER: string;
  AUDIENCE: string;
  ACCESS_TOKEN_VALIDITY_DAYS: number;
}

interface IENV {
  env: string;
  MONGO_URL: string;
  LOG_DIR: string;
  token: IToken;
}

const config: IENV = {
  env: process.env.NODE_ENV || '',
  MONGO_URL: process.env.MONGO_URL || '',
  LOG_DIR: process.env.LOG_DIR || '',
  token: {
    ISSUER: process.env.ISSUER || '',
    AUDIENCE: process.env.AUDIENCE || '',
    ACCESS_TOKEN_VALIDITY_DAYS: Number(process.env.ACCESS_TOKEN_VALIDITY_DAYS || '7'),
  },
};

export default config;
