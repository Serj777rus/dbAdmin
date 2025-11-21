import { getSummaryAnalytics } from '../../services/analyticsService.js';

export const getAnalyticsController = async (_req, res) => {
  const summary = await getSummaryAnalytics();
  res.json(summary);
};

