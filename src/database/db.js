import dotenv from "dotenv";
dotenv.config();

import pg from "pg"
const {Pool} = pg;

const databaseConfig = new Pool({
  connectionString: process.env.DATABASE_URL,
});

if(process.env.MOD === "PROD"){
  databaseConfig.ssl = {
    rejectUnauthorized: false
  }
}

const connection = new Pool(databaseConfig);

export default connection;