import {
  createMasterAdmin,
  isMasterCreated
} from '../../services/setupService.js';

export const getSetupStatus = async (_req, res) => {
  const masterExists = await isMasterCreated();
  res.json({ masterExists });
};

export const registerMaster = async (req, res) => {
  const { email, password, fullName } = req.body;
  const user = await createMasterAdmin({ email, password, fullName });
  res.status(201).json({
    message: 'Главный администратор создан',
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName
    }
  });
};

