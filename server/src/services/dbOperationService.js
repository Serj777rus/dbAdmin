import fs from 'node:fs/promises';
import path from 'node:path';
import { fileConfig } from '../config/env.js';
import { createMysqlConnection } from '../utils/mysqlClient.js';
import { badRequest, HttpError } from '../utils/httpError.js';
import { logActivity } from './activityService.js';
import { registerQueryMetrics } from './analyticsService.js';

const ensureBackupDir = async () => {
  await fs.mkdir(fileConfig.backupDir, { recursive: true });
};

const fetchStats = async (connection) => {
  const client = await createMysqlConnection(connection);
  const [dbStats] = await client.query('SHOW DATABASES');

  const [sizeRows] = await client.query(`
    SELECT table_schema as db,
           COUNT(*) as tables,
           SUM(data_length) as data_length,
           SUM(index_length) as index_length
    FROM information_schema.tables
    GROUP BY table_schema
  `);
  await client.end();

  const databasesCount = dbStats.length;
  const tablesCount = sizeRows.reduce((acc, row) => acc + (row.tables || 0), 0);
  const storageUsedMb =
    sizeRows.reduce(
      (acc, row) => acc + Number(row.data_length || 0) + Number(row.index_length || 0),
      0
    ) /
    (1024 * 1024);

  return { databasesCount, tablesCount, storageUsedMb };
};

export const listDatabases = async (connection) => {
  const client = await createMysqlConnection(connection);
  const [rows] = await client.query('SHOW DATABASES');
  await client.end();
  return rows.map((row) => row.Database);
};

export const createDatabase = async (connection, dbName, userId) => {
  const client = await createMysqlConnection(connection);
  await client.query(`CREATE DATABASE \`${dbName}\``);
  await client.end();

  await logActivity({
    userId,
    type: 'create_db',
    description: `Создана база данных ${dbName}`,
    metadata: { connection: connection.name }
  });

  const stats = await fetchStats(connection);
  await registerQueryMetrics({ success: true, ...stats });
};

export const dropDatabase = async (connection, dbName, userId) => {
  const client = await createMysqlConnection(connection);
  await client.query(`DROP DATABASE \`${dbName}\``);
  await client.end();

  await logActivity({
    userId,
    type: 'drop_db',
    description: `Удалена база данных ${dbName}`,
    metadata: { connection: connection.name }
  });

  const stats = await fetchStats(connection);
  await registerQueryMetrics({ success: true, ...stats });
};

export const listTables = async (connection, dbName) => {
  const client = await createMysqlConnection(connection, { database: dbName });
  const [rows] = await client.query('SHOW TABLE STATUS');
  await client.end();
  return rows;
};

export const createTable = async (connection, dbName, schemaSql, userId) => {
  const client = await createMysqlConnection(connection, { database: dbName });
  await client.query(schemaSql);
  await client.end();

  await logActivity({
    userId,
    type: 'create_table',
    description: `Создана таблица в базе ${dbName}`,
    metadata: {}
  });
  const stats = await fetchStats(connection);
  await registerQueryMetrics({ success: true, ...stats });
};

export const dropTable = async (connection, dbName, table, userId) => {
  const client = await createMysqlConnection(connection, { database: dbName });
  await client.query(`DROP TABLE \`${table}\``);
  await client.end();
  await logActivity({
    userId,
    type: 'drop_table',
    description: `Удалена таблица ${table}`,
    metadata: {}
  });
  await registerQueryMetrics({ success: true });
};

export const getTableData = async (
  connection,
  dbName,
  table,
  limit = 50,
  offset = 0
) => {
  const client = await createMysqlConnection(connection, { database: dbName });
  const [rows] = await client.query(`SELECT * FROM \`${table}\` LIMIT ?, ?`, [
    offset,
    limit
  ]);
  const [columns] = await client.query(`SHOW COLUMNS FROM \`${table}\``);
  await client.end();
  return { rows, columns };
};

