import { Op } from 'sequelize';
import { MetricSnapshot } from '../models/MetricSnapshot.js';
import { analyticsConfig } from '../config/env.js';

export const registerQueryMetrics = async ({
  success,
  databasesCount,
  tablesCount,
  storageUsedMb,
  activeUsers
}) => {
  await MetricSnapshot.create({
    totalQueries: 1,
    successfulQueries: success ? 1 : 0,
    failedQueries: success ? 0 : 1,
    databasesCount: databasesCount ?? 0,
    tablesCount: tablesCount ?? 0,
    storageUsedMb: storageUsedMb ?? 0,
    activeUsers: activeUsers ?? 0
  });
};

export const getSummaryAnalytics = async () => {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - analyticsConfig.retentionDays);

  const snapshots = await MetricSnapshot.findAll({
    where: {
      collectedAt: {
        [Op.gte]: sinceDate
      }
    }
  });

  const aggregate = snapshots.reduce(
    (acc, snap) => {
      acc.totalQueries += snap.totalQueries;
      acc.successfulQueries += snap.successfulQueries;
      acc.failedQueries += snap.failedQueries;
      acc.databasesCount = Math.max(acc.databasesCount, snap.databasesCount);
      acc.tablesCount = Math.max(acc.tablesCount, snap.tablesCount);
      acc.storageUsedMb = Math.max(acc.storageUsedMb, snap.storageUsedMb);
      acc.activeUsers = Math.max(acc.activeUsers, snap.activeUsers);
      return acc;
    },
    {
      totalQueries: 0,
      successfulQueries: 0,
      failedQueries: 0,
      databasesCount: 0,
      tablesCount: 0,
      storageUsedMb: 0,
      activeUsers: 0
    }
  );

  return {
    periodDays: analyticsConfig.retentionDays,
    ...aggregate
  };
};

