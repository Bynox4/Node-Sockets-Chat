import { Category, Product, Rol, User } from '../models/index.js';

/*
    Users
*/

export const rolValid = async(rol = '') => {
    const existRol = await Rol.findOne({ rol });
    if( !existRol ){
        throw new Error(`${ rol } rol is not registered in the DB`)
    }
}

export const emailExist = async( email = '' )=> {
    const existEmail = await User.findOne({ email });
    if ( existEmail ){
        throw new Error(`${email} email already exists`)
    }
}

export const existUserId = async( id )=> {
    const existUser = await User.findById( id );
    if ( !existUser ){
        throw new Error(`id: ${id}, does not exist`)
    }
}

/*
    Categories
*/

export const existCategoryId = async( id )=> {
    const existUser = await Category.findById( id );
    if ( !existUser ){
        throw new Error(`id: ${id}, does not exist`)
    }
}

/*
    Products
*/

export const existProductId = async( id )=> {
    const existProduct = await Product.findById( id );
    if ( !existProduct ){
        throw new Error(`id: ${id}, does not exist`)
    }
}

/*
    Validate allowed collections
*/
export const collectionsPermits = ( collection = '', collections = []) => {

    const including = collections.includes( collection );
    if ( !including ){
        throw new Error(`collection is not allowed ${collection} || ${collections}`)
    }
    return true;
}