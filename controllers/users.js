import { response } from "express";
import bcryptjs from 'bcryptjs';

import User from '../models/user.js'


export const usersGet = async(req, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { estado: true };

    const [ total, users ] = await Promise.all([
        User.countDocuments( query ),
        User.find( query )
            .skip( from )
            .limit( limit )
    ]);

    res.json({
        total,
        users
    });
}

export const usersPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, ...rest } = req.body

    // TODO: validar contra base de datos
    if( password ){
        // encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync( password, salt );
    }

    const user = await User.findByIdAndUpdate( id, rest, { new: true } );

    res.json(user);
}

export const usersPost = async(req, res = response) => {

    const { name, email, password, rol } = req.body;
    const user = new User( { name, email, password, rol } );

    // encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    // Guardar en BD
    await user.save();

    res.json({
        user
    });
}

export const usersDelete = async(req, res = response) => {

    const { id } = req.params;

    const user = await User.findByIdAndUpdate( id, { estado: false });

    res.json(user);
}

export const usersPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usersPatch'
    });
}