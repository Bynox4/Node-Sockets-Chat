import { response } from "express";
import { isValidObjectId } from 'mongoose';

import { Category, Product, User } from '../models/index.js'

const collectionsPermitted = [
    'users',
    'categories',
    'products',
    'rols'
];

const searchUsers = async( term = '', res = response) => {

    const isMongoID = isValidObjectId(term)
        
    if ( isMongoID ){
        const user = await User.findById(term);
        return res.json({
            results: (user) ? [ user ]: []
        });
    }

    const regex = new RegExp( term, 'i' );
    const users = await User.find({ 
        $or: [{ name: regex }, { email: regex }],
        $and: [{ estado: true }]
    });
    res.json({
        results: users
    })
}

const searchCategories = async( term = '', res = response) => {

    const isMongoID = isValidObjectId(term)
        
    if ( isMongoID ){
        const category = await Category.findById(term);
        const products = await Product.find({ 
            estado: true, category: category._id
        }).populate('category', 'name')
        return res.json({
            results: (category) ? [ category, products  ]: []
        });
    }

    const regex = new RegExp( term, 'i' );
    const categories = await Category.find({ name: regex, estado: true });


    res.json({
        results: categories
    })
}

const searchProducts = async( term = '', res = response) => {

    const isMongoID = isValidObjectId(term)
        
    if ( isMongoID ){
        const product = await Product.findById(term).populate('category', 'name');
        return res.json({
            results: (product) ? [ product ]: []
        });
    }

    const regex = new RegExp( term, 'i' );
    const products = await Product.find({ name: regex, estado: true })
                                            .populate('category', 'name');
    res.json({
        results: products
    })
}


export const search = ( req, res = response ) => {

    const { collection, term } = req.params;

    if ( !collectionsPermitted.includes(collection) ){
        res.status(400).json({
            msg: `The permitted collections are: ${collectionsPermitted}`
        })
    }

    switch (collection) {
        case 'users':
                searchUsers( term, res )
            break;
        case 'categories':
                searchCategories( term, res )
            break;
        case 'products':
                searchProducts( term, res )
            break;

        default:
            res.status(500).json({
                msg: 'forgot to do this search'
            })
    }
}

