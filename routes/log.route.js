const express = require('express');
const router = express.Router();
const { softDeleteLog, createLog, fetchLogs, addAdditionalData, deleteAdditionalData } = require('../controllers/log.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, createLog);

router.get('/', authMiddleware, fetchLogs);

router.post("/additional/add/:userId", authMiddleware, addAdditionalData);

router.post("/additional/delete/:userId/:key", authMiddleware, deleteAdditionalData);

router.delete('/:id', authMiddleware, softDeleteLog);

module.exports = router;
