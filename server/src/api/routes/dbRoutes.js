import { Router } from 'express';
import { authGuard } from '../middlewares/authMiddleware.js';
import {
  backupDatabaseController,
  createDatabaseController,
  createTableController,
  deleteRowController,
  dropDatabaseController,
  dropTableController,
  executeQueryController,
  getTableDataController,
  insertRowController,
  listDatabasesController,
  listTablesController,
  updateRowController
} from '../controllers/dbController.js';
import {
  createDatabaseValidator,
  createTableValidator,
  deleteRowValidator,
  insertRowValidator,
  queryValidator,
  updateRowValidator
} from '../validators/dbValidators.js';
import { validate } from '../middlewares/validate.js';

const router = Router();
router.use(authGuard);

router.get('/:connectionId/databases', listDatabasesController);
router.post(
  '/:connectionId/databases',
  createDatabaseValidator,
  validate,
  createDatabaseController
);
router.delete('/:connectionId/databases/:dbName', dropDatabaseController);

router.get(
  '/:connectionId/databases/:dbName/tables',
  listTablesController
);
router.post(
  '/:connectionId/databases/:dbName/tables',
  createTableValidator,
  validate,
  createTableController
);
router.delete(
  '/:connectionId/databases/:dbName/tables/:tableName',
  dropTableController
);

router.get(
  '/:connectionId/databases/:dbName/tables/:tableName/data',
  getTableDataController
);
router.post(
  '/:connectionId/databases/:dbName/tables/:tableName/data',
  insertRowValidator,
  validate,
  insertRowController
);
router.put(
  '/:connectionId/databases/:dbName/tables/:tableName/data',
  updateRowValidator,
  validate,
  updateRowController
);
router.delete(
  '/:connectionId/databases/:dbName/tables/:tableName/data',
  deleteRowValidator,
  validate,
  deleteRowController
);

router.post(
  '/:connectionId/databases/:dbName/query',
  queryValidator,
  validate,
  executeQueryController
);
router.post('/:connectionId/databases/:dbName/backup', backupDatabaseController);

export default router;

