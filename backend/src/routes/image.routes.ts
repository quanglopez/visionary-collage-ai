import { Router } from 'express';
import {
  uploadImage,
  getUserImages,
  deleteImage,
  upload,
} from '../controllers/image.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate); // Protect all image routes

router.post('/', upload.single('image'), uploadImage);
router.get('/', getUserImages);
router.delete('/:id', deleteImage);

export default router;
