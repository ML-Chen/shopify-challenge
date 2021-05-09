import express from 'express';
import * as imageController from '../controllers/imageController';

const router = express.Router();
router.post('/images', imageController.addImages);
router.delete('/images/all', imageController.deleteAllImages);
router.delete('/images', imageController.deleteImages);
router.get('/images', imageController.getImages);

export default router;
