import mysql from 'mysql2/promise';

export const createMysqlConnection = async (connection, options = {}) => {
  return mysql.createConnection({
    host: connection.host,
    port: connection.port,
    user: connection.username,
    password: connection.password,
    database: options.database,
    ssl: connection.ssl ? { rejectUnauthorized: false } : undefined,
    multipleStatements: true
  });
};