export const executeQuery = async (connection, dbName, sql, userId) => {
  const client = await createMysqlConnection(connection, { database: dbName });
  try {
    const [result] = await client.query(sql);
    await registerQueryMetrics({ success: true });
    await logActivity({
      userId,
      type: 'query',
      description: `Выполнен запрос`,
      metadata: { dbName, sql }
    });
    return result;
  } catch (error) {
    await registerQueryMetrics({ success: false });
    throw new HttpError(400, error.message);
  } finally {
    await client.end();
  }
};

export const insertRow = async (connection, dbName, table, data, userId) => {
  const client = await createMysqlConnection(connection, { database: dbName });
  const columns = Object.keys(data)
    .map((key) => `\`${key}\``)
    .join(', ');
  const placeholders = Object.keys(data)
    .map(() => '?')
    .join(', ');
  const values = Object.values(data);
  await client.execute(
    `INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders})`,
    values
  );
  await client.end();
  await logActivity({
    userId,
    type: 'query',
    description: `Добавлена запись в ${table}`,
    metadata: { dbName }
  });
  await registerQueryMetrics({ success: true });
};

export const updateRow = async (
  connection,
  dbName,
  table,
  keyColumn,
  keyValue,
  data,
  userId
) => {
  if (!keyColumn) {
    throw badRequest('Необходимо указать ключевой столбец');
  }
  const client = await createMysqlConnection(connection, { database: dbName });
  const assignments = Object.keys(data)
    .map((key) => `\`${key}\` = ?`)
    .join(', ');
  const values = [...Object.values(data), keyValue];
  await client.execute(
    `UPDATE \`${table}\` SET ${assignments} WHERE \`${keyColumn}\` = ?`,
    values
  );
  await client.end();
  await logActivity({
    userId,
    type: 'query',
    description: `Обновлена запись в ${table}`,
    metadata: { dbName }
  });
  await registerQueryMetrics({ success: true });
};

export const deleteRow = async (
  connection,
  dbName,
  table,
  keyColumn,
  keyValue,
  userId
) => {
  if (!keyColumn) {
    throw badRequest('Необходимо указать ключевой столбец');
  }
  const client = await createMysqlConnection(connection, { database: dbName });
  await client.execute(
    `DELETE FROM \`${table}\` WHERE \`${keyColumn}\` = ?`,
    [keyValue]
  );
  await client.end();
  await logActivity({
    userId,
    type: 'query',
    description: `Удалена запись в ${table}`,
    metadata: { dbName }
  });
  await registerQueryMetrics({ success: true });
};

export const backupDatabase = async (connection, dbName, userId) => {
  await ensureBackupDir();
  const client = await createMysqlConnection(connection, { database: dbName });
  const [tables] = await client.query('SHOW TABLES');

  const dumpParts = [
    `-- Бэкап базы данных ${dbName} (${new Date().toISOString()})`
  ];

  for (const tableRow of tables) {
    const tableName = Object.values(tableRow)[0];
    const [[createStatement]] = await client.query(
      `SHOW CREATE TABLE \`${tableName}\``
    );
    dumpParts.push(createStatement['Create Table'] + ';');

    const [rows] = await client.query(`SELECT * FROM \`${tableName}\``);
    if (Array.isArray(rows) && rows.length > 0) {
      const values = rows.map((row) => {
        const serialized = Object.values(row)
          .map((value) =>
            value === null ? 'NULL' : `'${String(value).replace(/'/g, "\\'")}'`
          )
          .join(', ');
        return `(${serialized})`;
      });
      dumpParts.push(
        `INSERT INTO \`${tableName}\` VALUES ${values.join(', ')};`
      );
    }
  }

  await client.end();

  const backupPath = path.join(
    fileConfig.backupDir,
    `${dbName}_${Date.now()}.sql`
  );
  await fs.writeFile(backupPath, dumpParts.join('\n\n'), 'utf-8');

  await logActivity({
    userId,
    type: 'backup',
    description: `Создан бэкап базы ${dbName}`,
    metadata: { backupPath }
  });
  await registerQueryMetrics({ success: true });

  return { backupPath };
};
