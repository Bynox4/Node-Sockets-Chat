import { response } from "express";
import bcryptjs from 'bcryptjs'

import User from '../models/user.js';
import generarJWT from "../helpers/generar-jwt.js";
import googleVerify from "../helpers/google-verify.js";


export const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
    
        // verificar si el email existe
        const user = await User.findOne({ email });
        if( !user ){
            return res.status(400).json({
                msg: 'User / Password is not correct'
            })
        }

        // Si el usuario está activo
        if( !user.estado ){
            return res.status(400).json({
                msg: 'User / Password is not correct - estado: false'
            })
        }

        // verificar la contraseña
        const validPass = bcryptjs.compareSync( password, user.password );
        if( !validPass ){
            return res.status(400).json({
                msg: 'User / Password is not correct - password'
            })
        }

        // Generar el JWT
        const token = await generarJWT( user.id );

        res.json({
            user,
            token
        })        
    } catch (error) {
        console.log(error);
        return req.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

export const googleSignIn = async( req, res = response ) => {

    const { id_token } = req.body;

    try {
        
        const { name, img, email } = await googleVerify( id_token );

        let user = await User.findOne({ email });

        if( !user ){
            // Tengo que crearlo
            const data = {
                name,
                email,
                password: ':P',
                img,
                google: true
            };

            user = new User( data );
            await user.save();
        } 

        // Si el usuario en DB
        if ( !user.estado ){
            return res.status(401).json({
                msg: 'Speak to the administrator, user blocked'
            })
        };

        // Generar el JWT
        const token = await generarJWT( user.id );


        res.json({
            user,
            token
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Token could not be verified'
        })
    }
}

export const renewToken = async( req, res = response ) => {

    const { user } = req;

    // Generar el JWT
    const token = await generarJWT( user.id );

    res.json({
        user,
        token
    })
}
