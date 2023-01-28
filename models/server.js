import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { socketController } from '../sockets/controller.js';
import fileUpload from 'express-fileupload';

import { auth, categorys, products, search, uploads, users } from '../routes/index.js';

import { dbConnection } from '../database/config.js';


class ServerClass {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer( this.app );
        this.io = new Server( this.server );

        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
            uploads: '/api/uploads',
            users: '/api/users',
        }

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // sockets
        this.sockets();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio public
        this.app.use( express.static('public') );

        // FileUpload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes(){
        this.app.use( this.paths.auth, auth );
        this.app.use( this.paths.categories, categorys );
        this.app.use( this.paths.products, products );
        this.app.use( this.paths.search, search );
        this.app.use( this.paths.uploads, uploads );
        this.app.use( this.paths.users, users );
    }

    sockets(){
        this.io.on('connection', ( socket ) => socketController( socket, this.io ) );
    }

    listen(){
        this.server.listen( this.port, () => {
            console.log('Servidor corriendo en el servido', this.port );
        });
    }

}

export default ServerClass 