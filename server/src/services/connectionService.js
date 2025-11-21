import { DbConnection } from '../models/DbConnection.js';
import { badRequest, notFound } from '../utils/httpError.js';

export const createConnection = async ({
  name,
  host,
  port,
  username,
  password,
  ssl,
  createdBy
}) => {
  const exists = await DbConnection.findOne({ where: { name } });
  if (exists) {
    throw badRequest('Подключение с таким именем уже существует');
  }
  return DbConnection.create({
    name,
    host,
    port,
    username,
    password,
    ssl,
    createdBy
  });
};

export const listConnections = () => DbConnection.findAll();

export const getConnection = async (id) => {
  const connection = await DbConnection.findByPk(id);
  if (!connection) {
    throw notFound('Подключение не найдено');
  }
  return connection;
};

export const updateConnection = async (id, payload) => {
  const connection = await getConnection(id);
  await connection.update(payload);
  return connection;
};

export const deleteConnection = async (id) => {
  const connection = await getConnection(id);
  await connection.destroy();
};

