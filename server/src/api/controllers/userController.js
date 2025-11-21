import {
  createUser,
  listUsers,
  removeUser
} from '../../services/authService.js';

export const createUserController = async (req, res) => {
  const { email, password, fullName } = req.body;
  const user = await createUser({
    email,
    password,
    fullName,
    role: 'admin'
  });
  res.status(201).json({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role
  });
};

export const listUsersController = async (_req, res) => {
  const users = await listUsers();
  res.json(users);
};

export const deleteUserController = async (req, res) => {
  await removeUser(Number(req.params.userId));
  res.status(204).send();
};

