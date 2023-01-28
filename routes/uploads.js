
import { Router } from 'express';
import { check } from 'express-validator';

import { validateFields, validateFile, validateJWT } from '../middlewares/index.js';
import { getImg, putFileCloudinary, uploadFiles } from '../controllers/uploads.js';
import { collectionsPermits } from '../helpers/index.js';


const router = Router();

router.get('/:collection/:id', [
    check('id', 'Invalid Id').isMongoId(),
    check('collection').custom( c => collectionsPermits( c, ['users', 'products'])),
    validateFields
], getImg )

router.post('/', [
    // validateJWT,
    validateFile, 
], uploadFiles )

router.put('/:collection/:id',[
    // validateJWT,
    validateFile, 
    check('id', 'Invalid Id').isMongoId(),
    check('collection').custom( c => collectionsPermits( c, ['users', 'products'])),
    validateFields
], putFileCloudinary )
// ], putFile )

export default router;