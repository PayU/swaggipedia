const config = {
  type: (process.env.DATABASE_TYPE || 'SQLITE').toUpperCase(),
  name: process.env.DATABASE_NAME || 'swaggipedia',
  address: process.env.DATABASE_ADDRESS,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  sqliteStorage: process.env.SQLITE_STORAGE || './db/swaggipedia.sqlite',
};

export default config;
