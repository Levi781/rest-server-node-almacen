const Usuario = require('../models/user');
const Role  = require('../models/role');
const { Categoria, Producto } = require('../models');

const esRolValido = async (role= '') =>{
    const existeRol = await Role.findOne( {nombre: role} );

    //console.log("PASO POR AQUI: ",role,existeRol);

    if( !existeRol ){
        //console.log('NO EXISTE');
        throw new Error(`El rol ${role} no esta registrado`);
    }
}


const emailExiste = async ( email = '' )=>{

    const existeEmail = await Usuario.findOne({email});

    if( existeEmail ){
        throw new Error(`El email ${ email } ya esta en uso`);
    }
}


const existUserId = async ( id  )=>{

    const existeUser = await Usuario.findById( id.toString() );

    if( !existeUser){
        throw new Error( 'El id no existe!' );
    }
}

const isAdminUser = async( id )=>{
    
    const isAdmin = await Usuario.findById( id.toString() );

    if( isAdmin.role !== 'ADMIN_ROLE' ){
        throw new Error( 'el usuario no cuenta con los suficientes privilegios');
    }
}

const existCategoria = async( id )=>{

    const existeCategoria = await Categoria.findById( id );
    if(!existeCategoria) {
        throw new Error('La categoria no existe');
    }

}

const existProducto = async( id )=>{

    const existeProducto = await Producto.findById( id );
    if(!existeProducto) {
        throw new Error('El producto no existe');
    }

}

/*
Validar colecciones permitidas
*/
const coleccionesPermitidas = ( coleccion = '', colecciones = [] )=>{

    const existe = colecciones.includes( coleccion );

    if(!existe){
        throw new Error(`La coleccion ${coleccion} no es permitida. Solo se permite ${colecciones}`);
    }

    return true;
}

module.exports = {
    esRolValido,
    emailExiste,
    existUserId,
    existCategoria,
    existProducto,
    coleccionesPermitidas,
    isAdminUser
}