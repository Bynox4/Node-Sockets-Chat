
import { Router } from 'express';
import { search } from '../controllers/seach.js';


const router = Router();

router.get('/:collection/:term', search )

export default router;