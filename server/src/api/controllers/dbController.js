import { getConnection } from '../../services/connectionService.js';
import {
  backupDatabase,
  createDatabase,
  createTable,
  deleteRow,
  dropDatabase,
  dropTable,
  executeQuery,
  getTableData,
  insertRow,
  listDatabases,
  listTables,
  updateRow
} from '../../services/dbOperationService.js';

const resolveConnection = async (req) => {
  const connectionId = Number(req.params.connectionId);
  return getConnection(connectionId);
};

export const listDatabasesController = async (req, res) => {
  const connection = await resolveConnection(req);
  const databases = await listDatabases(connection);
  res.json(databases);
};

export const createDatabaseController = async (req, res) => {
  const connection = await resolveConnection(req);
  await createDatabase(connection, req.body.name, req.user.id);
  res.status(201).json({ message: 'База данных создана' });
};

export const dropDatabaseController = async (req, res) => {
  const connection = await resolveConnection(req);
  await dropDatabase(connection, req.params.dbName, req.user.id);
  res.status(204).send();
};

export const listTablesController = async (req, res) => {
  const connection = await resolveConnection(req);
  const tables = await listTables(connection, req.params.dbName);
  res.json(tables);
};

export const createTableController = async (req, res) => {
  const connection = await resolveConnection(req);
  await createTable(
    connection,
    req.params.dbName,
    req.body.schemaSql,
    req.user.id
  );
  res.status(201).json({ message: 'Таблица создана' });
};

export const dropTableController = async (req, res) => {
  const connection = await resolveConnection(req);
  await dropTable(connection, req.params.dbName, req.params.tableName, req.user.id);
  res.status(204).send();
};

export const getTableDataController = async (req, res) => {
  const connection = await resolveConnection(req);
  const { limit, offset } = req.query;
  const data = await getTableData(
    connection,
    req.params.dbName,
    req.params.tableName,
    Number(limit) || 50,
    Number(offset) || 0
  );
  res.json(data);
};

export const insertRowController = async (req, res) => {
  const connection = await resolveConnection(req);
  await insertRow(
    connection,
    req.params.dbName,
    req.params.tableName,
    req.body.data,
    req.user.id
  );
  res.status(201).json({ message: 'Запись создана' });
};

export const updateRowController = async (req, res) => {
  const connection = await resolveConnection(req);
  const { keyColumn, keyValue, data } = req.body;
  await updateRow(
    connection,
    req.params.dbName,
    req.params.tableName,
    keyColumn,
    keyValue,
    data,
    req.user.id
  );
  res.json({ message: 'Запись обновлена' });
};

export const deleteRowController = async (req, res) => {
  const connection = await resolveConnection(req);
  const { keyColumn, keyValue } = req.body;
  await deleteRow(
    connection,
    req.params.dbName,
    req.params.tableName,
    keyColumn,
    keyValue,
    req.user.id
  );
  res.status(204).send();
};

export const executeQueryController = async (req, res) => {
  const connection = await resolveConnection(req);
  const result = await executeQuery(
    connection,
    req.params.dbName,
    req.body.sql,
    req.user.id
  );
  res.json({ result });
};

export const backupDatabaseController = async (req, res) => {
  const connection = await resolveConnection(req);
  const result = await backupDatabase(
    connection,
    req.params.dbName,
    req.user.id
  );
  res.json(result);
};

