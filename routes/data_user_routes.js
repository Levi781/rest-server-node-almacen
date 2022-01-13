const { Router, request, response } = require('express');
const { check } = require('express-validator');
const  UsuarioData  = require('../models/user_data');


const router = Router();

router.get('/',  async ( req = request, res = response )=> {

    const data = await UsuarioData.find({estado: true}).sort({nombre: 1});
    
    res.json({
        ok: true,
        users: data
    });

    
});

router.post('/', async (req = request, res = response) =>{
    const { nombre, apellidos, depto, puesto } = req.body;
    if( !nombre || !apellidos || !depto || !puesto){
        return res.status(400).json({
            ok: false,
            msg: 'Faltan datos'
        });
    }
    const usuario = new UsuarioData({nombre,apellidos,depto,puesto});
    await  usuario.save();

    res.status(201).json({
        ok: true,
        usuario
    });
});


router.put('/:id', 
    [
        check('id', 'El id debe ser valido').isMongoId(),
    ]
    ,
    async( req = request, res = response) =>{

        const {id} = req.params;
        const actualizado = await UsuarioData.findByIdAndUpdate(id, req.body, {new: true});

        res.status(201).json({
            ok: true,
            result: actualizado
        });
    }
);


router.delete('/:id',
    //Middlewares
    [
        check('id', 'Debe ser un id valido de mongo').isMongoId(),
    ],

    async(req = request, res = response) =>{
        const { id } = req.params;
        console.log(id);

        const user = await UsuarioData.findById( id );

        if( !user ){
            return res.status(400).json({
                ok: false,
                msg: 'El id no existe'
            });
        }

        const borrar = await UsuarioData.findByIdAndUpdate(id, { estado: false}, {new: true} );

        res.status(201).json({
            ok: true,
            results: borrar
        });


    }
);


module.exports =  router ;