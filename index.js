require("dotenv").config()
const express = require("express")
const {json} = require("body-parser")
const cors = require("cors")
const {leerColores,crearColor,borrarColor} = require("./db");

const servidor = express();

servidor.use(json()); //cualquier cosa que venga en JSON será interceptada

servidor.use(cors);

servidor.use(("/probamos"), express.static("./pruebas"))

servidor.get("/colores", async (peticion,respuesta) => {
    try{
        let colores = await leerColores();

        colores = colores.map(({_id,r,g,b}) => {return {id : _id,r,g,b}});

        respuesta.json(colores);

    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
})
servidor.post("/colores/nuevo", async (peticion,respuesta,siguiente) => {
    
    let {r,g,b} = peticion.body;

    let valido = true;

    [r,g,b].forEach( n => valido = valido && n >= 0 && n <= 255);

    if(valido){

        try{

            let resultado = await crearColor({r,g,b});

            return respuesta.json(resultado);
            //console.log(resultado);
            
        }catch(error){
            respuesta.status(500);
            return respuesta.json(error);
        }
    }

    siguiente({error : "error en parámetros"});
})

servidor.delete("/colores/borrar/:id([a-f0-9]{24})", async (peticion,respuesta) => {

    try{
         
        let cantidad = await borrarColor(peticion.params.id);

        respuesta.json({resultado : cantidad > 0 ? "ok" : "ko"})

    }catch(error){
        respuesta.status(500);
        return respuesta.json(error);
    }

    respuesta.send("delete")
})

servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400)
    respuesta.json({error : "error en la petición"})
})
servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({error : "recurso no encontrado"});
})

servidor.listen(process.env.PORT)



