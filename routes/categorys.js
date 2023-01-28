
import { Router } from 'express';
import { check } from 'express-validator';

import { adminRol, validateFields, validateJWT } from '../middlewares/index.js';

import { existCategoryId } from '../helpers/db-validators.js';
import { createCategory, deleteCategory, getCategories, getCategory, putCategory } from '../controllers/categorys.js';

const router = Router();

// obtener todas las categorias - publico
router.get('/', getCategories );

// obtener todas las categoria por id - publico
router.get('/:id', [
    check('id', 'Invalid Id').isMongoId(),
    check('id').custom( existCategoryId ),
    validateFields
], getCategory );

// creat categoria - privado - cualquier persona con un token valido
router.post('/', [ 
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    validateFields,
], createCategory );

// actualizar - privado - cualquier con token valido
router.put('/:id', [
    validateJWT,
    check('id', 'Invalid Id').isMongoId(),
    check('id').custom( existCategoryId ),
    check('name', 'Name is required').not().isEmpty(),
    validateFields
], putCategory );

// borrar una categoria - admin
router.delete('/:id', [
    validateJWT,
    adminRol,
    check('id', 'Invalid Id').isMongoId(),
    check('id').custom( existCategoryId ),
    validateFields
], deleteCategory );



export default router;