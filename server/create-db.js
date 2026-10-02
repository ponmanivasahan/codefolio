import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  try {
    const url = new URL(process.env.DATABASE_URL);
    const host = url.hostname;
    const user = url.username;
    const password = url.password;
    const port = url.port || 3306;

    const connection = await mysql.createConnection({ host, user, password, port });
    await connection.query("CREATE DATABASE IF NOT EXISTS codefolio;");
    console.log("Database created successfully!");
    await connection.end();
  } catch (err) {
    console.error("Failed to create database:", err.message);
  }
}
run();