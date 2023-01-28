import { response } from "express";


export const adminRol = ( req, res = response, next ) => {

    if( !req.user ){
        return res.status(500).json({
            msg: 'You want to verify the role without validating the token first'
        });
    }

    const { rol, name } = req.user;

    if( rol !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: `${name} is not admin - you can't do this`
        })
    }

    next();
}

export const hasRol = ( ...rols ) => {
    return ( req, res = response, next ) => {
        
        if( !req.user ){
            return res.status(500).json({
                msg: 'You want to verify the role without validating the token first'
            });
        }

        if ( !rols.includes( req.user.rol ) ){
            return res.status(401).json({
                msg: `service requires one of these roles: ${ rols }`
            })
        }

        next();
    }

}