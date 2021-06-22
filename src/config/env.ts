interface IENV {
  env: string;
  MONGO_URL: string;
}

const config: IENV = {
  env: process.env.NODE_ENV || '',
  MONGO_URL: process.env.MONGO_URL || '',
};

export default config;
