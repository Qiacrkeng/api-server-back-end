import mysql, { Pool } from "mysql";

const db: Pool = mysql.createPool({
  host: "127.0.0.1", // 數據庫主機
  user: "root", // 數據庫賬戶名
  password: "root", // 密碼
  database: "api-server", // 指定數據庫
});

export default db;
