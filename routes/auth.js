
import { Router } from 'express';
import { check } from 'express-validator';

import { googleSignIn, login, renewToken } from '../controllers/auth.js';
import { validateFields, validateJWT } from '../middlewares/index.js';


const router = Router();


router.post('/login', [
    check('email', 'Email is required').isEmail(),
    check('password', 'password is required').not().isEmpty(),
    validateFields
], login );

router.post('/google', [
    check('id_token', 'id_token is required').not().isEmpty(),
    validateFields
], googleSignIn );

router.get('/', [
    validateJWT,
    validateFields
], renewToken );

export default router;