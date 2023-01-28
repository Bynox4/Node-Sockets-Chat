import { request, response } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export const validateJWT = async( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if ( !token ){
        return res.status(401).json({
            msg: 'No token in the request'
        })
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        // leer el usuario que correspone al uid
        const user = await User.findById( uid );

        if( !user ){
            return res.status(401).json({
                msg: 'Invalid token - user not found'
            })
        }

        // verificar si el uid tine estado true
        if ( !user.estado ){
            return res.status(401).json({
                msg: 'Invalid token - estado: false'
            })
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Invalid token'
        })
    }

}