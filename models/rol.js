
import { Schema, model } from 'mongoose';

const RolSchema = Schema({
    rol: {
        type: String,
        required: [true, 'Rol is required']
    }
});

export default model( "Rol", RolSchema );