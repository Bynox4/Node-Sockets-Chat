import { response } from "express";
import { Category } from '../models/index.js'


// obtenerCategorias - paginado - total - populate
export const getCategories = async( req, res = response ) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { estado: true };

    const [ total, categories ] = await Promise.all([
        Category.countDocuments( query ),
        Category.find( query )
            .skip( from )
            .limit( limit )
            .populate('user', 'name')
    ]);

    res.json({
        total,
        categories
    });
}

// obtenerCategoria - populate {}
export const getCategory = async( req, res = response ) => {

    const { id } = req.params;

    const category = await Category.findById( id ).populate('user', 'name');

    if ( !category.estado ){
        res.status(401).json({
            msg: 'Invalid ID'
        })
    }


    res.json({
        category
    })
}

export const createCategory = async( req, res = response ) => {

    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });

    if ( categoryDB ){
        return res.status(400).json({
            msg: `Category ${ categoryDB.name }, alredy exist`
        });
    }

    // Generar la data a guardar
    const data = {
        name,
        user: req.user._id
    }

    const category = new Category( data );

    // Guardar DB
    await category.save();

    res.status(201).json(category)

}

// actualizarCategoria 
export const putCategory = async( req, res = response ) => {

    try {
        const { id } = req.params;
        const { estado, user, ...data} = req.body;

        data.name = data.name.toUpperCase();
        data.user = req.user._id;

        const category = await Category.findByIdAndUpdate( id , data, { new: true } );

        res.json( category )
    } catch (error) {
        res.status(406).json(error.codeName)   
    }
}

// borrarCategoria - estado: false
export const deleteCategory = async( req, res = response ) => {
    
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate( id, { estado: false }, {new: true})

    res.json( category )
}