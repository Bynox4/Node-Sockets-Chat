import { response } from "express";

import { Product } from '../models/index.js'


export const getProducts = async( req, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { estado: true };

    const [ total, products ] = await Promise.all([
        Product.countDocuments( query ),
        Product.find( query )
            .skip( from )
            .limit( limit )
            .populate('category', 'name')
            .populate('user', 'name')
    ]);

    res.json({
        total,
        products
    });
} 

export const getProduct = async( req, res = response) => {

    const { id } = req.params;

    const product = await Product.findById( id )
                                    .populate('category', 'name')
                                    .populate('user', 'name');

    if ( !product.estado ){
        res.status(401).json({
            msg: 'Invalid ID'
        })
    }

    res.json({
        product
    })

}

export const createProducts = async( req, res = response ) => {

    const { estado, user, ...body } = req.body;

    const productDB = await Product.findOne({ name: body.name });

    if ( productDB ){
        return res.status(400).json({
            msg: `Product ${ productDB.name }, alredy exist`
        });
    }

    // generar la data a guardar
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id,
    }

    const product = new Product( data );

    // guardar Db
    await product.save();

    res.status(201).json( product );
}

export const putProducts = async( req, res = response ) => {
    try {
        const { id } = req.params;
    
        const { user, estado, ...data } = req.body;
    
        if( data.name ){
            data.name = data.name.toUpperCase();
        }
        data.user = req.user._id;
    
        const product = await Product.findByIdAndUpdate( id , data , { new: true } );
    
        res.json( product )
    } catch (error) {
        res.status(406).json(error.codeName)
    }
}

export const deleteProducts = async( req, res = response ) => {

    const { id } = req.params;

    const product = await Product.findByIdAndUpdate( id, { estado: false })

    res.json(product)
}