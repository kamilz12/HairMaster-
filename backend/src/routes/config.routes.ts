// routes/config.routes.ts
import express from 'express';
import { getConfig } from '../controllers/config.controller';

const router = express.Router();

router.get('/', getConfig);

export default router;
