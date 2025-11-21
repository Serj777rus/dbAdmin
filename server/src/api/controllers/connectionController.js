import {
  createConnection,
  deleteConnection,
  getConnection,
  listConnections,
  updateConnection
} from '../../services/connectionService.js';

export const createConnectionController = async (req, res) => {
  const connection = await createConnection({
    ...req.body,
    createdBy: req.user.id
  });
  res.status(201).json(connection);
};

export const listConnectionsController = async (_req, res) => {
  const connections = await listConnections();
  res.json(connections);
};

export const updateConnectionController = async (req, res) => {
  const connection = await updateConnection(Number(req.params.id), req.body);
  res.json(connection);
};

export const deleteConnectionController = async (req, res) => {
  await deleteConnection(Number(req.params.id));
  res.status(204).send();
};

export const getConnectionController = async (req, res) => {
  const connection = await getConnection(Number(req.params.id));
  res.json(connection);
};

