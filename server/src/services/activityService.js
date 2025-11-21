import { ActivityLog } from '../models/ActivityLog.js';

export const logActivity = async ({ userId, type, description, metadata }) => {
  await ActivityLog.create({
    userId,
    type,
    description,
    metadata
  });
};

