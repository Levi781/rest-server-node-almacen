const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');


class Server{
    
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auths :     '/api/auth',
            search :     '/api/search',
            users :     '/api/users',
            categories: '/api/categories',
            inputs :  '/api/inputs',
            products :  '/api/products',
            uploads :  '/api/uploads',
            users_data:'/api/users-data'
        }


        //Conectar a la base de datos
        this.conectarDB();
        //Middlewares
        this.middlewares();
        //Rutas de mi aplicacion
        this.routes();
    }


    async conectarDB(){


        await dbConnection();
    }


    middlewares(){

        //Cors
        this.app.use( cors() );

        //Parseo y lectura del body
        this.app.use( express.json() );

        //Directorio publico
        this.app.use( express.static('public') );

        //Fileupload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true//crea un directorio si no existe la ruta de subida de archivos
        }));
    }


    routes(){
        this.app.use(this.paths.auths, require('../routes/auth_routes'));
        this.app.use(this.paths.search, require('../routes/search_routes'));
        this.app.use(this.paths.categories, require('../routes/categories_routes'));
        this.app.use(this.paths.inputs, require('../routes/entradas_routes'));
        this.app.use(this.paths.users, require('../routes/users_routes'));
        this.app.use(this.paths.products, require('../routes/products_routes'));
        this.app.use(this.paths.uploads, require('../routes/uploads_routes'));
        this.app.use(this.paths.users_data, require('../routes/data_user_routes'));
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Servidor corriendo en ', this.port);
        });
    }

}

module.exports = Server;