import path from 'path';
import fs from 'fs'
import { fileURLToPath } from 'url';

import { v2 as cloudinary } from 'cloudinary'


import { response } from "express";
import { uploadFile } from "../helpers/index.js";

import { Product, User } from '../models/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const uploadFiles = async( req, res = response ) => {
    try {
        // const name = await uploadFile( req.files, [ 'txt', 'md'], 'texts' );
        const name = await uploadFile( req.files, undefined, 'imgs' );
        
        res.json({
            name
        })
    } catch (msg) {
        res.status(400).json({msg})
    }
}

export const putFile = async( req, res =  response ) => {
    const { id, collection } = req.params;

    let modelo;

    switch (collection) {
        case 'users':
            modelo = await User.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No exist user id ${id}`
                })
            }
        break;
        
        case 'products':
            modelo = await Product.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No exist product id ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto'});
    }

    // Limpiar imagenes previas
    if ( modelo.img ){
        // Hay que borrar la imagen del servidor
        const pathImg = path.join( __dirname, '../uploads', collection, modelo.img );
        if ( fs.existsSync( pathImg ) ){
            fs.unlinkSync( pathImg );
        }
    }

    modelo.img = await uploadFile( req.files, undefined, collection );

    await modelo.save();

    res.json(modelo)
}


export const putFileCloudinary = async( req, res =  response ) => {
    const { id, collection } = req.params;

    let modelo;

    switch (collection) {
        case 'users':
            modelo = await User.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No exist user id ${id}`
                })
            }
        break;
        
        case 'products':
            modelo = await Product.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No exist product id ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto'});
    }

    // Limpiar imagenes previas
    if ( modelo.img ){
        const nameArr = modelo.img.split('/');
        const name = nameArr[ nameArr.length - 1 ];
        const [ public_id ] = name.split('.');
        cloudinary.uploader.destroy( `node-coffee/${collection}/${public_id}` );
    }

    const { tempFilePath } = req.files.file
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath, {folder: `node-coffee/${collection}`} )
    modelo.img = secure_url;

    await modelo.save();
    res.json( modelo )
}


export const getImg = async( req, res = response ) => {

    const { id, collection } = req.params;

    let modelo;

    switch (collection) {
        case 'users':
            modelo = await User.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No exist user id ${id}`
                })
            }
        break;
        
        case 'products':
            modelo = await Product.findById(id);
            if( !modelo ){
                return res.status(400).json({
                    msg: `No exist product id ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto'});
    }

    // Limpiar imagenes previas
    if ( modelo.img ){
        // Hay que borrar la imagen del servidor
        const pathImg = path.join( __dirname, '../uploads', collection, modelo.img );
        if ( fs.existsSync( pathImg ) ){
            return res.sendFile( pathImg )
        } 
    }

    const pathDefault = path.join( __dirname, '../assets', 'no-image.jpg' );
    return res.sendFile( pathDefault )
}
