
import { Schema, model } from 'mongoose';

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        default: 0,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    desc: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    },
    img: {
        type: String
    }
});

ProductSchema.methods.toJSON = function(){
    const { __v, estado, ...product } = this.toObject();
    return product;
}

export default model( "Product", ProductSchema );