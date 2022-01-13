const { response, request } = require( 'express' );
const Usuario = require('../models/user');
const bcrypjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generate_jwt');
const { googleVerify } = require('../helpers/google_verify');

const login = async( req, res = response )=>{

    console.log(req.body);

    const { email, password } = req.body;

    try{

        //Verificar si el email existe
        const usuario = await Usuario.findOne({email});
        if( !usuario ){
            return res.status(200).json({
                msg: 'The email or password not available - Email'
            });
        }

        //Si el usuario esta activo
        if( usuario.estado === false ){
            return res.status(200).json({
                msg: 'The email or password not available - Desactivado'
            });
        }

        //Verificar la contraseña
        const validPassword = bcrypjs.compareSync( password, usuario.password );
        if( !validPassword ){
            return res.status(200).json({
                msg: 'The email or password not available - Password'
            });
        }

        //Generar el JWT
        const token = await generateJWT( usuario.id );
        
        res.json( usuario );

    }catch(err){
        return res.status(500).json({
            msg: 'Hable con el admin'
        });
    }

}

const googleSignIn = async(req = request, res = response) =>{

    const { id_token } = req.body;

    try {
        const {email, name, img} = await googleVerify( id_token );
        
        //Verificar si el correo ya existe
        let usuario = await Usuario.findOne({email});

        if( !usuario ){
            //Crearlo
            const data = {
                name,
                email,
                password:':P',
                img,
                google: true,
                role: 'USER_ROLE'
            }

            usuario = new Usuario( data );
            await usuario.save();
        }

        //Si el usuario en DB esta desactivado
        if(!usuario.state){
            return res.status(401).json({
                msg: 'Hable con el ADMIN, usuario bloqueado'
            });
        }

        //Generar el JWT
        const token = await generateJWT( usuario.id );

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg:'El token no se pudo verificar',
            id_token
        });
    }

}

module.exports = {
    login,
    googleSignIn
}