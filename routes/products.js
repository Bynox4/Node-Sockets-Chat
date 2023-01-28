
import { Router } from 'express';
import { check } from 'express-validator';

import { adminRol, validateFields, validateJWT } from '../middlewares/index.js';

import { createProducts, deleteProducts, getProduct, getProducts, putProducts } from '../controllers/products.js';
import { existCategoryId, existProductId } from '../helpers/db-validators.js';

const router = Router();


router.get('/', getProducts );

router.get('/:id', [
    check('id', 'Invalid Id').isMongoId(),
    check('id').custom( existProductId ),
    validateFields
], getProduct );

router.post('/', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('category', 'Invalid ID').isMongoId(),
    check('category').custom( existCategoryId ),
    validateFields
], createProducts );

router.put('/:id', [
    validateJWT,
    check('id', 'Invalid Id').isMongoId(),
    check('id').custom( existProductId ),
    validateFields
], putProducts );

router.delete('/:id', [
    validateJWT,
    adminRol,
    check('id', 'Invalid Id').isMongoId(),
    check('id').custom( existProductId ),
    validateFields
], deleteProducts );


export default router;