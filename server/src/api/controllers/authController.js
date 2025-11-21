import { getUserById, login } from '../../services/authService.js';

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const result = await login(email, password);
  res.json({
    token: result.token,
    user: {
      id: result.user.id,
      email: result.user.email,
      fullName: result.user.fullName,
      role: result.user.role
    }
  });
};

export const meController = async (req, res) => {
  const user = await getUserById(req.user.id);
  res.json(user);
};

